export type BadgeDefinition = {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedFor: string;
  trigger: "book_read" | "account_created" | "favorite_book" | "avatar_set" | "audio_first" | "project_visit" | "character_album_visit";
  bookId?: string;
};

export const badgeDefinitions: BadgeDefinition[] = [
  {
    id: "konfrontacja",
    name: "Mroźne AVENGERS",
    description: "Przeczytano książkę, która łączy wszystkie serie Mrozoversum.",
    icon: "/badges/konfrontacja.png",
    earnedFor: "Przeczytanie książki „Konfrontacja”.",
    trigger: "book_read",
    bookId: "konfrontacja"
  },
  {
    id: "pierwszy-krok",
    name: "Pierwszy krok",
    description: "Założono konto w Mrozoversum.",
    earnedFor: "Utworzenie konta użytkownika.",
    icon: "/badges/odkryte-drzwi.png",
    trigger: "account_created"
  },
  {
    id: "biblioteka-serca",
    name: "Biblioteka serca",
    description: "Dodano książkę do ulubionych.",
    earnedFor: "Dodanie co najmniej jednej książki do ulubionych.",
    icon: "/badges/ulubiona-ksiazka.png",
    trigger: "favorite_book"
  },
  {
    id: "wlasny-portret",
    name: "Własny portret",
    description: "Ustawiono własne zdjęcie lub awatar postaci.",
    earnedFor: "Ustawienie avatara profilu.",
    icon: "/badges/wybrany-avatar.png",
    trigger: "avatar_set"
  },
  {
    id: "pierwsze-audio",
    name: "Pierwszy głos",
    description: "Po raz pierwszy odsłuchano nagranie postaci.",
    earnedFor: "Odtworzenie pierwszego nagrania audio postaci.",
    icon: "/badges/pierwsze-audio.png",
    trigger: "audio_first"
  },
  {
    id: "o-projekcie",
    name: "Za kulisami",
    description: "Odwiedzono stronę O projekcie.",
    earnedFor: "Wejście na stronę O projekcie.",
    icon: "/badges/poznaj-projekt.png",
    trigger: "project_visit"
  },
  {
    id: "katalog-postaci",
    name: "Kartoteka postaci",
    description: "Odwiedzono katalog postaci.",
    earnedFor: "Wejście do katalogu postaci z menu głównego.",
    icon: "/badges/album-postaci.png",
    trigger: "character_album_visit"
  }
];

export const badgeById = Object.fromEntries(badgeDefinitions.map((badge) => [badge.id, badge])) as Record<string, BadgeDefinition>;
