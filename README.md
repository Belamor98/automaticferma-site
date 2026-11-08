# automaticferma-site

Лендинг **AutomaticFermaPro** для домена `automaticferma.bid` — в фирменной
янтарной теме приложения. Плюс живой виджет статуса мастер-сервера.

## Структура

```
automaticferma-site/
  index.html          # лендинг (hero, статус, возможности, безопасность, FAQ)
  style.css           # тема как в приложении (#fbbf24 / #a78bfa на тёмном градиенте)
  script.js           # опрос статуса каждые 30 сек
  worker/
    wrangler.toml     # конфиг Worker'а (маршрут automaticferma.bid/api/*)
    src/index.js      # прокси /api/status → мастер-сервер /api/health
```

## Как это работает

- Сайт — статика, деплозится в **Cloudflare Pages**.
- Виджет статуса дергает `/api/status` **своего же домена** — этот путь
  перехватывает Cloudflare Worker.
- Worker ходит на мастер-сервер (`/api/health`) **без Origin-заголовка**,
  поэтому CORS сервера не мешает, а реальный адрес туннеля нигде не светится.
- Ответ кешируется на 20 секунд: хоть 1000 посетителей — сервер получит
  один запрос за окно кеша.
- Через Worker проходит **только** `/api/health` (белый список путей).
  Админ-API и клиентские эндпоинты недоступны — ничего чувствительного
  сайт не показывает.

## Деплой

### 1. Сайт в Cloudflare Pages

Вариант А (через панель):
1. Cloudflare Dashboard → **Workers & Pages → Create → Pages → Upload assets**.
2. Загрузите `index.html`, `style.css`, `script.js` (корень проекта).
3. В настройках проекта → **Custom domains** → добавьте `automaticferma.bid`.

Вариант Б (через wrangler):
```bash
npm install -g wrangler
wrangler login
cd automaticferma-site
wrangler pages deploy . --project-name automaticferma
```

### 2. Worker-прокси статуса

```bash
cd automaticferma-site/worker
wrangler secret put SERVER_URL
# вставьте URL мастер-сервера (туннель), например:
# https://ferma.ваш-туннель.example.com
wrangler deploy
```

Маршрут `automaticferma.bid/api/*` уже прописан в `wrangler.toml`.
Проверка: `https://automaticferma.bid/api/status` должен вернуть JSON
вида `{"ok":true,"transport":"http","latency_ms":42,...}`.

### 3. Проверка

1. Откройте `https://automaticferma.bid` — лендинг в янтарной теме.
2. Секция «Живой статус» — зелёная точка, задержка, транспорт.
3. Остановите мастер-сервер — через ~30 секунд точка станет красной.

## Добавить новые публичные данные

Если захотите показывать больше (например, счётчик активных лицензий):

1. Добавьте **отдельный публичный GET-эндпоинт** в мастер-сервер, который
   отдаёт только агрегаты (никаких HWID/куки/сообщений).
2. Добавьте его путь в `ALLOWED_PATHS` в `worker/src/index.js`.
3. Добавьте отрисовку в `script.js`.

## Безопасность

- `SERVER_URL` — только через `wrangler secret put`, не в коде и не в `vars`.
- Фронтенд не содержит ни адреса сервера, ни токенов.
- Мастер-сервер трогать не нужно: CORS, rate-limit и WS-защита остаются как есть.
