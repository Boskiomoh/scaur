// Copies the fidelity report (evidence/, written by the figma-to-code fidelity script) into
// public/fidelity/ for the live site: images become WebP and report.html points at them.
// Usage: node scripts/publish-evidence.mjs
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const src = "evidence";
const out = "public/fidelity";
if (!existsSync(join(src, "report.html"))) {
  throw new Error("No evidence/report.html: run the fidelity script first.");
}

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

let bytes = 0;
for (const dir of readdirSync(src).filter((name) =>
  statSync(join(src, name)).isDirectory(),
)) {
  mkdirSync(join(out, dir), { recursive: true });
  for (const file of readdirSync(join(src, dir)).filter((name) =>
    name.endsWith(".png"),
  )) {
    const target = join(out, dir, file.replace(/\.png$/, ".webp"));
    const { size } = await sharp(join(src, dir, file))
      .webp({ quality: 78 })
      .toFile(target);
    bytes += size;
  }
}

writeFileSync(
  join(out, "report.html"),
  readFileSync(join(src, "report.html"), "utf8").replace(/\.png"/g, '.webp"'),
);
console.log(
  `public/fidelity: ${(bytes / 1024 / 1024).toFixed(1)} MB of images`,
);
