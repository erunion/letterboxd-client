import fs from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';

import Client from '../dist/index.js';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const DEMO_PORT = Number(process.env.DEMO_PORT || 4173);
const PUBLIC_DIR = path.join(__dirname, 'public');

const MIME_TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
};

async function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => {
      data += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res, status, payload) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload));
}

async function serveStaticAsset(requestPath, res) {
  let filePath = path.join(PUBLIC_DIR, requestPath === '/' ? 'index.html' : requestPath);
  filePath = path.normalize(filePath);

  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Forbidden');
    return;
  }

  try {
    const file = await fs.readFile(filePath);
    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'text/plain; charset=utf-8' });
    res.end(file);
  } catch (err) {
    if (err.code === 'ENOENT') {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not found');
      return;
    }

    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Internal server error');
  }
}

function createClient(apiKey, apiSecret) {
  if (!apiKey || !apiSecret) {
    throw new Error('API key and secret are required.');
  }

  return new Client(apiKey, apiSecret);
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === 'POST' && url.pathname === '/api/exchange') {
    try {
      const body = await readJsonBody(req);
      const client = createClient(body.apiKey, body.apiSecret);

      const response = await client.auth.exchangeAuthorizationCode({
        code: body.code,
        codeVerifier: body.codeVerifier,
        redirectUri: body.redirectUri,
      });

      sendJson(res, response.status, response.data);
    } catch (err) {
      sendJson(res, 400, { error: err.message });
    }

    return;
  }

  if (req.method === 'POST' && url.pathname === '/api/refresh') {
    try {
      const body = await readJsonBody(req);
      const client = createClient(body.apiKey, body.apiSecret);

      const response = await client.auth.refreshAccessToken(body.refreshToken);

      sendJson(res, response.status, response.data);
    } catch (err) {
      sendJson(res, 400, { error: err.message });
    }

    return;
  }

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    res.end();
    return;
  }

  await serveStaticAsset(url.pathname, res);
});

server.listen(DEMO_PORT, () => {
  console.log(`OAuth demo ready on http://localhost:${DEMO_PORT}`);
});
