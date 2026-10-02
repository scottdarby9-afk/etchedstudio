import { cp, rm, mkdir, readFile } from 'node:fs/promises';
await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });
await cp('public', 'dist', { recursive: true });
for (const file of ['index.html', 'styles.css', 'app.js', 'site-config.js', 'favicon.svg', 'assets/signage.webp', 'assets/counter.webp', 'assets/materials.webp']) {
  await readFile(`dist/${file}`);
}
console.log('Built Etched Laser Studio to dist/');
