"use client";

import type { Session, SupabaseClient, User } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { getUserBookStatuses, saveBookStatus, type BookStatus } from "@/lib/supabase/books";
import { getUserCharacterFavorites, saveCharacterFavorite, type CharacterFavorite } from "@/lib/supabase/characters";
import { uploadUserAvatar } from "@/lib/supabase/profile";

type AuthContextValue = {
  configured: boolean;
  loading: boolean;
  session: Session | null;
  user: User | null;
  supabase: SupabaseClient | null;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string) => Promise<{ error: string | null; needsConfirmation: boolean }>;
  signOut: () => Promise<{ error: string | null }>;
  bookStatuses: Record<string, BookStatus>;
  refreshBookStatuses: () => Promise<void>;
  updateBookStatus: (bookId: string, status: BookStatus) => Promise<void>;
  characterFavorites: Record<string, CharacterFavorite>;
  refreshCharacterFavorites: () => Promise<void>;
  updateCharacterFavorite: (characterKey: string, characterName: string, isFavorite: boolean) => Promise<void>;
  uploadAvatar: (file: File) => Promise<{ url: string | null; error: string | null }>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function SupabaseAuthProvider({ children }: { children: React.ReactNode }) {
  const supabase = useMemo(() => getSupabaseClient(), []);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(Boolean(supabase));
  const [bookStatuses, setBookStatuses] = useState<Record<string, BookStatus>>({});
  const [characterFavorites, setCharacterFavorites] = useState<Record<string, CharacterFavorite>>({});

  const refreshBookStatuses = async () => {
    if (!supabase || !session?.user) {
      setBookStatuses({});
      return;
    }

    const statuses = await getUserBookStatuses(supabase, session.user.id);
    setBookStatuses(statuses);
  };

  const updateBookStatus = async (bookId: string, status: BookStatus) => {
    if (!supabase || !session?.user) return;

    await saveBookStatus(supabase, session.user.id, bookId, status);
    setBookStatuses((current) => ({ ...current, [bookId]: status }));
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
    if (!session?.user || !supabase) return;

    void refreshBookStatuses().catch(() => setBookStatuses({}));
    void refreshCharacterFavorites().catch(() => setCharacterFavorites({}));
  }, [session?.user?.id, supabase]);

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
    signUp: async (email, password) => {
      if (!supabase) return { error: "Rejestracja nie jest jeszcze skonfigurowana.", needsConfirmation: false };
      const { data, error } = await supabase.auth.signUp({ email, password });
      return { error: error?.message ?? null, needsConfirmation: Boolean(data.user && !data.session) };
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
    uploadAvatar
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useSupabaseAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useSupabaseAuth musi być użyty wewnątrz SupabaseAuthProvider.");
  return context;
}
