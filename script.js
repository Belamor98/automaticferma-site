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
      'hero.title': 'Мульти-ферма Roblox под <span class="amber">полным контролем</span>',
      'hero.lead': 'AutomaticFermaPro автоматизирует фарм десятка аккаунтов. Работает, пока вы спите.',
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
      'video.title': 'Смотри, как AutomaticFermaPro фармит Roblox — без детекта и банов.',
      'video.caption.title': 'preview Roblox Farm',
      'video.caption.sub': 'не детект метод · полный автоматик',
      'features.title': 'Что внутри',
      'features.sub': 'Каждый модуль включается тумблером — ферма собирается под вашу схему.',
      'feature.yummyauto.title': 'Console launcher',
      'feature.yummyauto.text': 'Центральное управление мульти-фермой: запуск, остановка и контроль всех окон из одного места.',
      'feature.smartswap.title': 'Smart-Swap',
      'feature.smartswap.text': 'Ротация пачек аккаунтов, гибкая настройка графика фарма.',
      'feature.placeid.title': 'Смена PlaceID',
      'feature.placeid.text': 'Переключение игры в рандомный момент, имитируя человеческое поведение.',
      'feature.antiafk.title': 'Anti-AFK',
      'feature.antiafk.text': 'Поочерёдно в каждом окне имитируется активность пользователя.',
      'feature.solver.title': 'Solver',
      'feature.solver.text': 'Автоматическое прохождение капчи.',
      'feature.ramboost.title': 'RAM Boost',
      'feature.ramboost.text': 'Контроль памяти, очистка от мусора — позволяет запустить максимальное количество окон.',
      'feature.watchdog.title': 'Watchdog',
      'feature.watchdog.text': 'Наблюдает за процессами и перезапускает упавшее. Ферма не останавливается из-за сбоя.',
      'feature.instsans.title': 'Instsans Control',
      'feature.instsans.text': 'Управление инстансами: аварийно перезапустит ферму, если количество окон снизится до минимального порога.',
      'feature.discord.title': 'Discord и Telegram',
      'feature.discord.text': 'Боты: мониторинг прогресса и удалённое управление фермой.',
      'feature.cookies.title': 'Cookie Manager',
      'feature.cookies.text': 'Проверка и глобализация куки, удобный менеджер позволяет быстро менять пачки аккаунтов.',
      'feature.zeropoint.title': 'ZeroPoint API',
      'feature.zeropoint.text': 'Интеграция с внешними сервисами.',
      'feature.volt.title': 'Полная совместимость с Volt',
      'feature.volt.text': 'Ферма и Volt работают как единое целое: автологин, контроль сессии и сброс HWID Volt — без ручных действий.',
      'security.title': 'Безопасность <span class="amber">по умолчанию</span>',
      'security.sub': 'Защита лицензий вынесена в нативный бинарник — секретов в JS нет.',
      'security.noforge.title': 'Защита от подделки',
      'security.noforge.text': 'Ключи невозможно подделать или сгенерировать самому — активация подтверждается сервером.',
      'security.hwid.title': 'Привязка к железу',
      'security.hwid.text': 'Ключ активируется на один HWID. Сброс возможен раз в сутки и подтверждается подписью.',
      'security.nocrack.title': 'Защита от взлома',
      'security.nocrack.text': 'Лицензия проверяется при каждом запуске: взломанные и пропатченные сборки не работают.',
      'security.careful.title': 'Аккуратный фарм',
      'security.careful.text': 'Человеческое поведение, ротация IP/MAC и умные паузы — ферма остаётся незаметной.',
      'faq.title': 'Частые вопросы',
      'faq.q1': 'Как получить доступ?',
      'faq.a1': 'Приложение активируется по ключам. Создайте тикет в Discord, чтобы получить ключ, введите его при первом запуске — лицензия привяжется к вашему ПК.',
      'faq.q2': 'Что делать при смене компьютера?',
      'faq.a2': 'В приложении есть сброс HWID — раз в сутки, с подтверждением подписью. Новая машина подхватит лицензию.',
      'faq.q4': 'Сколько окон можно держать?',
      'faq.a4': 'Ограничение — только ресурсы вашего ПК. RAM Boost и Watchdog помогают запустить на вашем устройстве максимальное количество окон.',
      'download.title': 'Готовы автоматизировать ферму?',
      'download.sub': 'Свяжитесь с нами, чтобы получить ключ и сборку для Windows.',
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
      'hero.title': 'Roblox multi-farm under <span class="amber">full control</span>',
      'hero.lead': 'AutomaticFermaPro automates farming of dozens of accounts. Works while you sleep.',
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
      'video.title': 'Watch AutomaticFermaPro farm Roblox — no detection, no bans.',
      'video.caption.title': 'preview Roblox Farm',
      'video.caption.sub': 'not detect method · full automatic',
      'features.title': "What's inside",
      'features.sub': 'Every module toggles on — build the farm to your scheme.',
      'feature.yummyauto.title': 'Console launcher',
      'feature.yummyauto.text': 'Central control of the multi-farm: start, stop and monitor all windows from one place.',
      'feature.smartswap.title': 'Smart-Swap',
      'feature.smartswap.text': 'Account pack rotation with a flexible farm schedule.',
      'feature.placeid.title': 'PlaceID swap',
      'feature.placeid.text': 'Switches the game at a random moment, mimicking human behavior.',
      'feature.antiafk.title': 'Anti-AFK',
      'feature.antiafk.text': 'User activity is emulated in each window, one by one.',
      'feature.solver.title': 'Solver',
      'feature.solver.text': 'Automatic captcha solving.',
      'feature.ramboost.title': 'RAM Boost',
      'feature.ramboost.text': 'Memory control and garbage cleanup — run the maximum number of windows.',
      'feature.watchdog.title': 'Watchdog',
      'feature.watchdog.text': 'Watches processes and restarts crashed ones. The farm doesn\'t stop on a failure.',
      'feature.instsans.title': 'Instsans Control',
      'feature.instsans.text': 'Instance management: emergency-restarts the farm if the window count drops below the minimum threshold.',
      'feature.discord.title': 'Discord & Telegram',
      'feature.discord.text': 'Bots: progress monitoring and remote farm control.',
      'feature.cookies.title': 'Cookie Manager',
      'feature.cookies.text': 'Cookie checking and globalization — a handy manager to swap account packs quickly.',
      'feature.zeropoint.title': 'ZeroPoint API',
      'feature.zeropoint.text': 'Integration with external services.',
      'feature.volt.title': 'Full Volt compatibility',
      'feature.volt.text': 'The farm and Volt work as a single whole: auto-login, session control and Volt HWID reset — no manual steps.',
      'security.title': 'Security <span class="amber">by default</span>',
      'security.sub': 'License protection lives in a native binary — no secrets in JS.',
      'security.noforge.title': 'Anti-forgery',
      'security.noforge.text': 'Keys can\'t be forged or self-generated — activation is confirmed by the server.',
      'security.hwid.title': 'Hardware binding',
      'security.hwid.text': 'A key activates on one HWID. Reset is possible once a day and confirmed by signature.',
      'security.nocrack.title': 'Crack protection',
      'security.nocrack.text': 'The license is verified on every launch: cracked and patched builds don\'t work.',
      'security.careful.title': 'Careful farming',
      'security.careful.text': 'Human-like behavior, IP/MAC rotation and smart pauses — the farm stays unnoticed.',
      'faq.title': 'FAQ',
      'faq.q1': 'How to get access?',
      'faq.a1': 'The app activates by keys. Create a ticket on Discord to get a key, enter it on first launch — the license binds to your PC.',
      'faq.q2': 'What if I change PC?',
      'faq.a2': 'The app has HWID reset — once a day, confirmed by signature. The new machine takes over the license.',
      'faq.q4': 'How many windows can I run?',
      'faq.a4': 'Limited only by your PC\'s resources. RAM Boost and Watchdog help you run the maximum number of windows on your machine.',
      'download.title': 'Ready to automate your farm?',
      'download.sub': 'Contact us to get a key and Windows build.',
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
