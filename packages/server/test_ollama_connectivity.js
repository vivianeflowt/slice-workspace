const axios = require('axios');
const http = require('http');
const { exec } = require('child_process');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const HOSTS = ['localhost', '127.0.0.1'];
const PORT = 11434;
const PATH = '/api/tags';
const URLS = HOSTS.map(h => `http://${h}:${PORT}${PATH}`);

function testAxios(url) {
  return axios.get(url, { timeout: 10000 })
    .then(res => ({ method: 'axios', url, ok: true, status: res.status, data: res.data }))
    .catch(err => ({ method: 'axios', url, ok: false, error: err.code || err.message }));
}

function testHttp(url) {
  return new Promise(resolve => {
    const req = http.get(url, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ method: 'http', url, ok: true, status: res.statusCode, data }));
    });
    req.setTimeout(10000, () => {
      req.abort();
      resolve({ method: 'http', url, ok: false, error: 'timeout' });
    });
    req.on('error', err => resolve({ method: 'http', url, ok: false, error: err.code || err.message }));
  });
}

function testFetch(url) {
  return fetch(url, { timeout: 10000 })
    .then(res => res.text().then(data => ({ method: 'fetch', url, ok: res.ok, status: res.status, data })))
    .catch(err => ({ method: 'fetch', url, ok: false, error: err.code || err.message }));
}

function testCurl(url) {
  return new Promise(resolve => {
    exec(`curl -s -o /dev/null -w "%{http_code}" ${url}`, (err, stdout, stderr) => {
      if (err) return resolve({ method: 'curl', url, ok: false, error: err.code || err.message });
      const status = parseInt(stdout.trim(), 10);
      resolve({ method: 'curl', url, ok: status >= 200 && status < 400, status });
    });
  });
}

(async () => {
  console.log('Iniciando diagnóstico de conectividade com Ollama...\n');
  const tests = [];
  for (const url of URLS) {
    tests.push(testAxios(url));
    tests.push(testHttp(url));
    tests.push(testFetch(url));
    tests.push(testCurl(url));
  }
  const results = await Promise.all(tests);
  const grouped = {};
  for (const r of results) {
    if (!grouped[r.url]) grouped[r.url] = [];
    grouped[r.url].push(r);
  }
  for (const url in grouped) {
    console.log(`\nResultados para ${url}:`);
    for (const r of grouped[url]) {
      if (r.ok) {
        console.log(`  ✅ [${r.method}] Sucesso (status: ${r.status})`);
      } else {
        console.log(`  ❌ [${r.method}] Falha (${r.error})`);
      }
    }
  }
  console.log('\nDiagnóstico concluído.');
})();
