import sharp from "sharp";
import { promises as fs } from "node:fs";
import path from "node:path";

const SRC_DIR = path.join(process.cwd(), "_talks", "covers");
const OUT_DIR = path.join(process.cwd(), "out", "talks", "image");

async function optimize() {
  // Ensure output directory exists
  await fs.mkdir(OUT_DIR, { recursive: true });

  const files = (await fs.readdir(SRC_DIR)).filter((f) =>
    /\.(jpg|jpeg|png)$/i.test(f),
  );

  console.log(`Processing ${files.length} cover images...`);

  await Promise.all(
    files.map(async (file) => {
      const inputPath = path.join(SRC_DIR, file);
      const baseName = path.basename(file, path.extname(file));

      const image = sharp(inputPath).resize(800, null, {
        withoutEnlargement: true,
      });

      await Promise.all([
        // Generate optimized formats
        image
          .clone()
          .webp({ quality: 80 })
          .toFile(path.join(OUT_DIR, `${baseName}.webp`)),
        image
          .clone()
          .avif({ quality: 70 })
          .toFile(path.join(OUT_DIR, `${baseName}.avif`)),
        // Copy JPG fallback (resized)
        image
          .clone()
          .jpeg({ quality: 85 })
          .toFile(path.join(OUT_DIR, `${baseName}.jpg`)),
      ]);

      console.log(`  Processed: ${file}`);
    }),
  );

  console.log("Done!");
}

optimize().catch(console.error);
