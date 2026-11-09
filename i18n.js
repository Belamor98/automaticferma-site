// ============================================================
// 🌍 I18N — переключатель языка интерфейса (RU / EN)
// ------------------------------------------------------------
// Русский режим — это ТОЧНО текущий интерфейс (никаких замен).
// Английский — переводится словарём: русские фразы (ключи,
// с приведением пробелов к одинарным) заменяются на английские.
//
// Как это работает:
//   * Canonical-подход: исходный русский текст запоминается на
//     каждом текстовом узле при его появлении (__ru). Перевод
//     всегда рисуется от исходника, поэтому переключение RU<->EN
//     не «накапливает» переведённый текст и работает в обе стороны.
//   * MutationObserver переводит динамический контент автоматически,
//     как только renderer.js вставит его в DOM.
//   * Консоли (.log-box) не трогаются: строки логов идут из
//     main-процесса и не должны переводиться/обходить наблюдателем.
// ============================================================

(function () {
    'use strict';

    var STORE_KEY = 'appLang';
    // ⛔ Не трогаем: textarea/input/select (пользовательские данные и формы),
//    .app-tooltip (текст берётся из переведённого data-tooltip),
//    #solver-log-box — пишется через innerHTML += без ограничения строк,
//    наблюдатель дал бы квадратичную деградацию; вывод сольвера технический.
//    Лог-боксы main/dev/cl переводятся наблюдателем (canonical-кэш).
    var SKIP = '.app-tooltip, textarea, input, select, #solver-log-box';

    // ------------------------------------------------------------
    // 📚 СЛОВАРЬ RU -> EN
    // Ключи пишутся с одинарными пробелами (нормализация на входе).
    // Длинные ключи идут первыми (сортировка longest-first).
    // ------------------------------------------------------------
    var DICT = {
        // ===== Шапка / окно =====
        'Свернуть': 'Minimize',
        'Развернуть / восстановить': 'Maximize / Restore',
        'Закрыть': 'Close',
        'Скрыть вкладки': 'Hide tabs',
        'Видимые вкладки': 'Visible tabs',
        'Настройки': 'Settings',
        'Параметры сессии': 'Session settings',
        'ТЕКУЩИЙ СТАТУС СЕАНСА': 'CURRENT SESSION STATUS',
        'Цикл.': 'Cycle',
        'СТАРТ': 'START',
        'СТОП': 'STOP',
        'Запустить ферму': 'Start farm',
        'Остановить ферму': 'Stop farm',
        'Настройки запуска': 'Start settings',
        'Настройки остановки': 'Stop settings',
        'Очередь и расписание пачек': 'Queue and pack schedule',

        // ===== COOKIE менеджер =====
        'COOKIE МЕНЕДЖЕР': 'COOKIE MANAGER',
        '+ Добавить Cookie': '+ Add Cookie',
        'Добавьте хотя бы одну пачку куки!': 'Add at least one cookie pack!',
        'Добавьте пачки куки, чтобы увидеть queue': 'Add cookie packs to see the queue',
        '📭 Нет добавленных пачек': '📭 No packs added',
        '📭 Нет данных': '📭 No data',
        'Нет данных': 'No data',
        'Удалить бекап': 'Delete backup',
        'Удалить бэкап': 'Delete backup',
        'Удалить бэкап куки для всех пачек': 'Delete cookie backup for all packs',
        'Удалить бэкап куки только для аккаунтов выбранной пачки': 'Delete cookie backup for the selected pack only',
        'Авторизует все аккаунты из списка, и глобализирует их': 'Authorizes all accounts from the list and globalizes them',
        'Все аккаунты выбранной пачки потеряют бэкап (бэкапы других пачек не трогаются). Новый бэкап создастся автоматически при следующем запуске каждого аккаунта.':
            'All accounts of the selected pack will lose their backup (other packs are not affected). A new backup will be created automatically at the next launch of each account.',
        'изолирован (бан/lock)': 'isolated (ban/lock)',
        'не удался': 'failed',
        'неверный логин/пароль': 'invalid login/password',
        'getcookie: уже запущен': 'getcookie: already running',
        'отмена запрошена': 'cancel requested',
        'завершён': 'finished',
        'Не удалось удалить бэкап': 'Failed to delete backup',
        'пачка не выбрана': 'pack not selected',
        'Сон/отдых пачки — запуски окон приостановлены': 'Pack sleep/rest — window launches are suspended',
        'Сортировка окон приостановлена (идёт GetCookie)': 'Window sorting is paused (GetCookie is running)',
        'Список аккаунтов Cookie #': 'Account list Cookie #',
        'Обновить состояние': 'Refresh state',
        'Изменить список куки': 'Edit cookie list',
        'Добавить заметку': 'Add a note',
        'Удалить пачку': 'Delete pack',
        'Проверить куки на ZeroPoint': 'Check cookies on ZeroPoint',
        'акк.': 'acc.',
        'Неизвестно': 'Unknown',
        'Проверка пачки': 'Pack check',
        '🔎 ПРОВЕРКА ПАЧКИ #': '🔎 PACK CHECK #',
        '🔎 ПРОВЕРКА ПАЧКИ': '🔎 PACK CHECK',
        'Проверка уже идёт': 'Check already in progress',
        '✅ Проверка завершена': '✅ Check finished',
        '✅ Пачка полностью живая (': '✅ Pack fully alive (',
        ') — ничего делать не нужно': ') — nothing to do',
        'Нажми — откроется Discord': 'Click — opens Discord',
        'Купить ключ': 'Buy key',

        // ===== ZeroPoint =====
        '🔑 ZeroPoint API': '🔑 ZeroPoint API',
        '🔑 ZEROPOINT API-КЛЮЧИ': '🔑 ZEROPOINT API KEYS',
        'Ключ ZeroUnlock': 'ZeroUnlock key',
        'Ключ GetCookie': 'GetCookie key',
        'Ключ ZeroSolver': 'ZeroSolver key',
        'Ключи хранятся локально в config.json и используются только соответствующими API.': 'Keys are stored locally in config.json and used only by the corresponding APIs.',
        '🔑 ZeroPoint: API-ключи сохранены': '🔑 ZeroPoint: API keys saved',
        'ZeroPoint: API-ключи (Cookie Checker / ZeroUnlock / GetCookie / ZeroSolver)': 'ZeroPoint: API keys (Cookie Checker / ZeroUnlock / GetCookie / ZeroSolver)',
'Авторизует все аккаунты из списка, записывает куки в CookieManager': 'Authorizes all accounts from the list, writes cookies to CookieManager',

        // ===== Панель управления =====
        'Решатель капчи': 'Captcha solver',
        'Эмитирует человека': 'Emulates human behavior',
        'Многофункциональный модуль для настройки режимов фарма': 'Multi-purpose module for farm mode settings',
        'Очищает мусор из RAM': 'Cleans garbage from RAM',
        'Перезапустит приложение, если оно зависнет или вылетит': 'Restarts the app if it hangs or crashes',
        'Подключи Телеграм бота, управляй фермой дистанционно': 'Connect the Telegram bot to control the farm remotely',
        'Следит за тем, чтобы VOLT не разлогинился (BETA)': 'Keeps VOLT logged in (BETA)',
        'Зажмите 5 секунд — полная чистка системы': 'Hold 5 seconds — full system cleanup',
        'Зажмите 5 сек — сброс HWID (24h cooldown)': 'Hold 5 sec — HWID reset (24h cooldown)',
        'Зажмите 5 секунд — сброс HWID': 'Hold 5 seconds — HWID reset',
        'Спуфер успешно завершил работу': 'Spoofer finished successfully',
        '🧬 Спуфер успешно завершил работу': '🧬 Spoofer finished successfully',
        'Спуфер: завершён с ошибкой': 'Spoofer: finished with an error',
        '⚠️ Спуфер: завершён с ошибкой': '⚠️ Spoofer: finished with an error',
        'Спуфер: запуск полной чистки (мусор + HWID Volt + Roblox + MAC)': 'Spoofer: starting full cleanup (garbage + HWID Volt + Roblox + MAC)',
        '🧬 Spoofer: запуск полной чистки (мусор + HWID Volt + Roblox + MAC)': '🧬 Spoofer: starting full cleanup (garbage + HWID Volt + Roblox + MAC)',
        'Спайдер': 'Spoofer',
        '✅ Готово': '✅ Done',
        '✅ Готово!': '✅ Done!',
        '❌ Ошибка': '❌ Error',
        'Ошибка': 'Error',
        'Готово': 'Done',

        // ===== Статус-карточка =====
        'Статус:': 'Status:',
        'Инстансы:': 'Instances:',
        'Онлайн:': 'Online:',
        'Louncher:': 'Launcher:',
        'Volt:': 'Volt:',
        'Статус': 'Status',
        'Цикл.': 'Cycle',

        // ===== Вкладка SOFTWARE =====
        'Пути к исполняемым файлам': 'Paths to executables',
        'Путь не выбран...': 'No path selected...',
        'Путь не выбран': 'No path selected',
        'Выбрать файл': 'Browse...',
        '❌ Путь к исполняемому файлу Volt не указан (вкладка SOFTWARE)': '❌ Volt executable path is not set (SOFTWARE tab)',
        '❌ Путь к исполняемому файлу Solver не указан (вкладка SOFTWARE)': '❌ Solver executable path is not set (SOFTWARE tab)',
        'Версия Roblox:': 'Roblox version:',
        'Настройка лаунчера': 'Launcher settings',
        'НАСТРОЙКА ЛАУНЧЕРА': 'LAUNCHER SETTINGS',

        // ===== WebHook / Discord =====
        '🤖 Discord WebHook — мониторинг аккаунтов': '🤖 Discord WebHook — account monitoring',
        '📋 Все': '📋 All',
        '⚙ СТАТУС:': '⚙ STATUS:',
        'Подключить поток': 'Connect stream',
        'Разорвать поток': 'Disconnect stream',
        '📋 СПИСОК АККАУНТОВ': '📋 ACCOUNT LIST',
        'Ожидание данных от Discord...': 'Waiting for data from Discord...',
        '🗑️ Очистить список': '🗑️ Clear list',
        'Останавливать ферму при Shadow Ban': 'Stop farm on Shadow Ban',
        'Если обнаружен бан — ферма остановится автоматически': 'If a ban is detected — the farm stops automatically',
        '🚫 БАН-ЛИСТ': '🚫 BAN LIST',
        'Нет забаненных аккаунтов': 'No banned accounts',
        '🗑️ Очистить бан-лист': '🗑️ Clear ban list',
        '🍪 Удалить куки забаненных из пачки': '🍪 Remove banned cookies from pack',
        'Удалить куки всех аккаунтов из бан-листа из пачек (Pack*.txt)': 'Remove cookies of all ban-list accounts from packs (Pack*.txt)',
        'Включено: при Shadow Ban ферма остановится автоматически': 'Enabled: farm stops automatically on Shadow Ban',
        'Выключено: бан только попадёт в бан-лист': 'Disabled: the ban only goes to the ban list',
        '✅ Discord открыт': '✅ Discord connected',
        '📭 Нет данных от Discord': '📭 No data from Discord',

        // ===== Консоль =====
        'Основная консоль фермы': 'Main farm console',
        'Консоль разработчика': 'Developer console',
        '🛠️ Режим разработчика': '🛠️ Dev mode',
        'Режим разработчика: весь вывод main-процесса, как в терминале VS Code': 'Dev mode: full main-process output, like in a VS Code terminal',
        '🗑️ Очистить консоль': '🗑️ Clear console',
        'Транслировать в консоль': 'Mirror to console',
        '🗑️ Консоль очищена': '🗑️ Console cleared',
        'Консоль SOLVER': 'SOLVER console',
        'Ожидание системных событий фермы...': 'Waiting for farm system events...',
        'Ожидание вывода main-процесса (console.log/warn/error)...': 'Waiting for main-process output (console.log/warn/error)...',
        'Ожидание потока данных Капча-Сольвера...': 'Waiting for captcha solver data stream...',
        '🗑️ Сбросить и сохранить': '🗑️ Reset and save',
        '🧩 Solver-лог': '🧩 Solver log',
        'RBX Cookie Checker': 'RBX Cookie Checker',
        'Куки для проверки': 'Cookies to check',
        'Только капча v1/v2 (join-game)': 'Only v1/v2 captcha (join-game)',
        'Воркеры:': 'Workers:',
        'Задержка (сек):': 'Delay (sec):',
        'Очистить': 'Clear',
        'Отмена': 'Cancel',
        'Проверить': 'Check',
        'Куки скопированы': 'Cookies copied',
        'Нечего копировать': 'Nothing to copy',
        'Неизвестная ошибка': 'Unknown error',
        'Обработка...': 'Processing...',
        'Подготовка...': 'Preparing...',
        'Отправка...': 'Sending...',

        // ===== Console Launcher =====
        'Сортировать окна': 'Arrange windows',
        'Console Launcher готов': 'Console Launcher ready',
        'Общие': 'General',
        'Базовые параметры запуска и защиты': 'Basic launch and protection settings',
        'Roblox': 'Roblox',
        'Версия клиента и установщик': 'Client version and installer',
        'Сначала выберите или введите версию': 'First select or enter the version',
        'Сначала дождитесь зелёной проверки версии': 'First wait for the green version check',
        'Выбранная версия также будет устанавливаться спуфером (Vlt-clean / переустановка Roblox)': 'The selected version will also be installed by the spoofer (Vlt-clean / Roblox reinstall)',
        'Не удалось определить параметры экрана': 'Could not determine screen parameters',
        'Откалиброванно, под сортировку 200x200': 'Calibrated for 200x200 arrangement',
        'Шум окон (случайные позиции при открытии)': 'Window noise (random positions when opening)',
        'Плавное закрытие инстансов': 'Smooth closing of instances',
        'Перезагрузка окон с внутренней ошибкой Roblox': 'Reload windows with internal Roblox error',
        'Автоматический детект ошибки 403 и ее устранение': 'Automatic 403 detection and fix',
        'Fix installer Roblox (карантин установщика)': 'Fix Roblox installer (installer quarantine)',
        'Использовать прокси': 'Use proxy',
        'Прокси (по одному на строку, опционально): host:port или user:pass@host:port': 'Proxies (one per line, optional): host:port or user:pass@host:port',
        'Прокси: строка N = аккаунт N. Пустая строка = аккаунт без прокси.': 'Proxy: line N = account N. Empty line = account without proxy.',
        'Вставь куки — по одной на строку': 'Paste cookies — one per line',
        'Вставьте сюда ваши куки...': 'Paste your cookies here...',
        'Мастер-игра: название, которое навигатор введёт в поиск Roblox': 'Master game: the name the navigator types into Roblox search',
        'Название игры (поиск в Roblox)': 'Game name (Roblox search)',
        'Сохранить GameName': 'Save GameName',
        'Рукописный ввод': 'Manual input',
        'Список версий (txt)': 'Version list (txt)',
        '📄 Список версий (txt)': '📄 Version list (txt)',
        '📄 Список версий': '📄 Version list',
        'Загрузка каталога…': 'Loading catalog…',
        'Каталог недоступен': 'Catalog unavailable',
        'Нет доступа к каталогу': 'No access to catalog',
        'Сортировка окон': 'Window arrangement',
        'Окон в ряд': 'Windows per row',
        'Проверка параметров экрана…': 'Checking screen parameters…',
        'Ожидается: app.exe или ZeroAutoSolve': 'Expected: app.exe or ZeroAutoSolve',
        'Вклиниться в сеанс': 'Join session',
        '📋 Пачки (файлы)': '📋 Packs (files)',
        '📋 СПИСОК ПАЧЕК': '📋 PACK LIST',
        '📄 Список пачек': '📄 Pack list',
        'Сон (мин)': 'Sleep (min)',
        'Куки для Manual-режима (accounts.txt)': 'Cookies for Manual mode (accounts.txt)',
        'Для app.exe, вставь куки на которых хочешь решать капчу, этот режим игнорирует автоматическую перезапись': 'For app.exe, paste the cookies you want to solve captcha with; this mode ignores automatic overwriting',
        'Проверка пачки #': 'Pack check #',
        'Снять метку': 'Remove mark',
        'Снять метку (куки свежие)': 'Remove mark (cookies fresh)',
        'Снять метку (капча)': 'Remove mark (captcha)',
        'Снять метку (account lock)': 'Remove mark (account lock)',
        'войти через браузер': 'login via browser',
        'чистая авторизация': 'clean authorization',
        'лаунч': 'launch',
        '📋 Копировать свежие куки': '📋 Copy fresh cookies',
        '📋 Свежие куки скопированы в буфер': '📋 Fresh cookies copied to clipboard',

        // ===== Smart-Swap / FarmTimer =====
        '🌐 СМЕНА IP + ГИБКИЙ ГРАФИК ФАРМА': '🌐 IP SWAP + FLEXIBLE FARM SCHEDULE',
        '🔢 Количество циклов': '🔢 Number of cycles',
        '🧹 Чистка следов сессии': '🧹 Session trace cleanup',
        'Чистка следов сессии': 'Session trace cleanup',
        'Чистка реестра и временных файлов.': 'Registry and temp file cleanup.',
        'Версия Roblox сохраняется': 'Roblox version is preserved',
        '🔀 Смена HWID между слотами': '🔀 HWID swap between slots',
        'Смена HWID между слотами': 'HWID swap between slots',
        'Меняет MAC-адрес сетевого адаптера между слотами — это аппаратный идентификатор, который видит Volt. Независимо от чистки.': 'Changes the network adapter MAC address between slots — this is the hardware identifier that Volt sees. Independent of cleanup.',
        '🖱️ Смена MAC между слотами': '🖱️ MAC swap between slots',
        'Смена MAC между слотами': 'MAC swap between slots',
        'слотами. Если выключено — завершение пачки стыкуется к IP (END), без сдвига −2 мин.': 'slots. If disabled — pack completion joins the IP (END), without the −2 min shift.',
        '🔄 Переустановка Roblox': '🔄 Reinstall Roblox',
        'Переустановка Roblox': 'Reinstall Roblox',
        'Сначала чистится мусор и реестр, потом ставится свежий Roblox, затем Roblox закрывается через taskkill. Выбор сохраняется.': 'First, garbage and registry are cleaned, then a fresh Roblox is installed, then Roblox is closed via taskkill. The choice is saved.',
        '🎲 Смена игры по аккаунтам': '🎲 Game swap per account',
        'Каждый аккаунт уезжает в случайную игру на 40–120 с и возвращается обратно.': 'Each account goes to a random game for 40–120 s and comes back.',
        'Работает только с FarmTimer + смена MAC/IP': 'Works only with FarmTimer + MAC/IP swap',
        '💤 Отдых посередине цикла': '💤 Mid-cycle rest',
        'Делит слот на 2 части. На 35–50% — плавное закрытие и отлёг, затем вторая половина слота.': 'Splits the slot in two. At 35–50% — smooth close and rest, then the second half of the slot.',
        '🔀 Смена HWID между слотами включена': '🔀 HWID swap between slots enabled',
        '🖱️ Смена MAC между слотами включена': '🖱️ MAC swap between slots enabled',
        '💤 Отдых посередине цикла включён': '💤 Mid-cycle rest enabled',
        '⏸️ Смена HWID между слотами выключена — шаг будет пропущен': '⏸️ HWID swap between slots disabled — step will be skipped',
        '⏸️ Смена MAC выключена — завершение пачки стыкуется к IP (END)': '⏸️ MAC swap disabled — pack completion joins the IP (END)',
        '⏸️ Отдых посередине цикла выключен — шаг будет пропущен': '⏸️ Mid-cycle rest disabled — step will be skipped',
        'Сон — ферма в этом слоте не запускается': 'Sleep — the farm does not start in this slot',
        '⚙ НАСТРОЙКИ FARM TIMER': '⚙ FARM TIMER SETTINGS',
        'Фармить по очереди (без отдыха)': 'Farm in order (no rest)',
        '✅ Пачки фармятся по очереди без отдыха': '✅ Packs farm in order without rest',
        'С галочкой пачки фармятся по очереди без отдыха': 'With the checkbox, packs farm in order without rest',
        '⏱️ Работа (ч):': '⏱️ Work (h):',
        '😴 Отдых (мин):': '😴 Rest (min):',
        '⚙ НАСТРОЙКИ ANTI-AFK': '⚙ ANTI-AFK SETTINGS',
        '⏱️ Секунд на каждое окно:': '⏱️ Seconds per window:',
        '⚙ НАСТРОЙКИ RAM BOOST': '⚙ RAM BOOST SETTINGS',
        '💾 Лимит памяти (МБ):': '💾 Memory limit (MB):',
        '⚠️ Мин. 750 МБ': '⚠️ Min. 750 MB',
        '⏱️ Таймаут между чистками (сек):': '⏱️ Timeout between cleanups (sec):',
        '⚠️ Низкий таймаут нагружает процессор': '⚠️ Low timeout loads the CPU',
        '⏱️ Таймаут для 1 процесса (сек):': '⏱️ Timeout per process (sec):',
        '⚙ НАСТРОЙКИ TELEGRAM': '⚙ TELEGRAM SETTINGS',
        '🤖 Токен бота': '🤖 Bot token',
        'Введите токен бота...': 'Enter bot token...',
        '🆔 ID чата': '🆔 Chat ID',
        'Введите ID чата...': 'Enter chat ID...',
        '❌ Токен и ID канала не найдены в настройках!': '❌ Token and channel ID not found in settings!',
        '❌ Токен и ID канала обязательны!': '❌ Token and channel ID are required!',
        '❌ Токен слишком короткий!': '❌ Token is too short!',
        '❌ ID чата обязателен!': '❌ Chat ID is required!',
        '❌ Токен содержит недопустимые символы! Очистите поле и вставьте правильный токен бота.': '❌ Token contains invalid characters! Clear the field and paste the correct bot token.',
        'Логин и пароль хранятся локально и используются для автологина Volt': 'Login and password are stored locally and used for Volt auto-login',
        '⚙ НАСТРОЙКИ DISCORD': '⚙ DISCORD SETTINGS',
        '⚙ НАСТРОЙКИ ЗАПУСКА': '⚙ START SETTINGS',
        '⚙ НАСТРОЙКИ ОСТАНОВКИ': '⚙ STOP SETTINGS',
        '✅ Подтвердить': '✅ Confirm',
        '💾 Сохранить': '💾 Save',
        'Сохранить': 'Save',
        '⏳ Сохраняем...': '⏳ Saving...',
        '💾 Настройки сохранены!': '💾 Settings saved!',
        'Настройки сохранены!': 'Settings saved!',
        'Показать пароль': 'Show password',
        'Скрыть пароль': 'Hide password',
        'Автозапуск при старте': 'Auto-start on launch',
        'Подключать при запуске': 'Connect on startup',
        'Проверка окон (сек):': 'Window check (sec):',
        'Текст предупреждения': 'Warning text',
        'ВКЛ': 'ON',
        'ВЫКЛ': 'OFF',
        '✅ Включено': '✅ Enabled',
        'Включено': 'Enabled',
        'Включен': 'Enabled',
        'Выключено': 'Disabled',
        'Выключен': 'Disabled',
        '⏸️ Выключено': '⏸️ Disabled',
        '⏹️ Anti-AFK выключен': '⏹️ Anti-AFK disabled',
        '⏹️ VoltAuthControl выключен': '⏹️ VoltAuthControl disabled',
        '🛡️ Manual режим выключен': '🛡️ Manual mode disabled',
        '🛡️ Manual режим включен': '🛡️ Manual mode enabled',
        '⏳ DelayOpen выключен': '⏳ DelayOpen disabled',
        '🚀 RAM Boost выключен': '🚀 RAM Boost disabled',
        '▶️ Снять паузу': '▶️ Resume',
        '⏸️ Поставить на паузу': '⏸️ Pause',
        '💤 Отлёга': '💤 Rest',
        '🟢 Фармит': '🟢 Farming',
        '⏳ В очереди': '⏳ Queued',
        'В очереди': 'Queued',
        'В очереди...': 'Queued...',
        'Остановлен': 'Stopped',
        '❌ Остановлен': '❌ Stopped',
        'Остановлено': 'Stopped',
        'Уже запущен': 'Already running',
        'работает': 'running',
        'недоступна': 'unavailable',
        '⛔ Индивидуальный MAC недоступен на вашей лицензии': '⛔ Individual MAC is unavailable on your license',
        '⛔ Прокси недоступно на вашей лицензии': '⛔ Proxy is unavailable on your license',
        '⛔ Anti-AFK недоступен на вашей лицензии': '⛔ Anti-AFK is unavailable on your license',
        '⛔ Лаунч доступен только с активной лицензией': '⛔ Launch is available only with an active license',
        '⛔ GetCookie доступен только с активной лицензией': '⛔ GetCookie is available only with an active license',
        '🔐 VoltAuthControl включён — проверка сессии Volt каждую минуту': '🔐 VoltAuthControl enabled — Volt session check every minute',

        // ===== Модалки =====
        'Ввод данных для Cookie': 'Cookie data entry',
        '📝 Заметка для пачки #': '📝 Note for pack #',
        'Заметка для пачки': 'Note for pack',
        'Храните тут вашу заметку': 'Keep your note here',
        'Нет заметки': 'No note',
        'Вставьте куки': 'Paste cookies',
        'Удалить куки': 'Delete cookies',
        '🗑️ Удалить': '🗑️ Delete',
        '🗑️ Очистить': '🗑️ Clear',
        '🗑️ УДАЛЕНИЕ ПАЧКИ': '🗑️ DELETE PACK',
        '🗑️ УДАЛЕНИЕ БЭКАПА': '🗑️ DELETE BACKUP',
        'Все аккаунты потеряют бэкап. Новый бэкап создастся автоматически при следующем запуске каждого аккаунта.': 'All accounts will lose their backup. A new backup will be created automatically at the next launch of each account.',
        'Сбросить время и сохранить новые куки?': 'Reset time and save new cookies?',
        'Редактирование Пачки #': 'Editing Pack #',
        'Не удалось сохранить — проверьте доступ к папке приложения': 'Failed to save — check access to the app folder',
        'Не удалось сохранить: ': 'Failed to save: ',
        'Ошибка сохранения: ': 'Save error: ',
        'Пропущено дублей: ': 'Duplicates skipped: ',
        'Принято первая строка: ': 'First line accepted: ',
        'Список куки очищен': 'Cookie list cleared',
        '🖥 Консоль': '🖥 Console',
        '📸 Экран': '📸 Screen',
        '📊 Статус': '📊 Status',
        '📊 ИТОГО:': '📊 TOTAL:',
        '💤 Отдыхает': '💤 Sleeping',
        '✅ Закончено': '✅ Finished',
        '   ✅ Закончено: ': '   ✅ Finished: ',
        '   💤 Отдыхает: ': '   💤 Sleeping: ',
        '   🟢 Фармит: ': '   🟢 Farming: ',
        '   ⏳ В очереди: ': '   ⏳ Queued: ',
        '   👥 Аккаунтов: ': '   👥 Accounts: ',
        '   🔴 Забанено: ': '   🔴 Banned: ',
        '   📈 Средний престиж: ': '   📈 Average prestige: ',
        '   📊 Средний уровень: ': '   📊 Average level: ',
        '   💎 Всего гемов: ': '   💎 Total gems: ',
        '   🪙 Всего золота: ': '   🪙 Total gold: ',
        '   🪙 Золото: ': '   🪙 Gold: ',
        '   💎 Гемы: ': '   💎 Gems: ',
        '   🕐 Обновлен: ': '   🕐 Updated: ',
        '🕐 Обновлено: ': '🕐 Updated: ',
        '📈 Нафармлено: ': '📈 Farmed: ',
        '💥 Падений окон: ': '💥 Window crashes: ',
        ' аккаунтов': ' accounts',
        '🔌 Драйвер': '🔌 Driver',
        'Драйвер': 'Driver',
        '🔌 Драйвер: установлен': '🔌 Driver: installed',
        '🔌 Драйвер: не установлен': '🔌 Driver: not installed',
        '🔌 Драйвер: нет данных': '🔌 Driver: no data',
        '🔌 Драйвер: не удалось проверить': '🔌 Driver: failed to check',
        '🔌 Проверка статуса драйвера…': '🔌 Checking driver status…',
        'Драйвер: проверка…': 'Driver: checking…',
        'Драйвер: установлен': 'Driver: installed',
        'Драйвер: не установлен': 'Driver: not installed',
        'Драйвер: нет данных': 'Driver: no data',
        'Драйвер: не удалось проверить': 'Driver: failed to check',
        '🔌 УСТАНОВКА ПРОКСИ-ДРАЙВЕРА': '🔌 PROXY DRIVER INSTALL',
        '🔌 Установить драйвер': '🔌 Install driver',
        '⬇️ Установить': '⬇️ Install',
        'Что это?': 'What is it?',
        '⚠ Внимание, антивирус!': '⚠ Attention, antivirus!',
        'ложное срабатывание': 'false positive',
        'Что делать для исключения:': 'What to do for exclusion:',
        '1. Откройте Защитник Windows →': '1. Open Windows Defender →',
        'Управление исключениями': 'Exclusion management',
        '2. Добавьте в исключения папку приложения:': '2. Add the app folder to exclusions:',
        '3. Вернитесь и нажмите': '3. Go back and click',
        '«Установить драйвер»': '“Install driver”',
        'нажмите «Установить»': 'click “Install”',
        'Per-instance прокси для Roblox. Каждое окно выходит в интернет через': 'Per-instance proxy for Roblox. Each window goes online through',
        'свой': 'its own',
        'прокси-сервер. Работает на уровне сетевого драйвера (WinDivert) — внутри Roblox ничего не встраивается, античит Hyperion ничего не видит.': 'proxy server. Works at the network driver level (WinDivert) — nothing is injected into Roblox, the Hyperion anti-cheat sees nothing.',
        'Сетевой драйвер может быть воспринят антивирусом как': 'The network driver may be perceived by the antivirus as',
        'подозрительный — это': 'suspicious — this is a',
        'Драйвер регистрируется как служба «WinDivert» и работает, пока запущено приложение. Файлы: WinDivert.dll + WinDivert64.sys.': 'The driver registers as a “WinDivert” service and works while the app is running. Files: WinDivert.dll + WinDivert64.sys.',
        'Тест прокси': 'Proxy test',
        '❌ Тест прокси: ': '❌ Proxy test: ',
        'Проверка': 'Check',
        'Проверка...': 'Checking...',
        'Ошибка запуска: ': 'Launch error: ',
        'Не удалось запустить: ': 'Failed to launch: ',
        'Файл не найден': 'File not found',
        'Ошибка доступа': 'Access error',
        'Скопированно': 'Copied',
        ' · на диске': ' · on disk',
        'на диске': 'on disk',
        'IPC не доступен': 'IPC unavailable',
        'Купить ключ': 'Buy key',
        'Логин Volt': 'Volt login',
        'Пароль Volt': 'Volt password',
        '🔑 Пароль:': '🔑 Password:',
        '👤 Логин:': '👤 Login:',
        '⚠️ Сначала сохраните логин и пароль': '⚠️ First save the login and password',
        '⚠️ Введите логин и пароль!': '⚠️ Enter login and password!',
        '🔐 Данные входа Volt сохранены': '🔐 Volt credentials saved',
        'Престиж': 'Prestige',
        'Уровень': 'Level',
        'Золото': 'Gold',
        'Гемы': 'Gems',
        'Ник': 'Nick',
        'Куки': 'Cookies',

        // ===== Модалка лаунчера / драйвер / лицензия (дополнения) =====
        'НАСТРОЙКИ': 'SETTINGS',
        'Сортировка': 'Sort',
        '🗄️ Хранилище': '🗄️ Storage',
        '30 дней': '30 days',
        '90 дней': '90 days',
        '7 дней': '7 days',
        '⏱️ Интервал проверки (сек)': '⏱️ Check interval (sec)',
        '⏱️ Общее время закрытия': '⏱️ Total closing time',
        'время в окне ±30%': 'time in window ±30%',
        '⚠️ СМЕНА СОСТАВА КУКИ': '⚠️ COOKIE SET CHANGE',
        'Индивидуальный MAC для каждого аккаунта': 'Individual MAC for each account',
        '⚠️ Требуется Windows 11 Pro/Enterprise(Hyper-V)': '⚠️ Requires Windows 11 Pro/Enterprise (Hyper-V)',
        'Чтобы приложение работало корректно, оно должно быть запущено от имени администратора, а ваше разрешение экрана не меньше чем 1920x1080, а мышь должна иметь 100% DPI в настройках windows.': 'For the app to work correctly, it must be run as administrator, the screen resolution must be at least 1920x1080, and the mouse must have 100% DPI in Windows settings.',
        'WinDivert — легитимный, с открытым исходным кодом, используется в Proxifier, Clash, игровых тунелях.': 'WinDivert — legitimate, open source, used in Proxifier, Clash, game tunnels.',
        // Фрагменты Smart-Swap (текст разбит на строки HTML)
        'Меняет MAC-адрес сетевого адаптера между': 'Changes the network adapter MAC address between',
        'слотами — это аппаратный идентификатор,': 'slots — this is the hardware identifier,',
        'который видит Volt. Независимо от чистки.': 'that Volt sees. Independent of cleanup.',
        'слотами. Если выключено — завершение пачки': 'slots. If disabled — pack completion',
        'стыкуется к IP (END), без сдвига −2 мин.': 'joins the IP (END), without the −2 min shift.',
        'Сначала чистится мусор и реестр, потом': 'First, garbage and registry are cleaned, then',
        'ставится свежий Roblox, затем Roblox': 'a fresh Roblox is installed, then Roblox',
        'закрывается через taskkill. Выбор сохраняется.': 'is closed via taskkill. The choice is saved.',
        'Каждый аккаунт уезжает в случайную игру': 'Each account goes to a random game',
        'на 40–120 с и возвращается обратно.': 'for 40–120 s and comes back.',
        'Делит слот на 2 части. На 35–50% —': 'Splits the slot in two. At 35–50% —',
        'плавное закрытие и отлёг, затем': 'smooth close and rest, then',
        'вторая половина слота.': 'the second half of the slot.',

        // ===== Логи фермы (main-процесс → консоль) =====
        '🕐 Плавное закрытие Roblox: ': '🕐 Smoothly closing Roblox: ',
        '✅ Все ': '✅ All ',
        ' окон Roblox закрыты': ' Roblox windows closed',
        'окон': 'windows',
        'разброс': 'jitter',
        '🕐 Пачка #': '🕐 Pack #',
        ' завершена, плавное закрытие инстансов...': ' finished, smoothly closing instances...',
        '✅ Все инстансы закрыты': '✅ All instances closed',
        '💤 Слот-сон — компьютер отдыхает ещё ': '💤 Slot sleep — the computer rests for another ',
        '✅ Инстансы закрыты, отлёг ': '✅ Instances closed, rest ',
        '⏳ Шаги между слотами не завершены — старт фермы отложен на ': '⏳ Inter-slot steps not finished — farm start delayed by ',
        '⚠️ Шаги между слотами не завершились — запуск фермы принудительно': '⚠️ Inter-slot steps not finished — starting the farm forcefully',
        '🛌 Вклинивание: пачка в режиме СОН — запуск отменён': '🛌 Session join: pack in SLEEP mode — launch cancelled',
        '🚫 Shadow Ban (': '🚫 Shadow Ban (',
        ') — остановка фермы': ') — farm stopped',
        '🗑️ Пачка #': '🗑️ Pack #',
        ' удалена': ' deleted',
        '❌ Ошибка запуска фермы: ': '❌ Farm launch error: ',
        '⛔ Solver недоступен на вашей лицензии': '⛔ Solver is unavailable on your license',
        '⚠️ Вклинивание не удалось (': '⚠️ Session join failed (',
        ') — обычный запуск': ') — normal launch',
        '🗑️ Общее время фарма очищено': '🗑️ Total farm time cleared',
        '💾 Принудительно сохранено: пачка #': '💾 Force-saved: pack #',
        '🔑 ZeroPoint API-ключ сохранён': '🔑 ZeroPoint API key saved',
        '🔑 ZeroPoint API-ключ очищен': '🔑 ZeroPoint API key cleared',
        '🗑️ Список аккаунтов очищен (по запросу пользователя)': '🗑️ Account list cleared (by user request)',
        '🗑️ Бан-лист очищен (по запросу пользователя)': '🗑️ Ban list cleared (by user request)',
        '🧬 Spoofer: MAC изменён (': '🧬 Spoofer: MAC changed (',
        '⚠️ Spoofer: MAC не изменён — ': '⚠️ Spoofer: MAC not changed — ',
        '🚀 Вклинивание в сеанс': '🚀 Joining session',
        '🚀 Запуск фермы': '🚀 Farm start',
        '💾 Pack': '💾 Pack',
        '.txt обновлен': '.txt updated',
        '❌ Ошибка сохранения кук: ': '❌ Cookie save error: ',
        '❌ Ошибка удаления пачки: ': '❌ Pack deletion error: ',
        '⚠️ Пачка #': '⚠️ Pack #',
        ' пуста': ' is empty',
        '⚠️ Нет сохранённых ручных кук': '⚠️ No saved manual cookies',
        '❌ Ошибка вклинивания в сеанс: ': '❌ Session join error: ',
        '❌ Ошибка остановки фермы: ': '❌ Farm stop error: ',
        '❌ Проверка пачки #': '❌ Pack check #',
        '⚠️ Вклинивание: Smart-Swap предупреждение: ': '⚠️ Session join: Smart-Swap warning: ',
        '❌ RAM Boost недоступен: нативный модуль не загрузился': '❌ RAM Boost unavailable: native module failed to load',
        '❌ Система лицензирования недоступна — запуск невозможен': '❌ Licensing system unavailable — launch impossible',
        // ('❌ Ошибка запуска: неверные параметры FarmTimer' НЕ здесь: строка
        //    приходит в лог уже переведённой из main (core/ipc-handlers.js),
        //    а лог-боксы i18n не трогает — дубль только путал.)
        '📨 [Master] ': '📨 [Master] ',
        '🔔 [Master] ': '🔔 [Master] ',
        'Уведомление': 'Notification',
        '⚠️ Volt Renderer не отвечает (': '⚠️ Volt Renderer is not responding (',
        'получил чистый токен авторизации': 'received a clean authorization token',
        '💤 Отлёга: ': '💤 Rest: ',
        'Отлёга: ': 'Rest: ',

        // ===== Динамические сообщения =====
        '✅ Ферма снова на связи: пачка #': '✅ Farm is back online: pack #',
        '🔗 Вклиниваюсь в сеанс: пачка #': '🔗 Joining session: pack #',
        '🔄 Продолжение сессии: пачка #': '🔄 Resuming session: pack #',
        '🎯 Окно открыто (': '🎯 Window opened (',
        ') — сделано ': ') — done ',
        '⏸️ Ждём окно ': '⏸️ Waiting for window ',
        ' (сейчас ': ' (now ',
        '📝 Пачка #': '📝 Pack #',
        ' закончила фарм в ': ' finished farming at ',
        ' мин (без ребута)': ' min (no reboot)',
        '⏳ DelayOpen включён (открытие отложится на 20–': '⏳ DelayOpen enabled (opening delayed by 20–',
        '🖱️ Anti-AFK включён (': '🖱️ Anti-AFK enabled (',
        'с на окно, ±30%)': 's per window, ±30%)',
        '🖱️ Anti-AFK включён из Telegram (': '🖱️ Anti-AFK enabled from Telegram (',
        'с на окно)': 's per window)',
        '🖱️ Anti-AFK: интенсивность ': '🖱️ Anti-AFK: intensity ',
        '🖱️ Anti-AFK выключен из Telegram': '🖱️ Anti-AFK disabled from Telegram',
        '🚀 RAM Boost включен (': '🚀 RAM Boost enabled (',
        ' МБ, интервал ': ' MB, interval ',
        '🚀 RAM Boost обновлен: лимит ': '🚀 RAM Boost updated: limit ',
        'с, пауза ': 's, pause ',
        '🚀 RAM Boost включён из Telegram (': '🚀 RAM Boost enabled from Telegram (',
        ' МБ)': ' MB)',
        '🚀 RAM Boost выключен из Telegram': '🚀 RAM Boost disabled from Telegram',
        '⏳ DelayOpen: максимум ': '⏳ DelayOpen: max ',
        '✅ Roblox переустановлен, Volt-файлы вернулись (': '✅ Roblox reinstalled, Volt files restored (',
        '⚠️ Roblox переустановлен, но Volt-файлы не вернулись': '⚠️ Roblox reinstalled, but Volt files were not restored',
        ' (уже была)': ' (already installed)',
        'Запуск ': 'Starting ',
        'Ошибка': 'Error',
        'Статус:': 'Status:',
        'Ошибка сохранения': 'Save error',
        '❌ Ошибка сохранения': '❌ Save error',
        '❌ Ошибка сохранения: ': '❌ Save error: ',
        '❌ Не удалось получить статус': '❌ Failed to get status',
        '❌ Ошибка выполнения команды': '❌ Command execution error',
        '✅ Команда выполнена': '✅ Command executed',
        '⏳ Предыдущая команда ещё выполняется, подождите...': '⏳ The previous command is still running, wait...',
        '⚠️ Таймаут выполнения команды': '⚠️ Command execution timeout',
        '🔗 Вклиниваюсь в сеанс (без перезапуска фермы)': '🔗 Joining session (without farm restart)',
        'Автоматически продолжит фарм в случае краша или перезапуска приложения, не перезагружая ферму.': 'Automatically continues farming in case of a crash or app restart, without reloading the farm.',
        'Изолировать аккаунты с капчей (блокировать запуск)': 'Isolate accounts with captcha (block launch)',

        // ===== Чекер / сольвер =====
        '🧩 Отправляю captcha-lock в ZeroSolver...': '🧩 Sending captcha-lock to ZeroSolver...',
        '🧩 Забираю captcha-lock из чекера...': '🧩 Taking captcha-lock from the checker...',
        '🧩 Отправляю в ZeroSolver...': '🧩 Sending to ZeroSolver...',
        '🧩 В очереди': '🧩 Queued',
        '🧩 Решается': '🧩 Solving',
        'Решается': 'Solving',
        '🧑 Отправляю на FaceUnlock...': '🧑 Sending to FaceUnlock...',
        '🍪 Запрашиваю свежие куки...': '🍪 Requesting fresh cookies...',
        '✅ FaceUnlock: разблокировано ': '✅ FaceUnlock: unlocked ',
        '✅ ZeroSolver: разблокировано ': '✅ ZeroSolver: unlocked ',
        '✅ Разблокировано: ': '✅ Unlocked: ',
        'разблокировано': 'unlocked',
        'уже решено': 'already solved',
        'не вышло': 'failed',
        'прочие': 'other',
        'списано': 'charged',
        '🍪 Свежих куки: ': '🍪 Fresh cookies: ',
        '  •  уже решено: ': '  •  already solved: ',
        '  •  не вышло: ': '  •  failed: ',
        '  •  прочие ': '  •  other ',
        '  •  обновлено в пачке: ': '  •  updated in pack: ',
        '  •  списано $': '  •  charged $',
        '  •  списано ': '  •  charged ',
        ', уже решено ': ', already solved ',
        ', не вышло ': ', failed ',
        ', списано ': ', charged ',
        ' кред.': ' cred.',
        '❌ CookieDead → свежие куки': '❌ CookieDead → fresh cookies',
        '🧩 CaptchaLock → в сольвер': '🧩 CaptchaLock → to solver',
        '🧑 FaceLock → на разблокировку': '🧑 FaceLock → to unlock',
        'Готово: ': 'Done: ',
        'Скопировано куки: ': 'Cookies copied: ',
        'Ошибка: ': 'Error: ',
        'Ник ': 'Nick ',
        ' скопирован': ' copied',
        'Ник неизвестен': 'Nick unknown',
        'авто-снятие через ': 'auto-remove via ',
        ' (активен)': ' (active)',
        '| тихий:': '| silent:',
        '| ждём': '| waiting',
        'паника': 'panic',
        'поток off': 'stream off',
        'проверка…': 'checking…',
        'не найден': 'not found',
        'создан в:': 'created at:',
        'Ошибка сохранения': 'Save error',
        'Ошибка': 'Error',
        'Готово': 'Done',
        'Закрыть': 'Close',
        'Отмена': 'Cancel',
        'Сохранить': 'Save',
        'Удалить': 'Delete',
        'Удалить пачку?': 'Delete pack?',
        'Настройки': 'Settings',
        'Стоп-флаг создан': 'Stop flag created',
        'Сброс сессии': 'Session reset',
        'АКТИВЕН': 'ACTIVE',
        'НЕ АКТИВИРОВАН': 'NOT ACTIVATED',
        'ИСТЁК': 'EXPIRED',
        'ЗАБЛОКИРОВАН': 'BLOCKED',
        'ОКНО НЕ ОТВЕЧАЕТ': 'WINDOW NOT RESPONDING',
        '✅ Бот работает': '✅ Bot works',
        '✅ Telegram модуль загружен': '✅ Telegram module loaded',
        '✅ УСПЕХ': '✅ SUCCESS',
        '❌ ОШИБКА': '❌ ERROR',
        '✅ Включено': '✅ Enabled',
        'Инициализация...': 'Initializing...',
        'Подключение...': 'Connecting...',
        '🔄 Подключение...': '🔄 Connecting...',
        '⏳ Подключение...': '⏳ Connecting...',
        'Проверка...': 'Checking...',
        'Проверка пачки': 'Pack check',
        'Скопировано': 'Copied',
        'Онлайн:': 'Online:',
        'Статус:': 'Status:',
        'Инстансы:': 'Instances:',
        '0 / 240 мин': '0 / 240 min',
        '0 / 60 мин': '0 / 60 min',
        '20 мин': '20 min',
        'Цикл.': 'Cycle',
        'Выключено': 'Disabled',
        'Включено': 'Enabled',
        'Автозапуск: ': 'Auto-start: ',
        'Токен: ': 'Token: ',
        'Чат ID: ': 'Chat ID: ',
        'ID канала:': 'Channel ID:',
        'Введите ID канала...': 'Enter channel ID...',
        'Токен бота:': 'Bot token:',
        'Стоп': 'Stop',
        'Запуск': 'Start',
        '▶️ Запуск': '▶️ Start',
        '⏹️ Стоп': '⏹️ Stop',
        '⏭️ Скип': '⏭️ Skip',
        'ℹ️ Помощь': 'ℹ️ Help',
        'Помощь': 'Help',
        'Остановить ферму': 'Stop farm',
        'Запустить ферму': 'Start farm',
        'Параметры сессии': 'Session settings',
        'Настройки остановки': 'Stop settings',
        'Настройки запуска': 'Start settings',
        'Сон (мин)': 'Sleep (min)',
        'Куки': 'Cookies',
        'Пачка': 'Pack',
        'Слот': 'Slot',
        'Слоты': 'Slots',
        'Время': 'Time',
        'Осталось': 'Remaining',
        'Всего': 'Total',
        'Аккаунтов': 'accounts',
        'Аккаунты': 'Accounts',
        'Инстансов': 'instances',
        'Окон': 'windows',
        'Ник': 'Nick',
        'Статус': 'Status',
        'Настройка': 'Settings',
        'Обновить': 'Refresh',
        'Обновлено': 'Updated',
        'Настройки сохранены': 'Settings saved',
        'Сохранено': 'Saved',
        'Загружено': 'Loaded',
        'Пачки': 'Packs',
        'Ферма': 'Farm',
        'Фермы': 'Farms',
        'Остановлена': 'Stopped',
        'Запущена': 'Started',
        'Работает': 'Running',
        'Работает': 'Running',
        'Не работает': 'Not running',
        'Онлайн': 'Online',
        'Офлайн': 'Offline',
        'Оффлайн': 'Offline',
        'Подключен': 'Connected',
        'Отключен': 'Disconnected',
        'Подключено': 'Connected',
        'Отключено': 'Disconnected',
        'Данные': 'Data',
        'Параметры': 'Parameters',
        'Значение': 'Value',
        'Модуль': 'Module',
        'Модули': 'Modules',
        'Проверить': 'Check',
        'Проверка': 'Check',
        'Команда': 'Command',
        'Команды': 'Commands',
        'Скриншот': 'Screenshot',
        'Сделать скриншот': 'Take screenshot',
        'Лицензия': 'License',
        'Ключ': 'Key',
        'Активация': 'Activation',
        'Активировать': 'Activate',
        'Активирован': 'Activated',
        'Активировано': 'Activated',
        'Выбрать': 'Select',
        'Выбрано': 'Selected',
        'Проверка': 'Check',
        'Версия': 'Version',
        'Версии': 'Versions',
        'Обновление': 'Update',
        'Установка': 'Installation',
        'Установить': 'Install',
        'Установлен': 'Installed',
        'Установлена': 'Installed',
        'Установлено': 'Installed',
        'Запуск': 'Start',
        'Остановка': 'Stop',
        'Перезапуск': 'Restart',
        'Перезагрузка': 'Reload',
        'Задержка': 'Delay',
        'Таймаут': 'Timeout',
        'Интервал': 'Interval',
        'Цикл': 'Cycle',
        'Циклов': 'Cycles',
        'Количество': 'Number',
        'Максимум': 'Max',
        'Минимум': 'Min',
        'Случайно': 'Random',
        'Автоматически': 'Automatically',
        'Вручную': 'Manually',
        'При запуске': 'On launch',
        'При старте': 'On start',
        'Очистка': 'Cleanup',
        'Чистка': 'Cleanup',
        'Начать': 'Start',
        'Завершить': 'Finish',
        'Завершено': 'Finished',
        'Завершена': 'Finished',
        'Закончено': 'Finished',
        'Выполнено': 'Done',
        'Отменено': 'Cancelled',
        'Удалено': 'Deleted',
        'Добавлено': 'Added',
        'Изменено': 'Changed',
        'Обновлено': 'Updated',
        'Синхронизация': 'Sync',
        'Синхронизировано': 'Synced',
        'Состояние': 'State',
        'Неизвестно': 'Unknown',
        'Ожидание': 'Waiting',
        'Ожидается': 'Expected',
        'Повторить': 'Retry',
        'Попробуйте снова': 'Try again',
        'Не удалось': 'Failed',
        'Успешно': 'Success',
        'Доступно': 'Available',
        'Недоступно': 'Unavailable',
        'Включить': 'Enable',
        'Выключить': 'Disable'
    };

    // ------------------------------------------------------------
    // 🎯 РЕГУЛЯРКИ для сообщений с подстановкой значений (${...})
    // BEFORE_DICT — полные шаблоны, чтобы общие ключи словаря
    //              (например «Пачка», «Параметры») не успели сломать их.
    // AFTER_DICT — единицы измерения (мин/сек/минут/секунд/ч), чтобы
    //              не разбить целые фразы словаря с числами.
    // ------------------------------------------------------------
    var PATTERNS_BEFORE = [
        [/📝 Пачка #(\d+) закончила фарм в (.+)/g,
            '📝 Pack #$1 finished farming at $2'],
        [/Пачка #(\d+) имеет нафармленное время: (\d+) мин\./g,
            'Pack #$1 has farmed time: $2 min.'],
        [/✅ Ферма снова на связи: пачка #(\d+), (\d+) мин/g,
            '✅ Farm is back online: pack #$1, $2 min'],
        [/🔗 Вклиниваюсь в сеанс: пачка #(\d+), (\d+) мин \(без ребута\)/g,
            '🔗 Joining session: pack #$1, $2 min (no reboot)'],
        [/🔄 Продолжение сессии: пачка #(\d+), (\d+) мин/g,
            '🔄 Resuming session: pack #$1, $2 min'],
        [/📝 Пачка #(\d+) сброшена по запросу пользователя \(было (\d+) мин\)/g,
            '📝 Pack #$1 reset at user request (was $2 min)'],
        [/Открыто в (.+)\. Логин:пароль скопированы/g,
            'Opened in $1. Login:password copied'],
        [/Ожидается: (.+)/g, 'Expected: $1'],
        [/Каталог: (\d+) версий/g, 'Catalog: $1 versions'],
        [/Сохранено: (.+) \((\d+) версий\)/g, 'Saved: $1 ($2 versions)'],
        [/Установка (.+)\.\.\./g, 'Installing $1...'],
        [/Запуск (\d+)\/(\d+)/g, 'Starting $1/$2'],
        [/Готово: (\d+) \/ (\d+)/g, 'Done: $1 / $2'],
        [/Скопировано куки: (\d+)/g, 'Cookies copied: $1'],
        [/Ник (.+) скопирован/g, 'Nick $1 copied'],
        [/Пропущено дублей: (\d+)/g, 'Duplicates skipped: $1'],
        [/Принято первая строка: (.+)/g, 'First line accepted: $1'],
        [/— калибровка Play может не совпасть\. Поставьте 100% \(Параметры → Дисплей → Масштаб\) или перекалибруйте: npm run calibrate/g,
            '— Play calibration may mismatch. Set 100% (Settings → Display → Scale) or recalibrate: npm run calibrate'],
        [/Масштаб Windows (\d+)%, DPI 100% — подходит для навигации/g,
            'Windows scale $1%, DPI 100% — suitable for navigation'],
        [/Экран (\d+)×(\d+), DPI 100% — подходит для навигации/g,
            'Screen $1×$2, DPI 100% — suitable for navigation'],
        [/\(меньше (\d+)x(\d+), окно игры 1246x900 не поместится\)/g,
            '(smaller than $1x$2, the 1246x900 game window will not fit)'],
        [/Удалить пачку #(\d+)\? Куки, заметка и данные пачки будут удалены безвозвратно\./g,
            'Delete pack #$1? Cookies, note and pack data will be deleted permanently.'],
        [/Вы полностью меняете состав куки \(нет ни одного совпадения\) — это сбросит прогресс пачки #(\d+)\n\n/g,
            'You are completely changing the cookie set (no matches) — this will reset the progress of pack #$1\n\n'],
        [/Время равномерно распределяется между всеми окнами Roblox\./g,
            'Time is distributed evenly between all Roblox windows.'],
        [/getcookie: (\d+) аккаунтов/g, 'getcookie: $1 accounts'],
        [/Бэкап куки удалён для пачки #(\d+) \((\d+) из (\d+) акк\.\)/g,
            'Cookie backup deleted for pack #$1 ($2 of $3 acc.)'],
        [/пачка #(\d+) пуста/g, 'pack #$1 is empty'],
        [/signin fail \(этап (\d+)\)/g, 'signin fail (stage $1)'],
        [/🆘 Аварийное закрытие: перезапуск попал в островок слота — закрываю окна аккаунтов \((.+)\)/g,
            '🆘 Emergency close: restart landed in the slot island — closing account windows ($1)'],
        [/🆘 Аварийная смена MAC \(тайминг пропущен\): (.+)/g,
            '🆘 Emergency MAC swap (timing missed): $1'],
        [/🆘 Аварийный ребут роутера \(тайминг пропущен\): (.+)/g,
            '🆘 Emergency router reboot (timing missed): $1'],
        [/🆘 Аварийная чистка следов \(тайминг пропущен\): (.+)/g,
            '🆘 Emergency trace cleanup (timing missed): $1']
    ];

    var PATTERNS_AFTER = [
        [/(\d+)\s*минут[а-я]*/g, '$1 minutes'],
        [/(\d+)\s*секунд[а-я]*/g, '$1 seconds'],
        [/(\d+)\s*мин(?!ут)/g, '$1 min'],
        [/(\d+)\s*сек(?!унд)/g, '$1 sec'],
        [/(\d+)\s*ч(?!ас)/g, '$1 h'],
        [/(\d+)с/g, '$1s'],
        [/(^|[^а-яёЁ])сек(?![а-яёЁ])/g, '$1sec']
    ];

    function normalize(s) {
        return s.replace(/\s+/g, ' ').trim();
    }

    // Словарь с нормализованными ключами и значениями (одинарные пробелы,
    // без краёв — обрамляющие пробелы берутся из самого текста)
    var DICT_NORM = {};
    Object.keys(DICT).forEach(function (k) {
        DICT_NORM[normalize(k)] = normalize(DICT[k]);
    });

    // Сортировка ключей: сначала длинные
    var KEYS = Object.keys(DICT_NORM).sort(function (a, b) { return b.length - a.length; });

    // ------------------------------------------------------------
    // ⚙️ ДВИЖОК ПЕРЕВОДА
    // ------------------------------------------------------------
    var enMode = false;
    var applying = false;

    function translateText(ru) {
        if (!enMode) return ru;
        var s = normalize(ru);
        // 0) полные шаблоны с подстановками — до словаря
        for (var i = 0; i < PATTERNS_BEFORE.length; i++) {
            s = s.replace(PATTERNS_BEFORE[i][0], PATTERNS_BEFORE[i][1]);
        }
        // 1) словарь (длинные ключи первыми)
        for (var j = 0; j < KEYS.length; j++) {
            var k = KEYS[j];
            if (s.indexOf(k) !== -1) s = s.split(k).join(DICT_NORM[k]);
        }
        // 2) единицы измерения — после словаря
        for (var p = 0; p < PATTERNS_AFTER.length; p++) {
            s = s.replace(PATTERNS_AFTER[p][0], PATTERNS_AFTER[p][1]);
        }
        return s;
    }

    function isSkipped(el) {
        return el && el.matches && el.matches(SKIP);
    }

    var ATTRS = ['placeholder', 'title', 'data-tooltip', 'aria-label', 'alt'];

    function applyToNode(node) {
        if (!node) return;
        if (node.nodeType === 3) {
            if (!node.__ru) node.__ru = node.nodeValue;
            var t3 = enMode ? translateText(node.__ru) : node.__ru;
            if (t3 !== node.nodeValue) {
                // 🔖 Метка собственной записи: self-mutation придёт АСИНХРОННО,
                //    когда applying уже false — по метке отличаем свой перевод
                //    от нового исходника (иначе __ru перезаписался бы английским
                //    и обратное переключение EN->RU переставало работать).
                node.__t = t3;
                node.nodeValue = t3;
            }
            return;
        }
        if (node.nodeType !== 1) return;
        for (var i = 0; i < ATTRS.length; i++) {
            var a = ATTRS[i];
            if (node.hasAttribute(a)) {
                var key = '__ru_' + a;
                if (!node[key]) node[key] = node.getAttribute(a);
                var val = enMode ? translateText(node[key]) : node[key];
                if (val !== node.getAttribute(a)) {
                    node['__t_' + a] = val;
                    node.setAttribute(a, val);
                }
            }
        }
        if (isSkipped(node)) return;
        var ch = node.childNodes;
        for (var c = 0; c < ch.length; c++) applyToNode(ch[c]);
    }

    function applyAll() {
        if (!document.body) return;
        applying = true;
        try {
            applyToNode(document.body);
        } finally {
            applying = false;
        }
    }

    function handleCharacterData(node) {
        if (!node || !node.parentNode) return;
        if (isSkipped(node.parentNode)) return;
        // Своя собственная запись перевода (self-mutation приходит асинхронно,
        // когда applying уже false) — это НЕ новый исходник: канон __ru,
        // записанный английским, ломал бы обратное переключение EN->RU.
        if (node.__t !== undefined && node.nodeValue === node.__t) return;
        // JS перезаписал текст узла (в коде всегда русский) — это новый исходник
        node.__ru = node.nodeValue;
        var target = enMode ? translateText(node.__ru) : node.__ru;
        if (target !== node.nodeValue) {
            node.__t = target;
            node.nodeValue = target;
        }
    }

    function handleAdded(root) {
        if (!root) return;
        if (root.nodeType === 3) {
            // текст без родителя-элемента: всё равно сохраняем канон
            if (!root.__ru) root.__ru = root.nodeValue;
            if (enMode) {
                var t = translateText(root.__ru);
                if (t !== root.nodeValue) root.nodeValue = t;
            }
            return;
        }
        if (root.nodeType !== 1) return;
        applyToNode(root);
    }

    var observer = null;

    function startObserver() {
        if (observer) return;
        observer = new MutationObserver(function (muts) {
            if (applying) return;
            applying = true;
            try {
                for (var i = 0; i < muts.length; i++) {
                    var m = muts[i];
                    if (m.type === 'characterData') {
                        handleCharacterData(m.target);
                    } else if (m.type === 'childList') {
                        var added = m.addedNodes;
                        for (var j = 0; j < added.length; j++) handleAdded(added[j]);
                    } else if (m.type === 'attributes') {
                        var a = m.attributeName;
                        if (ATTRS.indexOf(a) !== -1) {
                            var el = m.target;
                            // Своя собственная запись перевода — не новый исходник
                            if (el['__t_' + a] !== undefined && el.getAttribute(a) === el['__t_' + a]) continue;
                            var key = '__ru_' + a;
                            el[key] = el.getAttribute(a);
                            var val = enMode ? translateText(el[key]) : el[key];
                            if (val !== el.getAttribute(a)) {
                                el['__t_' + a] = val;
                                el.setAttribute(a, val);
                            }
                        }
                    }
                }
            } finally {
                applying = false;
            }
        });
        observer.observe(document.body, {
            subtree: true,
            childList: true,
            characterData: true,
            attributes: true,
            attributeFilter: ATTRS
        });
    }

    // ------------------------------------------------------------
    // 🌐 API
    // ------------------------------------------------------------
    function getLang() {
        var v;
        try { v = localStorage.getItem(STORE_KEY); } catch (e) { v = null; }
        if (v === 'en' || v === 'ru') return v;
        var langs = [];
        try {
            if (navigator.languages && navigator.languages.length) langs = navigator.languages;
            else if (navigator.language) langs = [navigator.language];
        } catch (e) {}
        for (var i = 0; i < langs.length; i++) {
            if (String(langs[i] || '').toLowerCase().indexOf('ru') === 0) return 'ru';
        }
        return 'en';
    }

    function setLang(lang) {
        var en = lang === 'en';
        enMode = en;
        try { localStorage.setItem(STORE_KEY, en ? 'en' : 'ru'); } catch (e) {}
        var sel = document.getElementById('lang-select');
        if (sel) sel.value = en ? 'en' : 'ru';
        document.documentElement.setAttribute('lang', en ? 'en' : 'ru');
        applyAll();
    }

    function init() {
        var lang = getLang();
        enMode = lang === 'en';
        document.documentElement.setAttribute('lang', lang);
        startObserver();
        applyAll();
        var sel = document.getElementById('lang-select');
        if (sel) {
            sel.value = lang;
            sel.addEventListener('change', function () {
                setLang(this.value);
            });
        }
    }

    window.I18N = {
        init: init,
        setLang: setLang,
        getLang: getLang,
        t: function (s) { return enMode ? translateText(s) : s; },
        isEn: function () { return enMode; }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();