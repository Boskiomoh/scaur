// Builds the favicons and touch icons from brand/.
import { copyFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const brand = (file) => path.join(root, "brand", file);
const app = (file) => path.join(root, "src/app", file);

const png = (file, size) =>
  sharp(brand(file), { density: (72 * size) / 32 })
    .resize(size, size)
    .png()
    .toBuffer();

// An .ico holds PNG images behind a 6-byte header and a 16-byte entry per image.
const toIco = (images) => {
  const header = Buffer.alloc(6 + images.length * 16);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  let offset = header.length;
  images.forEach(({ size, data }, i) => {
    const entry = 6 + i * 16;
    header.writeUInt8(size, entry);
    header.writeUInt8(size, entry + 1);
    header.writeUInt16LE(1, entry + 4);
    header.writeUInt16LE(32, entry + 6);
    header.writeUInt32LE(data.length, entry + 8);
    header.writeUInt32LE(offset, entry + 12);
    offset += data.length;
  });
  return Buffer.concat([header, ...images.map((image) => image.data)]);
};

await mkdir(path.join(root, "public"), { recursive: true });
await copyFile(brand("favicon.svg"), app("icon.svg"));
await writeFile(
  app("favicon.ico"),
  toIco([
    { size: 16, data: await png("favicon-16.svg", 16) },
    { size: 32, data: await png("favicon.svg", 32) },
  ]),
);
await writeFile(app("apple-icon.png"), await png("favicon.svg", 180));
await writeFile(
  path.join(root, "public/icon-512.png"),
  await png("favicon.svg", 512),
);
console.log(
  "brand: icon.svg, favicon.ico, apple-icon.png and icon-512.png written",
);
