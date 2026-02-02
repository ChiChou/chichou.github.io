import sharp from "sharp";
import { promises as fs } from "node:fs";
import path from "node:path";

const src = path.join("_talks", "covers");
const dst = path.join("public", "talks", "covers");

async function optimize() {
  // Ensure output directory exists
  await fs.mkdir(dst, { recursive: true });

  const files = (await fs.readdir(src)).filter((f) =>
    /\.(jpg|jpeg|png)$/i.test(f),
  );

  console.log(`Processing ${files.length} cover images...`);

  await Promise.all(
    files.map(async (file) => {
      const inputPath = path.join(src, file);
      const baseName = path.basename(file, path.extname(file));

      const image = sharp(inputPath).resize(800, null, {
        withoutEnlargement: true,
      });

      await Promise.all([
        image
          .clone()
          .webp({ quality: 80 })
          .toFile(path.join(dst, `${baseName}.webp`)),
        image
          .clone()
          .avif({ quality: 70 })
          .toFile(path.join(dst, `${baseName}.avif`)),
      ]);

      console.log(`  Processed: ${file}`);
    }),
  );

  console.log("Done!");
}

optimize().catch(console.error);
