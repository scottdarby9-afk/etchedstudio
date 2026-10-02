import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
const root = resolve(process.argv[2] || 'public');
const mime = { '.html':'text/html', '.css':'text/css', '.js':'text/javascript', '.svg':'image/svg+xml', '.webp':'image/webp', '.png':'image/png', '.txt':'text/plain' };
http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    const name = decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname);
    const file = resolve(root, `.${name}`);
    if (!file.startsWith(root + sep)) { res.writeHead(403).end(); return; }
    const data = await readFile(file);
    res.writeHead(200, {'Content-Type': `${mime[extname(file)] || 'application/octet-stream'}${/\.(html|css|js|txt)$/.test(file) ? '; charset=utf-8' : ''}`});
    res.end(data);
  } catch { res.writeHead(404, {'Content-Type':'text/plain'}).end('Not found'); }
}).listen(process.env.PORT || 3000, '0.0.0.0', () => console.log('Etched Laser Studio: http://localhost:3000'));
