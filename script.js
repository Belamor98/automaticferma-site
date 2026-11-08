(function () {
  'use strict';

  var STORAGE_KEY = 'af_lang';

  var translations = {
    ru: {
      'meta.title': 'AutomaticFermaPro — управление мульти-фермой Roblox',
      'meta.description': 'AutomaticFermaPro: мульти-ферма Roblox под полным контролем — Smart-Swap, Anti-AFK, Solver, Watchdog, Discord/Telegram-боты. Discord-сервер поддержки.',
      'nav.features': 'Возможности',
      'nav.status': 'Discord',
      'nav.security': 'Безопасность',
      'nav.faq': 'FAQ',
      'nav.download': 'Скачать',
      'demo.title': 'Интерактивное демо',
      'demo.sub': 'Попробуйте панель управления: тумблеры, шестерёнки, вкладки, старт/стоп — всё работает прямо в браузере.',
      'hero.badge': 'Desktop-приложение для Windows · Build v1.2',
      'hero.title': 'Мульти-ферма Roblox<br>под <span class="amber">полным контролем</span>',
      'hero.lead': 'AutomaticFermaPro объединяет десятки аккаунтов в одну панель: смена IP/MAC по слотам, Anti-AFK, Solver, Watchdog и боты для Discord и Telegram. Работает, пока вы спите.',
      'hero.cta1': 'Получить ключ',
      'hero.cta2': 'Возможности',
      'hero.stat1.value': '12+',
      'hero.stat1.label': 'модулей автоматизации',
      'hero.stat2.value': 'HWID',
      'hero.stat2.label': 'привязка лицензии',
      'hero.stat3.value': '24/7',
      'hero.stat3.label': 'watchdog и автоперезапуск',
      'discord.title': 'Наш <span class="amber">Discord</span>',
      'discord.sub': 'Поддержка, новости, ключи и комьюнити — всё в одном сервере.',
      'discord.server': 'Discord-сервер · dota_sng',
      'discord.support.key': 'Поддержка',
      'discord.news.key': 'Новости и апдейты',
      'discord.news.val': 'первыми',
      'discord.join': 'Присоединиться',
      'video.title': 'Видео-превью <span class="amber">фермы</span>',
      'video.sub': 'Смотри, как AutomaticFermaPro фармит Roblox — без детекта и банов.',
      'video.caption.title': 'preview Roblox Farm',
      'video.caption.sub': 'не детект метод · полный автоматик',
      'features.title': 'Что внутри',
      'features.sub': 'Каждый модуль включается тумблером — ферма собирается под вашу схему.',
      'feature.yummyauto.title': 'YummyAuto-консоль',
      'feature.yummyauto.text': 'Центральное управление мульти-фермой: запуск, остановка и контроль всех окон из одного места.',
      'feature.smartswap.title': 'Smart-Swap',
      'feature.smartswap.text': 'Смена IP и MAC-адреса по расписанию или слотам. Каждый инстанс живёт в своей сети.',
      'feature.placeid.title': 'Смена PlaceID',
      'feature.placeid.text': 'Переключение игры на лету без перезапуска фермы — по расписанию или вручную.',
      'feature.antiafk.title': 'Anti-AFK',
      'feature.antiafk.text': 'Защита от кика за бездействие: окна остаются «живыми» столько, сколько нужно.',
      'feature.solver.title': 'Solver',
      'feature.solver.text': 'Автоматическое прохождение проверок. Работает в связке с Anti-AFK и Cookie Checker.',
      'feature.ramboost.title': 'RAM Boost',
      'feature.ramboost.text': 'Контроль памяти и очистка по порогу — ферма не деградирует после суток работы.',
      'feature.watchdog.title': 'Watchdog',
      'feature.watchdog.text': 'Наблюдает за процессами и перезапускает упавшее. Ферма не останавливается из-за сбоя.',
      'feature.instsans.title': 'Instsans Control',
      'feature.instsans.text': 'Управление инстансами: пачки, приоритеты, отложенный запуск окон через DelayOpen.',
      'feature.discord.title': 'Discord и Telegram',
      'feature.discord.text': 'Боты присылают статусы, скриншоты и алерты. Управляйте фермой прямо из чата.',
      'feature.cookies.title': 'Cookie Manager',
      'feature.cookies.text': 'Проверка и глобализация куки, локальные списки мёртвых и заблокированных аккаунтов.',
      'feature.zeropoint.title': 'ZeroPoint API',
      'feature.zeropoint.text': 'Интеграция с внешними сервисами — по вашему явному действию, без фоновой активности.',
      'feature.guard.title': 'Guard-защита',
      'feature.guard.text': 'Лицензии с подписью Ed25519, привязка к железу, офлайн-режим с защитой от отката часов.',
      'security.title': 'Безопасность <span class="amber">по умолчанию</span>',
      'security.sub': 'Защита лицензий вынесена в нативный бинарник — секретов в JS нет.',
      'security.ed25519.title': 'Ed25519-подписи',
      'security.ed25519.text': 'Лицензии подписываются асимметрично: приватный ключ только на сервере, в клиенте — публичный. Подделать токен нельзя.',
      'security.hwid.title': 'Привязка к железу',
      'security.hwid.text': 'Ключ активируется на один HWID. Сброс возможен раз в сутки и подтверждается подписью.',
      'security.guard.title': 'Нативный Guard',
      'security.guard.text': 'Проверка токена, часов и HWID выполняется в Go-бинарнике. Целостность бинарника контролируется хешем.',
      'security.ratelimit.title': 'Rate-limit и туннель',
      'security.ratelimit.text': 'Сервер слушает только локально, наружу — через Cloudflare Tunnel с лимитами запросов на IP.',
      'faq.title': 'Частые вопросы',
      'faq.q1': 'Как получить доступ?',
      'faq.a1': 'Приложение распространяется по ключам. Введите ключ при первом запуске — лицензия привяжется к вашему ПК.',
      'faq.q2': 'Что делать при смене компьютера?',
      'faq.a2': 'В приложении есть сброс HWID — раз в сутки, с подтверждением подписью. Новая машина подхватит лицензию.',
      'faq.q3': 'Приложение работает без интернета?',
      'faq.a3': 'Да, есть офлайн-режим с защищённым счётчиком. Сервер нужен для активации и продления ключей.',
      'faq.q4': 'Сколько окон можно держать?',
      'faq.a4': 'Ограничение — только ресурсы вашего ПК. RAM Boost и Watchdog следят, чтобы ферма не деградировала.',
      'download.title': 'Готовы автоматизировать ферму?',
      'download.sub': 'Свяжитесь с нами, чтобы получить ключ и сборку для Windows.',
      'download.tg': 'Написать в Telegram',
      'download.discord': 'Наш Discord',
      'footer.copy': '© 2026 AutomaticFermaPro · automaticferma.bid',
      'footer.dim': 'Не аффилировано с Roblox Corporation'
    },
    en: {
      'meta.title': 'AutomaticFermaPro — Roblox multi-farm management',
      'meta.description': 'AutomaticFermaPro: Roblox multi-farm under full control — Smart-Swap, Anti-AFK, Solver, Watchdog, Discord/Telegram bots. Discord support server.',
      'nav.features': 'Features',
      'nav.status': 'Discord',
      'nav.security': 'Security',
      'nav.faq': 'FAQ',
      'nav.download': 'Download',
      'demo.title': 'Interactive demo',
      'demo.sub': 'Try the control panel: toggles, gears, tabs, start/stop — all work right in the browser.',
      'hero.badge': 'Desktop app for Windows · Build v1.2',
      'hero.title': 'Roblox multi-farm<br>under <span class="amber">full control</span>',
      'hero.lead': 'AutomaticFermaPro unites dozens of accounts in one panel: per-slot IP/MAC swap, Anti-AFK, Solver, Watchdog and bots for Discord and Telegram. Works while you sleep.',
      'hero.cta1': 'Get key',
      'hero.cta2': 'Features',
      'hero.stat1.value': '12+',
      'hero.stat1.label': 'automation modules',
      'hero.stat2.value': 'HWID',
      'hero.stat2.label': 'license binding',
      'hero.stat3.value': '24/7',
      'hero.stat3.label': 'watchdog & auto-restart',
      'discord.title': 'Our <span class="amber">Discord</span>',
      'discord.sub': 'Support, news, keys and community — all in one server.',
      'discord.server': 'Discord server · dota_sng',
      'discord.support.key': 'Support',
      'discord.news.key': 'News & updates',
      'discord.news.val': 'first',
      'discord.join': 'Join server',
      'video.title': 'Farm <span class="amber">video preview</span>',
      'video.sub': 'Watch AutomaticFermaPro farm Roblox — no detection, no bans.',
      'video.caption.title': 'preview Roblox Farm',
      'video.caption.sub': 'not detect method · full automatic',
      'features.title': "What's inside",
      'features.sub': 'Every module toggles on — build the farm to your scheme.',
      'feature.yummyauto.title': 'YummyAuto console',
      'feature.yummyauto.text': 'Central control of the multi-farm: start, stop and monitor all windows from one place.',
      'feature.smartswap.title': 'Smart-Swap',
      'feature.smartswap.text': 'Scheduled or per-slot IP and MAC address swap. Each instance lives in its own network.',
      'feature.placeid.title': 'PlaceID swap',
      'feature.placeid.text': 'Switch games on the fly without restarting the farm — by schedule or manually.',
      'feature.antiafk.title': 'Anti-AFK',
      'feature.antiafk.text': 'Protection from idle kick: windows stay "alive" as long as needed.',
      'feature.solver.title': 'Solver',
      'feature.solver.text': 'Automatic challenge solving. Works together with Anti-AFK and Cookie Checker.',
      'feature.ramboost.title': 'RAM Boost',
      'feature.ramboost.text': 'Memory control and cleanup by threshold — the farm doesn\'t degrade after a day of work.',
      'feature.watchdog.title': 'Watchdog',
      'feature.watchdog.text': 'Watches processes and restarts crashed ones. The farm doesn\'t stop on a failure.',
      'feature.instsans.title': 'Instsans Control',
      'feature.instsans.text': 'Instance management: batches, priorities, delayed window launch via DelayOpen.',
      'feature.discord.title': 'Discord & Telegram',
      'feature.discord.text': 'Bots send statuses, screenshots and alerts. Control the farm right from chat.',
      'feature.cookies.title': 'Cookie Manager',
      'feature.cookies.text': 'Cookie checking and globalization, local lists of dead and blocked accounts.',
      'feature.zeropoint.title': 'ZeroPoint API',
      'feature.zeropoint.text': 'Integration with external services — on your explicit action, no background activity.',
      'feature.guard.title': 'Guard protection',
      'feature.guard.text': 'Licenses signed with Ed25519, hardware binding, offline mode with clock-rollback protection.',
      'security.title': 'Security <span class="amber">by default</span>',
      'security.sub': 'License protection lives in a native binary — no secrets in JS.',
      'security.ed25519.title': 'Ed25519 signatures',
      'security.ed25519.text': 'Licenses are signed asymmetrically: private key only on the server, public key in the client. Tokens can\'t be forged.',
      'security.hwid.title': 'Hardware binding',
      'security.hwid.text': 'A key activates on one HWID. Reset is possible once a day and confirmed by signature.',
      'security.guard.title': 'Native Guard',
      'security.guard.text': 'Token, clock and HWID checks run in a Go binary. Binary integrity is controlled by hash.',
      'security.ratelimit.title': 'Rate-limit & tunnel',
      'security.ratelimit.text': 'The server listens locally only, exposed via Cloudflare Tunnel with per-IP request limits.',
      'faq.title': 'FAQ',
      'faq.q1': 'How to get access?',
      'faq.a1': 'The app is distributed by keys. Enter the key on first launch — the license binds to your PC.',
      'faq.q2': 'What if I change PC?',
      'faq.a2': 'The app has HWID reset — once a day, confirmed by signature. The new machine takes over the license.',
      'faq.q3': 'Does it work offline?',
      'faq.a3': 'Yes, there\'s an offline mode with a protected counter. The server is needed for activation and key renewal.',
      'faq.q4': 'How many windows can I run?',
      'faq.a4': 'Limited only by your PC\'s resources. RAM Boost and Watchdog keep the farm from degrading.',
      'download.title': 'Ready to automate your farm?',
      'download.sub': 'Contact us to get a key and Windows build.',
      'download.tg': 'Message on Telegram',
      'download.discord': 'Our Discord',
      'footer.copy': '© 2026 AutomaticFermaPro · automaticferma.bid',
      'footer.dim': 'Not affiliated with Roblox Corporation'
    }
    // PART2_MARKER
  };

  function getLang() {
    try { return localStorage.getItem(STORAGE_KEY) || 'ru'; } catch (e) { return 'ru'; }
  }

  function currentLang() {
    return window.__afLang || getLang();
  }

  function t(key) {
    var L = currentLang();
    var dict = translations[L] || translations.ru;
    return (dict && dict[key] != null) ? dict[key] : key;
  }

  function t_for(lang, key) {
    var dict = translations[lang] || translations.ru;
    return (dict && dict[key] != null) ? dict[key] : null;
  }

  function applyLang(lang) {
    if (!translations[lang]) lang = 'ru';
    window.__afLang = lang;
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
    document.documentElement.lang = lang;

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      var val = t_for(lang, key);
      if (val != null) el.textContent = val;
    });
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-html');
      var val = t_for(lang, key);
      if (val != null) el.innerHTML = val;
    });

    document.title = t_for(lang, 'meta.title') || document.title;
    var metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      var d = t_for(lang, 'meta.description');
      if (d) metaDesc.setAttribute('content', d);
    }

    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });
  }

  // ▶️ Видео-превью: клик — подгружаем YouTube-iframe с автоплеем
  function initVideoFacade() {
    var frame = document.getElementById('video-frame');
    if (!frame) return;
    function play() {
      var id = frame.getAttribute('data-youtube');
      if (!id || frame.querySelector('iframe')) return;
      var iframe = document.createElement('iframe');
      iframe.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0';
      iframe.title = 'preview Roblox Farm (not detect method)';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      iframe.allowFullscreen = true;
      frame.innerHTML = '';
      frame.appendChild(iframe);
    }
    frame.addEventListener('click', play);
    frame.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); play(); }
    });
  }

  // 🖼️ Демо-фрейм: iframe ровно 1080×1050 (стартовый размер окна приложения),
  // масштабируется под ширину контейнера — пропорции как на ПК
  function fitDemoFrame() {
    var wrap = document.querySelector('.demo-frame-wrap');
    var frame = document.querySelector('.demo-frame');
    if (!wrap || !frame) return;
    var scale = wrap.clientWidth / 1080;
    frame.style.transform = 'scale(' + scale + ')';
  }


  // lang switch handlers
  document.querySelectorAll('.lang-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      applyLang(btn.getAttribute('data-lang'));
    });
  });

  applyLang(getLang());
  initVideoFacade();
  fitDemoFrame();
  window.addEventListener('resize', fitDemoFrame);
  window.addEventListener('load', fitDemoFrame);
})();
