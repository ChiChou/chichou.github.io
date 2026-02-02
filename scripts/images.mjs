import fs from "node:fs/promises";
import { glob } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import sharp from "sharp";

const POSTS_IMG_DIR = path.join(process.cwd(), "_posts", "img");
const OUTPUT_DIR = path.join(process.cwd(), "out", "img");
const OUTPUT_FORMATS = ["avif", "webp", "jpg"];

async function findImages(dir) {
  const pattern = path.join(dir, "**/*.{jpg,jpeg,png}");
  return await Array.fromAsync(glob(pattern));
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function optimizeImage(imagePath) {
  const relativePath = path.relative(POSTS_IMG_DIR, imagePath);
  const relativeDir = path.dirname(relativePath);
  const basename = path.basename(imagePath, path.extname(imagePath));
  const outputDir = path.join(OUTPUT_DIR, relativeDir);
  const outputs = [];
  const skipped = [];

  // Ensure output directory exists
  await fs.mkdir(outputDir, { recursive: true });

  for (const format of OUTPUT_FORMATS) {
    const outputPath = path.join(outputDir, `${basename}.${format}`);

    if (await fileExists(outputPath)) {
      skipped.push(outputPath);
      continue;
    }

    try {
      const image = sharp(imagePath);
      const metadata = await image.metadata();

      // Skip if image is too small (likely already optimized or icon)
      if (metadata.width && metadata.width < 100) {
        skipped.push(outputPath);
        continue;
      }

      if (format === "avif") {
        await image
          .avif({
            quality: 65,
            effort: 4,
          })
          .toFile(outputPath);
      } else if (format === "webp") {
        await image
          .webp({
            quality: 80,
            effort: 4,
          })
          .toFile(outputPath);
      } else if (format === "jpg") {
        await image
          .jpeg({
            quality: 85,
          })
          .toFile(outputPath);
      }

      outputs.push(outputPath);
    } catch (error) {
      console.error(`Failed to convert ${imagePath} to ${format}:`, error);
    }
  }

  return {
    source: imagePath,
    outputs,
    skipped,
  };
}

async function processWithConcurrency(items, fn, concurrency) {
  const results = [];
  let index = 0;
  let completed = 0;

  async function worker() {
    while (index < items.length) {
      const currentIndex = index++;
      const result = await fn(items[currentIndex]);
      results[currentIndex] = result;
      completed++;
      process.stdout.write(`\rProcessed ${completed}/${items.length} images`);
    }
  }

  const workers = Array(Math.min(concurrency, items.length))
    .fill(null)
    .map(() => worker());

  await Promise.all(workers);
  return results;
}

async function main() {
  const concurrency = os.cpus().length;
  console.log("Scanning for images in", POSTS_IMG_DIR);
  console.log(`Using ${concurrency} parallel workers\n`);

  try {
    await fs.access(POSTS_IMG_DIR);
  } catch {
    console.error("Directory not found:", POSTS_IMG_DIR);
    process.exit(1);
  }

  const images = await findImages(POSTS_IMG_DIR);
  console.log(`Found ${images.length} images to process\n`);

  if (images.length === 0) {
    console.log("No images to process");
    return;
  }

  const results = await processWithConcurrency(
    images,
    optimizeImage,
    concurrency,
  );

  console.log("\n");

  let totalConverted = 0;
  let totalSkipped = 0;

  for (const result of results) {
    totalConverted += result.outputs.length;
    totalSkipped += result.skipped.length;
  }

  console.log(`Done! Created ${totalConverted} files, skipped ${totalSkipped}`);
}

main().catch(console.error);
