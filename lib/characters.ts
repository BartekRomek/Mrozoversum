import type { Character } from "@/lib/types";

export function normalizeCharacterIdentity(name: string) {
  return name.trim().toLocaleLowerCase("pl-PL").replace(/[„”\"]/g, "").replace(/\s+/g, " ");
}

export function characterIdentity(character: Character) {
  return normalizeCharacterIdentity(character.name);
}
