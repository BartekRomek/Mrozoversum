import { cp, mkdir } from "node:fs/promises";
import { resolve, join } from "node:path";

const root = resolve(import.meta.dirname, "..");
const source = process.argv[2];
if (!source || process.argv[3] !== "--confirm") {
  console.error("Użycie: npm run restore -- ./backups/2026-09-12 --confirm");
  process.exit(1);
}

const backup = resolve(source);
const target = join(root, "data");
await mkdir(target, { recursive: true });
for (const name of ["books.json", "characters.json", "connections.json", "appearances"]) {
  await cp(join(backup, name), join(target, name), { recursive: true, force: true });
}
console.log(`Dane odtworzone z ${backup}. Sprawdź git diff przed uruchomieniem builda.`);
