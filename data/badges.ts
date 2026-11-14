export type BadgeDefinition = {
  id: string;
  name: string;
  description: string;
  icon: string;
  bookId: string;
};

export const badgeDefinitions: BadgeDefinition[] = [
  {
    id: "konfrontacja",
    name: "Konfrontacja",
    description: "Przeczytano książkę, która łączy wszystkie serie Mrozoversum.",
    icon: "/badges/konfrontacja.svg",
    bookId: "konfrontacja"
  }
];

export const badgeById = Object.fromEntries(badgeDefinitions.map((badge) => [badge.id, badge])) as Record<string, BadgeDefinition>;
