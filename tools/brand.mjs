// Render the channel brand stills (src/Brand.tsx) in one bundle:  node tools/brand.mjs <outdir>
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import fs from 'node:fs';
import path from 'node:path';

const out = process.argv[2] || 'out/brand';
fs.mkdirSync(out, {recursive: true});
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const browserExecutable = process.env.REMOTION_CHROME || null;
const ids = ['Brand-Wordmark', 'Brand-Wordmark-Transparent', 'Brand-Avatar', 'Brand-Clock-Transparent', 'Brand-Watermark', 'Brand-Banner', 'Brand-Square'];
const png = new Set(['Brand-Wordmark-Transparent', 'Brand-Avatar', 'Brand-Clock-Transparent', 'Brand-Watermark']);
for (const id of ids) {
  const composition = await selectComposition({serveUrl, id, browserExecutable});
  const fmt = png.has(id) ? 'png' : 'jpeg';
  const name = id.replace('Brand-', '').toLowerCase();
  await renderStill({composition, serveUrl, frame: 0, output: path.join(out, `${name}.${fmt === 'png' ? 'png' : 'jpg'}`), imageFormat: fmt, ...(fmt === 'jpeg' ? {jpegQuality: 95} : {}), browserExecutable});
  console.log('brand', name);
}
fs.rmSync(serveUrl, {recursive: true, force: true});
