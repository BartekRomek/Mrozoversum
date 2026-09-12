import { cp, mkdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { basename, dirname, join, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const output = resolve(process.argv[2] || join(root, "backups", new Date().toISOString().replace(/[:.]/g, "-")));
const files = ["data/books.json", "data/characters.json", "data/connections.json", "data/appearances"];

await mkdir(output, { recursive: true });
for (const relative of files) {
  const source = join(root, relative);
  const destination = join(output, relative);
  if (relative.endsWith(".json")) {
    await mkdir(dirname(destination), { recursive: true });
    const contents = await readFile(source);
    await writeFile(destination, contents);
  } else {
    await cp(source, destination, { recursive: true });
  }
}

const manifest = {};
for (const relative of ["data/books.json", "data/characters.json", "data/connections.json"]) {
  const contents = await readFile(join(root, relative));
  manifest[basename(relative)] = { sha256: createHash("sha256").update(contents).digest("hex") };
}
await writeFile(join(output, "manifest.json"), JSON.stringify({ createdAt: new Date().toISOString(), files: manifest }, null, 2) + "\n");
console.log(`Backup zapisany w ${output}`);
