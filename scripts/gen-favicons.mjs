#!/usr/bin/env node
// Regenerate favicon raster files from public/favicon.svg.
// Run after any change to the SVG: `node scripts/gen-favicons.mjs`

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import sharp from "sharp";
import pngToIco from "png-to-ico";

const ROOT = resolve(new URL(".", import.meta.url).pathname, "..");
const svgPath = resolve(ROOT, "public/favicon.svg");
const svg = readFileSync(svgPath);

async function toPng(size) {
	return sharp(svg).resize(size, size).png({ compressionLevel: 9 }).toBuffer();
}

const buffers = {
	16: await toPng(16),
	32: await toPng(32),
	180: await toPng(180),
	192: await toPng(192),
	512: await toPng(512),
};

const outputs = {
	"public/apple-touch-icon.png": buffers[180],
	"public/icon-192.png": buffers[192],
	"public/icon-512.png": buffers[512],
};
for (const [rel, buf] of Object.entries(outputs)) {
	writeFileSync(resolve(ROOT, rel), buf);
}

// ICO bundles 16 + 32 for legacy browsers
const icoBuf = await pngToIco([buffers[16], buffers[32]]);
writeFileSync(resolve(ROOT, "public/favicon.ico"), icoBuf);

console.log("favicons regenerated:");
console.log(" - public/favicon.ico       (16+32)");
console.log(" - public/apple-touch-icon.png (180)");
console.log(" - public/icon-192.png      (192)");
console.log(" - public/icon-512.png      (512)");
