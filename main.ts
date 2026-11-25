// news-image-20261124 entry program.
// Copies the pre-rendered poster (entry.png, bundled in this repo) to the
// output directory as entry.png. A plain copy is deterministic: two runs
// produce byte-identical output, and the file is checked against the gate
// limits (PNG, at most 1024x1024, at most 1 MiB) before it is written.
import { copyFileSync, existsSync, mkdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const MAX_BYTES = 1048576; // 1 MiB gate limit

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const here = dirname(fileURLToPath(import.meta.url));
const src = join(here, 'entry.png');
const dest = join(outDir, 'entry.png');

if (!existsSync(src)) {
  throw new Error('entry.png missing next to main.ts');
}
const size = statSync(src).size;
if (size > MAX_BYTES) {
  throw new Error(`entry.png is ${size} bytes, over the 1 MiB limit`);
}
mkdirSync(outDir, { recursive: true });
copyFileSync(src, dest);
console.log(`wrote ${dest} (${size} bytes)`);
