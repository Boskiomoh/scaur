// Builds public/thermal/*.webp from assets/photos (ARCHITECTURE section 7).
import { mkdir, readdir, stat } from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

import { heatStops } from "../src/lib/heat.ts";

const root = path.resolve(import.meta.dirname, "..");
const photos = path.join(root, "assets/photos");
const out = path.join(root, "public/thermal");
const width = 1200;
const skip = new Set(["fabric-navy-droplets", "fabric-olive-droplets"]);
const kitSource = "shell-fog-ridge";
const kitLevels = [
  [0.55, 0],
  [0.65, 0.08],
  [0.72, 0.16],
  [0.78, 0.24],
  [0.8, 0.32],
];

const toRgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));

const lut = Array.from({ length: 256 }, (_, i) => {
  const x = i / 255;
  const end = Math.max(
    1,
    heatStops.findIndex((stop) => stop.at >= x),
  );
  const start = heatStops[end - 1];
  const t = (x - start.at) / (heatStops[end].at - start.at);
  const from = toRgb(start.hex);
  const to = toRgb(heatStops[end].hex);
  return from.map((value, k) => Math.round(value + (to[k] - value) * t));
});

const isFresh = async (source, target) => {
  try {
    return (await stat(target)).mtimeMs >= (await stat(source)).mtimeMs;
  } catch {
    return false;
  }
};

const toGrey = (file) =>
  sharp(file)
    .resize({ width })
    .greyscale()
    .negate({ alpha: false })
    .blur(3)
    .normalise({ lower: 2, upper: 98 })
    .extractChannel(0)
    .raw()
    .toBuffer({ resolveWithObject: true });

const writeThermal = async ({ data, info }, target, level) => {
  const rgb = Buffer.alloc(info.width * info.height * 3);
  for (let i = 0; i < data.length; i++) {
    const v = level
      ? Math.min(
          255,
          Math.max(0, Math.round(data[i] * level[0] + level[1] * 255)),
        )
      : data[i];
    rgb.set(lut[v], i * 3);
  }
  await sharp(rgb, {
    raw: { width: info.width, height: info.height, channels: 3 },
  })
    .webp({ quality: 78 })
    .toFile(target);
};

await mkdir(out, { recursive: true });
let written = 0;
for (const file of await readdir(photos)) {
  const name = path.parse(file).name;
  if (skip.has(name) || !file.endsWith(".jpg")) continue;

  const source = path.join(photos, file);
  const targets = [path.join(out, `${name}.webp`)];
  if (name === kitSource) {
    targets.push(...kitLevels.map((_, i) => path.join(out, `kit-${i}.webp`)));
  }
  const fresh = await Promise.all(
    targets.map((target) => isFresh(source, target)),
  );
  if (fresh.every(Boolean)) continue;

  const grey = await toGrey(source);
  await writeThermal(grey, targets[0]);
  if (name === kitSource) {
    for (const [i, level] of kitLevels.entries())
      await writeThermal(grey, targets[i + 1], level);
  }
  written += targets.length;
}
console.log(`thermal: ${written} images written to public/thermal`);
