"use client";

import type { Session, SupabaseClient, User } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { getUserBookStatuses, saveBookStatus, type BookStatus } from "@/lib/supabase/books";
import { getUserBadges, type UserBadge } from "@/lib/supabase/badges";
import { badgeById } from "@/data/badges";
import { getUserCharacterFavorites, saveCharacterFavorite, type CharacterFavorite } from "@/lib/supabase/characters";
import { uploadUserAvatar } from "@/lib/supabase/profile";
import booksData from "@/data/books.json";
import { getSeriesProgressForSeries, levelRank, type SeriesLevel } from "@/lib/seriesProgress";
import type { Book } from "@/lib/types";

export type BadgeAchievement = UserBadge;

type SeriesAchievement = {
  series: string;
  label: string;
  level: Exclude<SeriesLevel, "started">;
  levelLabel: string;
  percentage: number;
  readCount: number;
  totalCount: number;
  color: string;
  levelColor: string;
  iconPath?: string;
};

type AuthContextValue = {
  configured: boolean;
  loading: boolean;
  session: Session | null;
  user: User | null;
  supabase: SupabaseClient | null;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signInWithGoogle: () => Promise<{ error: string | null }>;
  signUp: (email: string, password: string) => Promise<{ error: string | null; needsConfirmation: boolean }>;
  resendConfirmation: (email: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<{ error: string | null }>;
  bookStatuses: Record<string, BookStatus>;
  refreshBookStatuses: () => Promise<Record<string, BookStatus>>;
  updateBookStatus: (bookId: string, status: BookStatus) => Promise<void>;
  characterFavorites: Record<string, CharacterFavorite>;
  refreshCharacterFavorites: () => Promise<void>;
  updateCharacterFavorite: (characterKey: string, characterName: string, isFavorite: boolean) => Promise<void>;
  uploadAvatar: (file: File) => Promise<{ url: string | null; error: string | null }>;
  badges: UserBadge[];
  refreshBadges: (statusesOverride?: Record<string, BookStatus>) => Promise<UserBadge[]>;
  isAdmin: boolean;
  adminUserCount: number | null;
  refreshAdminUserCount: () => Promise<number | null>;
  seriesAchievement: SeriesAchievement | null;
  badgeAchievement: BadgeAchievement | null;
  dismissSeriesAchievement: () => void;
  dismissBadgeAchievement: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function SupabaseAuthProvider({ children }: { children: React.ReactNode }) {
  const supabase = useMemo(() => getSupabaseClient(), []);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(Boolean(supabase));
  const [bookStatuses, setBookStatuses] = useState<Record<string, BookStatus>>({});
  const [characterFavorites, setCharacterFavorites] = useState<Record<string, CharacterFavorite>>({});
  const [badges, setBadges] = useState<UserBadge[]>([]);
  const [adminUserCount, setAdminUserCount] = useState<number | null>(null);
  const [seriesAchievement, setSeriesAchievement] = useState<SeriesAchievement | null>(null);
  const [badgeAchievement, setBadgeAchievement] = useState<BadgeAchievement | null>(null);
  const books = booksData as Book[];
  const currentUser = session?.user ?? null;
  const isAdmin = currentUser?.app_metadata?.role === "admin";

  const refreshBookStatuses = async () => {
    if (!supabase || !session?.user) {
      setBookStatuses({});
      return {};
    }

    const statuses = await getUserBookStatuses(supabase, session.user.id);
    setBookStatuses(statuses);
    return statuses;
  };

  const updateBookStatus = async (bookId: string, status: BookStatus) => {
    if (!supabase || !session?.user) return;

    const book = books.find((item) => item.id === bookId);
    const previousStatuses = bookStatuses;
    const nextStatuses = { ...previousStatuses, [bookId]: status };
    await saveBookStatus(supabase, session.user.id, bookId, status);
    setBookStatuses(nextStatuses);

    if (book?.series) {
      const before = getSeriesProgressForSeries(books, previousStatuses, book.series);
      const after = getSeriesProgressForSeries(books, nextStatuses, book.series);

      // A cofnięcie przeczytania rozpoczyna nowy cykl zdobywania statusu.
      // Czyścimy tylko osiągnięcia tej serii, które są już ponownie nieaktualne.
      if (previousStatuses[bookId]?.isRead && !status.isRead && levelRank[after.level] < levelRank[before.level]) {
        (Object.keys(levelRank) as SeriesLevel[]).forEach((level) => {
          if (levelRank[level] > levelRank[after.level]) {
            window.localStorage.removeItem(`mrozoversum-series-achievements:${book.series}:${level}`);
          }
        });
      }

      if (!previousStatuses[bookId]?.isRead && status.isRead && levelRank[after.level] > levelRank[before.level] && after.level !== "started") {
        const seenKey = `mrozoversum-series-achievements:${book.series}:${after.level}`;
        const seen = window.localStorage.getItem(seenKey);
        if (!seen) {
          window.localStorage.setItem(seenKey, "1");
          setSeriesAchievement({ series: after.series, label: after.label, level: after.level, levelLabel: after.levelLabel, percentage: after.percentage, readCount: after.readCount, totalCount: after.totalCount, color: after.color, levelColor: after.color, iconPath: after.iconPath });
        }
      }
    }
    const previousBadges = badges;
    const nextBadges = await refreshBadges(nextStatuses);
    const newlyEarned = nextBadges.find((badge) => !previousBadges.some((current) => current.badgeId === badge.badgeId));
    if (newlyEarned) {
      const seenKey = `mrozoversum-badge-achievements:${newlyEarned.badgeId}`;
      if (!window.localStorage.getItem(seenKey)) {
        window.localStorage.setItem(seenKey, "1");
        setBadgeAchievement(newlyEarned);
      }
    }
  };

  const refreshBadges = async (statusesOverride = bookStatuses): Promise<UserBadge[]> => {
    if (!supabase || !session?.user) {
      setBadges([]);
      return [];
    }
    const nextBadges = (await getUserBadges(supabase, session.user.id)).filter((badge) => {
      const definition = badgeById[badge.badgeId];
      return definition && statusesOverride[definition.bookId]?.isRead === true;
    });
    setBadges(nextBadges);
    return nextBadges;
  };

  const refreshAdminUserCount = async (): Promise<number | null> => {
    if (!supabase || !currentUser || !isAdmin) {
      setAdminUserCount(null);
      return null;
    }

    const { data, error } = await supabase.rpc("get_admin_user_count");
    if (error) {
      setAdminUserCount(null);
      return null;
    }

    const count = Number(data);
    const normalized = Number.isFinite(count) ? count : null;
    setAdminUserCount(normalized);
    return normalized;
  };

  const refreshCharacterFavorites = async () => {
    if (!supabase || !session?.user) {
      setCharacterFavorites({});
      return;
    }
    setCharacterFavorites(await getUserCharacterFavorites(supabase, session.user.id));
  };

  const updateCharacterFavorite = async (characterKey: string, characterName: string, isFavorite: boolean) => {
    if (!supabase || !session?.user) return;
    const favorite = { characterKey, characterName };
    await saveCharacterFavorite(supabase, session.user.id, favorite, isFavorite);
    setCharacterFavorites((current) => {
      const next = { ...current };
      if (isFavorite) next[characterKey] = favorite;
      else delete next[characterKey];
      return next;
    });
  };

  const uploadAvatar = async (file: File) => {
    if (!supabase || !session?.user) return { url: null, error: "Zaloguj się, aby zmienić zdjęcie." };
    try {
      const url = await uploadUserAvatar(supabase, session.user.id, file);
      setSession((current) => current ? { ...current, user: { ...current.user, user_metadata: { ...current.user.user_metadata, avatar_url: url } } } : current);
      return { url, error: null };
    } catch (error) {
      return { url: null, error: error instanceof Error ? error.message : "Nie udało się zapisać zdjęcia." };
    }
  };

  useEffect(() => {
    if (!supabase) return;

    let active = true;
    void supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      setLoading(false);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setLoading(false);
    });

    return () => {
      active = false;
      subscription.subscription.unsubscribe();
    };
  }, [supabase]);

  useEffect(() => {
    setBookStatuses({});
    setCharacterFavorites({});
    setBadges([]);
    setSeriesAchievement(null);
    setBadgeAchievement(null);
    setAdminUserCount(null);
    if (!session?.user || !supabase) return;

    void refreshBookStatuses().then((statuses) => refreshBadges(statuses)).catch(() => {
      setBookStatuses({});
      setBadges([]);
    });
    void refreshCharacterFavorites().catch(() => setCharacterFavorites({}));
  }, [session?.user?.id, supabase]);

  useEffect(() => {
    let active = true;
    setAdminUserCount(null);
    if (!currentUser || !isAdmin || !supabase) return;

    void supabase.rpc("get_admin_user_count").then(({ data, error }) => {
      if (!active || error) return;
      const count = Number(data);
      setAdminUserCount(Number.isFinite(count) ? count : null);
    });

    return () => {
      active = false;
    };
  }, [currentUser?.id, isAdmin, supabase]);

  const value: AuthContextValue = {
    configured: isSupabaseConfigured(),
    loading,
    session,
    user: session?.user ?? null,
    supabase,
    signIn: async (email, password) => {
      if (!supabase) return { error: "Logowanie nie jest jeszcze skonfigurowane." };
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error: error?.message ?? null };
    },
    signInWithGoogle: async () => {
      if (!supabase) return { error: "Logowanie nie jest jeszcze skonfigurowane." };
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: typeof window !== "undefined" ? window.location.origin : undefined
        }
      });
      return { error: error?.message ?? null };
    },
  signUp: async (email, password) => {
      if (!supabase) return { error: "Rejestracja nie jest jeszcze skonfigurowana.", needsConfirmation: false };
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: typeof window !== "undefined" ? window.location.origin : undefined
      }
    });
      return { error: error?.message ?? null, needsConfirmation: Boolean(data.user && !data.session) };
    },
  resendConfirmation: async (email) => {
    if (!supabase) return { error: "Logowanie nie jest jeszcze skonfigurowane." };
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: {
        emailRedirectTo: typeof window !== "undefined" ? window.location.origin : undefined
      }
    });
    return { error: error?.message ?? null };
  },
    signOut: async () => {
      if (!supabase) return { error: null };
      const { error } = await supabase.auth.signOut();
      return { error: error?.message ?? null };
    },
    bookStatuses,
    refreshBookStatuses,
    updateBookStatus,
    characterFavorites,
    refreshCharacterFavorites,
    updateCharacterFavorite,
    uploadAvatar,
    badges,
    refreshBadges,
    isAdmin,
    adminUserCount,
    refreshAdminUserCount,
    seriesAchievement,
    badgeAchievement,
    dismissSeriesAchievement: () => setSeriesAchievement(null),
    dismissBadgeAchievement: () => setBadgeAchievement(null)
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useSupabaseAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useSupabaseAuth musi być użyty wewnątrz SupabaseAuthProvider.");
  return context;
}
