// Hostinger & Render Production Bootstrap Entry Point
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cjsTarget = path.join(__dirname, 'dist', 'server.cjs');
const jsTarget = path.join(__dirname, 'dist', 'server.js');

if (fs.existsSync(cjsTarget)) {
  await import('./dist/server.cjs');
} else if (fs.existsSync(jsTarget)) {
  await import('./dist/server.js');
} else {
  console.error('[KINETIC CMS] Error: Compiled production bundle not found in dist/. Please execute "npm run build" first.');
  process.exit(1);
}
