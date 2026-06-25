import { clsx } from "clsx";
import type { Character } from "@/lib/types";

export function CharacterCard({ character }: { character: Character }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-white/10 bg-[#11131a] hover:border-rose-500/50 transition duration-300">
      <div className="h-32 w-full overflow-hidden bg-black/40">
        {character.avatar ? (
          <img src={character.avatar} alt={character.name} className="h-full w-full object-cover opacity-80" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-white/10">Brak foto</div>
        )}
      </div>
      <div className="p-4">
        <h4 className="text-sm font-bold text-white">{character.name}</h4>
        <p className="text-[11px] uppercase tracking-wider text-rose-400">{character.role}</p>
        {character.description && (
          <p className="mt-2 text-xs text-white/60 line-clamp-3">{character.description}</p>
        )}
      </div>
    </div>
  );
}