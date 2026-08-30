import sharp from "sharp";
import fs from "fs";
import path from "path";

const inputDir = "./public/avatars";
const outputDir = "./public/avatars-optimized";

fs.mkdirSync(outputDir, { recursive: true });

const files = fs
  .readdirSync(inputDir)
  .filter((file) => /\.(png|jpe?g|webp)$/i.test(file));

let originalTotal = 0;
let optimizedTotal = 0;

for (const file of files) {
  const inputPath = path.join(inputDir, file);

  const outputName = file.replace(/\.(png|jpe?g)$/i, ".webp");
  const outputPath = path.join(outputDir, outputName);

  const originalSize = fs.statSync(inputPath).size;

  await sharp(inputPath)
    .resize({
      width: 800,
      withoutEnlargement: true,
    })
    .webp({
      quality: 82,
    })
    .toFile(outputPath);

  const optimizedSize = fs.statSync(outputPath).size;

  originalTotal += originalSize;
  optimizedTotal += optimizedSize;

  console.log(
    `${file}: ${(originalSize / 1024 / 1024).toFixed(2)} MB → ${(optimizedSize / 1024 / 1024).toFixed(2)} MB`
  );
}

console.log("\n--- PODSUMOWANIE ---");
console.log(
  `Oryginały: ${(originalTotal / 1024 / 1024).toFixed(2)} MB`
);
console.log(
  `WebP:      ${(optimizedTotal / 1024 / 1024).toFixed(2)} MB`
);
console.log(
  `Redukcja:  ${(100 - (optimizedTotal / originalTotal) * 100).toFixed(1)}%`
);