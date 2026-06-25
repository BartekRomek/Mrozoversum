import type { Character } from "@/lib/types";

export function CharacterCard({ character }: { character: Character }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-white/10 bg-[#11131a] p-4">
      {/* Zastąpiliśmy avatar inicjałem z nazwy, bo w JSONie nie masz pola avatar */}
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/20 text-rose-400 font-bold mb-3">
        {character.name.charAt(0)}
      </div>
      <h4 className="text-sm font-bold text-white">{character.name}</h4>
      <p className="mt-2 text-xs text-white/60 line-clamp-3">{character.description}</p>
    </div>
  );
}