/**
 * DBEditor Flow · Editor de CSV standalone · © 2026 mdmarein · GNU AGPLv3
 * Servidor HTTP local — sin dependencias npm
 * Requiere: Node.js >= 14
 */

'use strict';

const http  = require('http');
const fs    = require('fs');
const path  = require('path');
const { URL } = require('url');

const PORT       = process.env.PORT || 3100;
const PUBLIC_DIR = path.join(__dirname, 'public');
const DATA_DIR   = path.join(__dirname, 'data');

// ── Asegurar que existe el directorio data ──────────────────
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

// ── Archivos de datos ───────────────────────────────────────
const FILES = {
  prepFormats: path.join(DATA_DIR, 'prep-formats.json'),
};

function readJSON(filePath, defaults) {
  try {
    if (fs.existsSync(filePath))
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (e) {
    console.warn(`[WARN] No se pudo leer ${filePath}:`, e.message);
  }
  return defaults;
}

function writeJSON(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (e) {
    console.error(`[ERROR] No se pudo escribir ${filePath}:`, e.message);
    return false;
  }
}

// ── MIME types ──────────────────────────────────────────────
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.png':  'image/png',
};

// ── Helpers HTTP ────────────────────────────────────────────
function json(res, code, data) {
  const body = JSON.stringify(data);
  res.writeHead(code, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
    'Cache-Control': 'no-store',
  });
  res.end(body);
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 2e6) {
        req.destroy(new Error('payload_too_large'));
      }
    });
    req.on('end', () => {
      try { resolve(JSON.parse(body)); }
      catch (e) { reject(new Error('JSON inválido')); }
    });
    req.on('error', e => {
      if (e.message === 'payload_too_large') reject(Object.assign(e, { status: 413 }));
      else reject(e);
    });
  });
}

// ── Defaults de datos ────────────────────────────────────────
const DEFAULTS = {
  prepFormats: { version: 1, number: [], currency: [], percent: [], date: [] },
};

// ── API Routes ───────────────────────────────────────────────
const API = {

  // GET /api/prep-formats → presets de formato número/fecha del editor
  'GET /api/prep-formats': (req, res) => {
    json(res, 200, readJSON(FILES.prepFormats, DEFAULTS.prepFormats));
  },

  // POST /api/prep-formats → guardar presets de formato
  'POST /api/prep-formats': async (req, res) => {
    try {
      const body = await parseBody(req);
      if (body.number   !== undefined && !Array.isArray(body.number))   throw new Error('number debe ser un array');
      if (body.currency !== undefined && !Array.isArray(body.currency)) throw new Error('currency debe ser un array');
      if (body.percent  !== undefined && !Array.isArray(body.percent))  throw new Error('percent debe ser un array');
      if (body.date     !== undefined && !Array.isArray(body.date))     throw new Error('date debe ser un array');
      const current = readJSON(FILES.prepFormats, DEFAULTS.prepFormats);
      writeJSON(FILES.prepFormats, {
        version:  1,
        number:   body.number   ?? current.number,
        currency: body.currency ?? current.currency  ?? [],
        percent:  body.percent  ?? current.percent   ?? [],
        date:     body.date     ?? current.date,
      });
      json(res, 200, { ok: true });
    } catch (e) { json(res, e.status === 413 ? 413 : 400, { ok: false, error: e.message }); }
  },

  // GET /api/health
  'GET /api/health': (req, res) => {
    json(res, 200, { ok: true, ts: Date.now(), port: PORT });
  },
};

// ── Servidor ─────────────────────────────────────────────────
const server = http.createServer((req, res) => {
  const { pathname } = new URL(req.url, 'http://localhost');
  const method  = req.method;

  // CORS para desarrollo
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

  // API routes
  const route = `${method} ${pathname}`;
  if (API[route]) { API[route](req, res); return; }

  // Archivos estáticos
  let filePath = path.join(PUBLIC_DIR, pathname === '/' ? 'index.html' : pathname);
  // Seguridad: evitar path traversal
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403); res.end('Forbidden'); return;
  }

  fs.stat(filePath, (err, stat) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // SPA fallback: servir index.html
        fs.readFile(path.join(PUBLIC_DIR, 'index.html'), (e2, d2) => {
          if (e2) { res.writeHead(404); res.end('Not found'); return; }
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(d2);
        });
      } else {
        res.writeHead(500); res.end('Server error');
      }
      return;
    }
    const ext = path.extname(filePath);
    res.writeHead(200, {
      'Content-Type': MIME[ext] || 'application/octet-stream',
      'Cache-Control': 'no-cache',
      'Content-Length': stat.size,
    });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, '127.0.0.1', () => {
  const addr = `http://localhost:${PORT}`;
  console.log(`\n  DBEditor Flow · Editor de CSV standalone · © 2026 mdmarein · GNU AGPLv3`);
  console.log(`  ───────────────────────────────────────────────────────────────────`);
  console.log(`  Servidor: ${addr}`);
  console.log(`  Datos:    ${DATA_DIR}`);
  console.log(`\n  Abrí ${addr} en Chrome\n`);
  // Abrir el browser solo cuando se lanza directamente (no desde el .app, que lo maneja el launcher)
  if (!process.env.LAUNCHED_BY_APP) {
    const { exec } = require('child_process');
    const cmd = process.platform === 'darwin' ? `open ${addr}`
              : process.platform === 'win32'  ? `start ${addr}`
              : `xdg-open ${addr}`;
    exec(cmd, err => { if (err) console.log(`  (Abrí ${addr} manualmente)\n`); });
  }
});

server.on('error', e => {
  if (e.code === 'EADDRINUSE')
    console.error(`\n[ERROR] Puerto ${PORT} en uso. Cerrá otro proceso o cambiá PORT.\n`);
  else
    console.error('\n[ERROR]', e.message, '\n');
  process.exit(1);
});

process.on('SIGINT', () => {
  console.log('\n  Servidor cerrado.\n');
  process.exit(0);
});
