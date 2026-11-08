// Worker-прокси статуса для automaticferma.bid.
//
// Зачем он нужен:
//  1. Мастер-сервер отклоняет браузерные Origin (CORS по умолчанию только для
//     не-браузерных клиентов). Worker делает fetch без Origin — проходит.
//  2. Реальный адрес мастер-сервера (туннель) не попадает в JS страницы.
//  3. Кеш на 20 секунд защищает сервер от частых опросов.
//
// Прокси намеренно белый-списочный: отдаётся ТОЛЬКО /api/health —
// единственный публичный эндпоинт. Ни админ-API, ни клиентские токены
// через этот Worker не проходят.

const ALLOWED_PATHS = new Set(['/api/health', '/api/status']);
const UPSTREAM_TIMEOUT_MS = 8000;
const CACHE_SECONDS = 20;

function json(body, status, extraHeaders) {
  const headers = new Headers(Object.assign({
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': `public, max-age=${CACHE_SECONDS}`,
  }, extraHeaders || {}));
  return new Response(JSON.stringify(body), { status, headers });
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (request.method !== 'GET') {
      return json({ error: 'METHOD_NOT_ALLOWED' }, 405);
    }
    if (!ALLOWED_PATHS.has(url.pathname)) {
      return json({ error: 'NOT_FOUND' }, 404);
    }

    const serverUrl = env.SERVER_URL;
    if (!serverUrl) {
      return json({ error: 'SERVER_URL_NOT_CONFIGURED', hint: 'wrangler secret put SERVER_URL' }, 500);
    }

    // Кеш, чтобы 1000 посетителей = 1 запрос к серверу за окно кеша.
    const cache = caches.default;
    const cacheKey = new Request(url.toString(), { method: 'GET' });
    const cached = await cache.match(cacheKey);
    if (cached) return cached;

    const started = Date.now();
    try {
      const upstream = await fetch(serverUrl.replace(/\/+$/, '') + '/api/health', {
        method: 'GET',
        headers: { 'User-Agent': 'automaticferma-site-status-proxy' },
        signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
      });
      const data = await upstream.json().catch(() => ({}));

      const payload = {
        ok: upstream.ok && data.status === 'ok',
        transport: data.transport || null,
        server_time: data.time || null,
        latency_ms: Date.now() - started,
        checked_at: new Date().toISOString(),
      };

      const res = json(payload, 200);
      ctx.waitUntil(cache.put(cacheKey, res.clone()));
      return res;
    } catch (e) {
      // Сервер не ответил — честно отдаём offline (не кешируем, чтобы восстановление было видно сразу).
      return json({
        ok: false,
        transport: null,
        server_time: null,
        latency_ms: null,
        checked_at: new Date().toISOString(),
      }, 200, { 'Cache-Control': 'no-store' });
    }
  },
};
