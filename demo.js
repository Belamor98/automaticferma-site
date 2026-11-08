(function () {
  'use strict';

  function q(sel, root) { return (root || document).querySelector(sel); }
  function qa(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  // ============================================================
  // 🍪 ДЕМО-ДАННЫЕ: 3 правдоподобные пачки куки со списками аккаунтов
  // Формат строки куки как в приложении: ник:пароль;ROBLOSECURITY=токен
  // ============================================================
  var COOKIE_PREFIX = '_.|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|';

  function makeToken(nick) {
    var alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var seed = 0;
    for (var i = 0; i < nick.length; i++) seed = (seed * 31 + nick.charCodeAt(i)) >>> 0;
    var out = '';
    for (var j = 0; j < 96; j++) {
      seed = (seed * 1103515245 + 12345) >>> 0;
      out += alphabet.charAt(seed % alphabet.length);
    }
    return out;
  }
  function makeCookieLine(nick) {
    return nick + ':Ferma' + (1000 + (makeToken(nick).charCodeAt(0) % 8999)) + ';' + COOKIE_PREFIX + makeToken(nick);
  }

  // state: alive | captcha | banned | locked | dead
  function acc(nick, state, opts) {
    opts = opts || {};
    return {
      nick: nick,
      state: state || 'alive',
      backup: opts.backup !== undefined ? opts.backup : (state === 'alive'),
      globalized: !!opts.globalized
    };
  }

  var DEMO_PACKS = {
    1: {
      note: '',
      checkBadge: '',
      accounts: [
        acc('xXShadowKnightXx', 'alive'),
        acc('BloxKing_777', 'alive'),
        acc('lil_bacon_gamer', 'alive'),
        acc('PixelPanda_YT', 'alive', { globalized: true }),
        acc('NoobSlayer2007', 'alive'),
        acc('DarkVenom_Pro', 'alive'),
        acc('Guest1337_RBLX', 'banned', { backup: false }),
        acc('SkyWarrior_Alex', 'alive'),
        acc('ToxicRainbow_99', 'captcha'),
        acc('MrBeast_Fan_228', 'alive'),
        acc('CheeseBurger_Cat', 'alive'),
        acc('ZeroTwo_Darling', 'alive')
      ]
    },
    2: {
      note: 'Основная пачка — не трогать, фармит 24/7',
      checkBadge: '',
      accounts: [
        acc('ProGamer_Rus', 'alive'),
        acc('BaconHair_2013', 'alive'),
        acc('LunaTheWolf_UwU', 'alive'),
        acc('TixCollector', 'dead', { backup: false }),
        acc('SwordFight_Master', 'alive'),
        acc('OofSound_Remix', 'locked'),
        acc('BuilderMan_Fan', 'alive'),
        acc('NeonDrift_Racer', 'alive')
      ]
    },
    3: {
      note: '',
      checkBadge: '',
      accounts: [
        acc('NeonNinja_X', 'alive'),
        acc('PotatoAim_God', 'alive'),
        acc('QueenBee_Vibes', 'alive'),
        acc('RobuxHunter_404', 'alive'),
        acc('SilentAssassin_R', 'captcha'),
        acc('MemeLord_YT', 'alive'),
        acc('CatGirl_Sakura', 'alive'),
        acc('EpicJailbreak', 'banned', { backup: false }),
        acc('GhostFace_Killa', 'alive'),
        acc('SpeedRun_Isekai', 'alive'),
        acc('AnimeProfile_Pic', 'captcha'),
        acc('LagSwitch_Pro', 'alive'),
        acc('DefaultDan_2006', 'alive'),
        acc('VoltEnergy_Drink', 'alive'),
        acc('BakonHairReturn', 'alive')
      ]
    }
  };

  var selectedPackId = 1;
  var licenseValid = false;
  var nextPackId = 4;

  function packCount(id) { return (DEMO_PACKS[id] ? DEMO_PACKS[id].accounts.length : 0); }
  function packCookieLines(id) {
    return (DEMO_PACKS[id] ? DEMO_PACKS[id].accounts : []).map(function (a) { return makeCookieLine(a.nick); });
  }

  // ---------- Tabs gear menu fill ----------
  var DEMO_TABS = [
    { id: 'start', label: 'Start' },
    { id: 'software', label: 'SoftWare' },
    { id: 'webhook', label: 'WebHook' },
    { id: 'yummy', label: 'Console Launcher' },
    { id: 'console', label: 'Console' },
    { id: 'solver', label: 'Solver', locked: true },
    { id: 'cookiechecker', label: 'Cookie Checker', locked: true }
  ];
  var hiddenTabs = {};
  function applyHiddenTabs() {
    DEMO_TABS.forEach(function (t) {
      var btn = document.getElementById('menu-btn-' + t.id);
      var content = document.getElementById('block-' + t.id);
      var hidden = !!hiddenTabs[t.id];
      if (btn) btn.style.display = hidden ? 'none' : '';
      if (content) content.style.display = hidden ? 'none' : '';
    });
    var activeBtn = document.querySelector('.tab-btn.active');
    if (activeBtn && activeBtn.style.display === 'none') {
      var first = null, i;
      for (i = 0; i < DEMO_TABS.length; i++) {
        if (!hiddenTabs[DEMO_TABS[i].id]) { first = DEMO_TABS[i]; break; }
      }
      if (first) {
        var fb = document.getElementById('menu-btn-' + first.id);
        if (fb) fb.click();
      }
    }
  }
  function initTabsGearMenu() {
    var menu = document.getElementById('tabs-gear-menu');
    if (!menu) return;
    menu.innerHTML =
      '<div class="gear-header"><span class="gear-title">Видимые вкладки</span><button class="gear-close" type="button">✕</button></div>';
    DEMO_TABS.forEach(function (t) {
      var lbl = document.createElement('label');
      var cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.checked = !hiddenTabs[t.id];
      if (t.locked) {
        cb.disabled = true;
        cb.style.opacity = '0.45';
        cb.style.cursor = 'not-allowed';
        lbl.title = 'Платная функция — в приложении доступна с лицензией Unlimited';
      }
      cb.addEventListener('change', function () {
        hiddenTabs[t.id] = !cb.checked;
        applyHiddenTabs();
        log('Вкладка ' + t.label + ': ' + (cb.checked ? 'показана' : 'скрыта'));
      });
      lbl.appendChild(cb);
      lbl.appendChild(document.createTextNode(' ' + t.label + (t.locked ? ' 🔒' : '')));
      menu.appendChild(lbl);
    });
    var closeBtn = menu.querySelector('.gear-close');
    if (closeBtn) closeBtn.addEventListener('click', function (e) { e.stopPropagation(); menu.style.display = 'none'; });
    document.addEventListener('click', function (e) {
      var gearBtn = document.getElementById('tabs-gear-btn');
      if (!menu.contains(e.target) && e.target !== gearBtn) menu.style.display = 'none';
    });
    applyHiddenTabs();
  }

  // ---------- Universal close buttons ----------
  function initCloseButtons() {
    qa('button').forEach(function (btn) {
      var txt = (btn.textContent || '').trim();
      if (txt !== '✕' && txt !== '×') return;
      btn.addEventListener('click', function () {
        var overlay = btn.closest('.settings-modal-overlay, .modal-overlay, .discord-settings-modal-overlay, .telegram-modal-overlay, .cookie-input-overlay');
        if (overlay) { overlay.style.display = 'none'; overlay.classList.remove('active'); return; }
        var cm = document.getElementById('cookieModal');
        if (cm && cm.style.display !== 'none') { cm.style.display = 'none'; return; }
      });
    });
  }
  function initTabs() {
    qa('.tab-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.id || '';
        var key = id.replace('menu-btn-', '');
        var block = document.getElementById('block-' + key);
        if (!block) return;
        qa('.tab-btn').forEach(function (b) { b.classList.remove('active'); });
        qa('.tab-content').forEach(function (c) { c.classList.remove('active'); });
        btn.classList.add('active');
        block.classList.add('active');
        log('Переключено на вкладку: ' + (btn.textContent || key).trim());
      });
    });
  }

  // ---------- Toggles ----------
  function initToggles() {
    qa('.cleaner-toggle').forEach(function (el) {
      el.addEventListener('click', function () {
        el.classList.toggle('on');
        log('Тумблер ' + (el.id || '') + ': ' + (el.classList.contains('on') ? 'ON' : 'OFF'));
      });
    });

    qa('.mod-btn').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        if (e.target && e.target.classList && e.target.classList.contains('mod-gear')) return;
        if (btn.id === 'btn-spoofer') return; // удержание 5 сек — своя логика
        if (btn.id === 'cl-arrange') { log('Окна отсортированы (демо)'); return; }
        var off = btn.classList.contains('mod-btn-off');
        btn.classList.toggle('mod-btn-off', !off);
        btn.classList.toggle('mod-btn-on', off);
        var state = btn.querySelector('.mod-state');
        if (state) state.textContent = off ? 'On' : 'Off';
        log('Модуль ' + (btn.querySelector('.mod-label') ? btn.querySelector('.mod-label').textContent.trim() : btn.id) + ': ' + (off ? 'ON' : 'OFF'));
      });
    });

    qa('.discord-subtab').forEach(function (btn) {
      btn.addEventListener('click', function () {
        qa('.discord-subtab').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var f = btn.getAttribute('data-filter');
        qa('.discord-tab-content').forEach(function (c) { c.classList.remove('active'); });
        var target = document.getElementById('discord-tab-' + f);
        if (target) target.classList.add('active');
      });
    });
  }

  // ---------- Gears / modals ----------
  function openModal(id) {
    var modal = document.getElementById(id);
    if (modal) { modal.style.display = 'flex'; modal.classList.add('active'); log('Открыто окно: ' + id); }
  }
  function closeModal(id) {
    var modal = document.getElementById(id);
    if (modal) { modal.style.display = 'none'; modal.classList.remove('active'); }
  }
  function initGears() {
    var gearMap = {
      'gear-antiafk': 'antiafk-modal-overlay',
      'gear-ramboost': 'ramboost-modal-overlay',
      'gear-voltauth': 'voltauth-modal-overlay',
      'gear-farmtimer': 'farmtimer-modal-overlay',
      'gear-telegram': 'telegram-modal-overlay',
      'btn-start-gear': 'start-settings-modal-overlay',
      'btn-stop-gear': 'stop-settings-modal-overlay',
      'cl-gear': 'cl-settings-modal-overlay',
      'discord-gear-btn': 'discord-settings-modal',
      'btn-zeropoint': 'zeropoint-modal-overlay'
    };
    Object.keys(gearMap).forEach(function (gid) {
      var el = document.getElementById(gid);
      if (el) el.addEventListener('click', function (e) { e.stopPropagation(); openModal(gearMap[gid]); });
    });
    var tabsGear = document.getElementById('tabs-gear-btn');
    var tabsMenu = document.getElementById('tabs-gear-menu');
    if (tabsGear && tabsMenu) {
      tabsGear.addEventListener('click', function (e) {
        e.stopPropagation();
        tabsMenu.style.display = tabsMenu.style.display === 'none' ? 'block' : 'none';
      });
    }
    var ccSettings = document.getElementById('btnCcSettings');
    var ccPanel = document.getElementById('ccSettingsPanel');
    if (ccSettings && ccPanel) {
      ccSettings.addEventListener('click', function (e) {
        e.stopPropagation();
        ccPanel.style.display = ccPanel.style.display === 'none' ? 'block' : 'none';
      });
    }

    qa('.settings-modal-overlay').forEach(function (ov) {
      ov.addEventListener('click', function (e) {
        if (e.target === ov) ov.style.display = 'none';
      });
      qa('.settings-modal-close', ov).forEach(function (b) {
        b.addEventListener('click', function () { ov.style.display = 'none'; });
      });
    });
    // Бэкдроп-закрытие для оверлеев вне .settings-modal-overlay
    ['telegram-modal-overlay', 'discord-settings-modal', 'cookie-modal-overlay'].forEach(function (id) {
      var ov = document.getElementById(id);
      if (ov) ov.addEventListener('click', function (e) { if (e.target === ov) closeModal(id); });
    });

    // Кнопки-подтверждения: закрыть окно + запись в консоль (как «сохранение»)
    var confirmMap = {
      'farmtimer-modal-confirm': '✅ Настройки FarmTimer подтверждены',
      'voltauth-modal-save': '🔐 Данные входа Volt сохранены',
      'ramboost-modal-confirm': '💾 Настройки RAM Boost сохранены',
      'antiafk-modal-confirm': '💾 Настройки Anti-AFK сохранены',
      'stop-modal-save': '💾 Настройки остановки сохранены',
      'telegram-modal-save': '💾 Настройки Telegram сохранены',
      'discord-settings-save': '💾 Настройки Discord сохранены',
      'zeropoint-save': '🔑 ZeroPoint: API-ключи сохранены',
      'cl-settings-modal-confirm': '💾 Настройки лаунчера сохранены',
      'packcheck-done': null,
      'driver-install-cancel': null,
      'confirm-delete-pack-cancel': null,
      'confirm-clear-backups-cancel': null,
      'cookie-reset-cancel': null
    };
    Object.keys(confirmMap).forEach(function (bid) {
      var el = document.getElementById(bid);
      if (!el) return;
      el.addEventListener('click', function () {
        var ov = el.closest('.settings-modal-overlay, .modal-overlay');
        if (ov) ov.style.display = 'none';
        if (confirmMap[bid]) log(confirmMap[bid]);
      });
    });
  }

  // ---------- Cookie input modal (добавление/редактирование пачки, заметки) ----------
  var cookieModalMode = 'add';   // add | edit | note
  var editPackId = null;
  var pendingCookieReset = null;

  function syncLineNumbers(textarea, numbersEl) {
    if (!textarea || !numbersEl) return;
    var lines = textarea.value.split('\n').length;
    var out = [];
    for (var i = 1; i <= lines; i++) out.push(i);
    numbersEl.textContent = out.join('\n');
    numbersEl.scrollTop = textarea.scrollTop;
  }
  function initCookieInputModal() {
    var overlay = document.getElementById('cookie-modal-overlay');
    var ta = document.getElementById('textarea-cookie-raw');
    var pa = document.getElementById('textarea-proxy-raw');
    var taNum = document.getElementById('cookie-line-numbers');
    var paNum = document.getElementById('proxy-line-numbers');
    if (!overlay || !ta) return;

    ta.addEventListener('input', function () { syncLineNumbers(ta, taNum); });
    ta.addEventListener('scroll', function () { if (taNum) taNum.scrollTop = ta.scrollTop; });
    if (pa) {
      pa.addEventListener('input', function () { syncLineNumbers(pa, paNum); });
      pa.addEventListener('scroll', function () { if (paNum) paNum.scrollTop = pa.scrollTop; });
    }

    var closeBtn = document.getElementById('btn-modal-close');
    if (closeBtn) closeBtn.addEventListener('click', function () { closeModal('cookie-modal-overlay'); });

    var saveBtn = document.getElementById('btn-modal-save-pack');
    if (saveBtn) saveBtn.addEventListener('click', function () {
      if (cookieModalMode === 'note') {
        if (editPackId && DEMO_PACKS[editPackId]) {
          DEMO_PACKS[editPackId].note = ta.value.trim();
          renderPacks();
          log('📝 Заметка для пачки #' + editPackId + ' сохранена');
        }
        closeModal('cookie-modal-overlay');
        return;
      }
      var lines = ta.value.split(/\r?\n/).map(function (s) { return s.trim(); }).filter(function (s) { return s && s.charAt(0) !== '#'; });
      if (lines.length === 0) { log('⚠️ Вставьте куки — по одной на строку'); return; }
      if (cookieModalMode === 'add') {
        var id = nextPackId++;
        DEMO_PACKS[id] = {
          note: '',
          checkBadge: '',
          accounts: lines.map(function (line) {
            var nick = line.indexOf(':') > -1 ? line.slice(0, line.indexOf(':')).trim() : line.slice(0, 20);
            return acc(nick || 'unknown', 'alive');
          })
        };
        renderPacks();
        selectPack(id, true);
        log('💾 Pack' + id + '.txt обновлен (+' + lines.length + ' куки)');
      } else if (cookieModalMode === 'edit' && editPackId && DEMO_PACKS[editPackId]) {
        var newNicks = [];
        var seen = {};
        lines.forEach(function (line) {
          var nick = line.indexOf(':') > -1 ? line.slice(0, line.indexOf(':')).trim() : line.slice(0, 20);
          if (nick && !seen[nick.toLowerCase()]) { seen[nick.toLowerCase()] = true; newNicks.push(nick); }
        });
        var oldNicks = DEMO_PACKS[editPackId].accounts.map(function (a) { return a.nick.toLowerCase(); });
        var overlap = newNicks.filter(function (n) { return oldNicks.indexOf(n.toLowerCase()) !== -1; }).length;
        var apply = function () {
          DEMO_PACKS[editPackId].accounts = newNicks.map(function (n) { return acc(n, 'alive'); });
          DEMO_PACKS[editPackId].checkBadge = '';
          renderPacks();
          if (selectedPackId === editPackId) renderAccounts();
          log('💾 Pack' + editPackId + '.txt обновлен (' + newNicks.length + ' куки)');
        };
        if (overlap === 0 && oldNicks.length > 0) {
          var txt = document.getElementById('cookie-reset-text');
          if (txt) txt.textContent = 'Вы полностью меняете состав куки (нет ни одного совпадения) — это сбросит прогресс пачки #' + editPackId + '\n\nПродолжить?';
          pendingCookieReset = apply;
          closeModal('cookie-modal-overlay');
          openModal('cookie-reset-overlay');
          return;
        }
        apply();
      }
      closeModal('cookie-modal-overlay');
    });
  }
  function openCookieModalForAdd() {
    cookieModalMode = 'add';
    editPackId = null;
    var card = q('#cookie-modal-overlay .cookie-modal-card');
    var title = document.getElementById('modal-title');
    var ta = document.getElementById('textarea-cookie-raw');
    var pa = document.getElementById('textarea-proxy-raw');
    if (card) { card.classList.add('cookie-mode'); card.classList.remove('note-mode'); }
    if (title) title.textContent = 'Ввод данных для Cookie';
    if (ta) { ta.value = ''; syncLineNumbers(ta, document.getElementById('cookie-line-numbers')); }
    if (pa) { pa.value = ''; syncLineNumbers(pa, document.getElementById('proxy-line-numbers')); }
    openModal('cookie-modal-overlay');
  }
  function openCookieModalForEdit(packId) {
    cookieModalMode = 'edit';
    editPackId = packId;
    var card = q('#cookie-modal-overlay .cookie-modal-card');
    var title = document.getElementById('modal-title');
    var ta = document.getElementById('textarea-cookie-raw');
    var pa = document.getElementById('textarea-proxy-raw');
    if (card) { card.classList.add('cookie-mode'); card.classList.remove('note-mode'); }
    if (title) title.textContent = 'Редактирование Пачки #' + packId;
    if (ta) {
      ta.value = packCookieLines(packId).join('\n');
      syncLineNumbers(ta, document.getElementById('cookie-line-numbers'));
    }
    if (pa) {
      var proxyLines = [];
      for (var i = 0; i < packCount(packId); i++) proxyLines.push(i % 3 === 0 ? 'residential-' + (i + 1) + '.proxifly.net:8000:user' + (i + 1) + ':pass' + (i + 1) : '');
      pa.value = proxyLines.join('\n');
      syncLineNumbers(pa, document.getElementById('proxy-line-numbers'));
    }
    openModal('cookie-modal-overlay');
  }
  function openNoteModal(packId) {
    cookieModalMode = 'note';
    editPackId = packId;
    var card = q('#cookie-modal-overlay .cookie-modal-card');
    var title = document.getElementById('modal-title');
    var ta = document.getElementById('textarea-cookie-raw');
    if (card) { card.classList.add('note-mode'); card.classList.remove('cookie-mode'); }
    if (title) title.textContent = '📝 Заметка для пачки #' + packId;
    if (ta) ta.value = (DEMO_PACKS[packId] && DEMO_PACKS[packId].note) || '';
    openModal('cookie-modal-overlay');
  }

  // ---------- Отрисовка пачек / аккаунтов / очереди (как в приложении) ----------
  var farmRunning = false;
  var farmStartTime = '';
  var farmFinishedTime = '';
  function nowHM() { return new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }); }

  function renderQueue() {
    var queue = document.getElementById('queue-packs-container');
    if (!queue) return;
    var ids = Object.keys(DEMO_PACKS).map(Number).sort(function (a, b) { return a - b; });
    if (ids.length === 0) {
      queue.innerHTML = '<div class="queue-empty-msg">Добавьте пачки куки, чтобы увидеть queue</div>';
      return;
    }
    var html = '';
    ids.forEach(function (id, idx) {
      var rowClass = 'queue-row';
      var statusText = 'В очереди';
      if (farmRunning && idx === 0) {
        rowClass = 'queue-row current-farming';
        statusText = 'Старт ' + farmStartTime + ' 🟢 Фармит';
      } else if (!farmRunning && idx === 0 && farmFinishedTime) {
        statusText = '✅ Закончил ' + farmFinishedTime;
      }
      html += '<div class="' + rowClass + '">' +
        '<span class="q-pack-name">🍪 Cookie #' + id + '</span>' +
        '<span class="q-pack-total">4.0h</span>' +
        '<span class="q-pack-status">' + statusText + '</span>' +
        '</div>';
    });
    queue.innerHTML = html;
  }

  function renderPacks() {
    var list = document.getElementById('cookie-packs-list');
    if (!list) return;
    list.innerHTML = '';
    var ids = Object.keys(DEMO_PACKS).map(Number).sort(function (a, b) { return a - b; });
    if (ids.length === 0) {
      list.innerHTML = '<div class="cookie-empty-msg">📭 Нет добавленных пачек</div>';
      renderQueue();
      return;
    }
    ids.forEach(function (id) {
      var pack = DEMO_PACKS[id];
      var count = pack.accounts.length;
      var hasNote = pack.note ? 'has-note' : '';
      var noteLabel = '';
      if (pack.note) {
        var raw = String(pack.note).replace(/\s+/g, ' ').trim();
        noteLabel = raw.length > 40 ? raw.slice(0, 40) + '…' : raw;
        noteLabel = noteLabel.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
      }
      var item = document.createElement('div');
      item.className = 'cookie-pack-item ' + hasNote + (id === selectedPackId ? ' active' : '');
      item.id = 'cookie-pack-' + id;
      item.style.cursor = 'pointer';
      item.innerHTML =
        '<span class="pack-name">' +
          '🍪 Cookie #' + id + ' ' +
          '<span class="pack-count-badge">' + count + ' акк.</span>' +
          (pack.note ? '<span class="pack-note-icon" data-tooltip="' + noteLabel + '">' + noteLabel + '</span>' : '') +
          '<span class="pack-check-badge" id="pack-check-badge-' + id + '">' + (pack.checkBadge || '') + '</span>' +
        '</span>' +
        '<div style="display:flex; gap:6px;">' +
          '<button class="btn-check-pack" data-pack-id="' + id + '" data-tooltip="Проверить куки на ZeroPoint">🔎</button>' +
          '<button class="btn-note-pack" data-pack-id="' + id + '" data-tooltip="Добавить заметку">📝</button>' +
          '<button class="btn-edit-pack-gear" data-pack-id="' + id + '" data-tooltip="Изменить список куки">⚙</button>' +
          '<button class="btn-delete-pack-cross" data-pack-id="' + id + '" data-tooltip="Удалить пачку">×</button>' +
        '</div>';
      item.addEventListener('click', function () { selectPack(id, false); });
      list.appendChild(item);

      item.querySelector('.btn-check-pack').addEventListener('click', function (e) {
        e.stopPropagation();
        runPackCheck(parseInt(this.getAttribute('data-pack-id'), 10), this);
      });
      item.querySelector('.btn-note-pack').addEventListener('click', function (e) {
        e.stopPropagation();
        openNoteModal(parseInt(this.getAttribute('data-pack-id'), 10));
      });
      item.querySelector('.btn-edit-pack-gear').addEventListener('click', function (e) {
        e.stopPropagation();
        openCookieModalForEdit(parseInt(this.getAttribute('data-pack-id'), 10));
      });
      item.querySelector('.btn-delete-pack-cross').addEventListener('click', function (e) {
        e.stopPropagation();
        askDeletePack(parseInt(this.getAttribute('data-pack-id'), 10));
      });
    });
    renderQueue();
  }

  function selectPack(id, silent) {
    selectedPackId = id;
    qa('.cookie-pack-item').forEach(function (x) { x.classList.remove('active'); });
    var el = document.getElementById('cookie-pack-' + id);
    if (el) el.classList.add('active');
    var idEl = document.getElementById('accounts-pack-id');
    if (idEl) idEl.textContent = id;
    renderAccounts();
    if (!silent) log('Выбрана пачка: Cookie #' + id);
  }

  var GLOBALIZED_SVG = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
    '<circle cx="10" cy="10" r="7" stroke="#4ade80" stroke-width="1.8"/>' +
    '<path d="M3 10h14" stroke="#4ade80" stroke-width="1.3"/>' +
    '<path d="M10 3c2.6 2.1 2.6 11.9 0 14M10 3c-2.6 2.1-2.6 11.9 0 14" stroke="#4ade80" stroke-width="1.3"/>' +
    '<circle cx="17" cy="17" r="6" fill="#0f172a" stroke="#4ade80" stroke-width="1.8"/>' +
    '<path d="M14.4 17.1l1.9 1.9 3.3-3.9" stroke="#4ade80" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>' +
    '</svg>';

  function renderAccounts() {
    var container = document.getElementById('accounts-list-container');
    if (!container) return;
    var pack = DEMO_PACKS[selectedPackId];
    if (!pack || pack.accounts.length === 0) {
      container.innerHTML = '<div class="queue-empty-msg">Нет данных</div>';
      return;
    }
    container.innerHTML = '';
    pack.accounts.forEach(function (a, idx) {
      var isBlocked = a.state === 'banned';
      var isCaptcha = a.state === 'captcha';
      var isLocked = a.state === 'locked';
      var isCookieDead = a.state === 'dead';
      var row = document.createElement('div');
      row.className = 'account-row' + (a.state === 'alive' ? ' alive' : '') +
        (isBlocked ? ' blocked-account' : '') + (isCaptcha ? ' captcha-account' : '') +
        (isLocked ? ' locked-account' : '') + (isCookieDead ? ' cookie-dead-account' : '');
      if (isBlocked || isCookieDead) {
        row.style.cssText = 'opacity:0.45;background:rgba(248,113,113,0.08);';
      } else if (isCaptcha || isLocked) {
        row.style.cssText = 'opacity:0.5;background:rgba(251,191,36,0.10);';
      }
      var num = document.createElement('span');
      num.className = 'acc-num';
      num.textContent = (idx + 1) + '.';
      row.appendChild(num);

      var name = document.createElement('span');
      name.className = 'acc-name';
      name.textContent = a.nick;
      if (isBlocked || isCookieDead) name.style.color = '#f87171';
      if (isCookieDead) {
        var bd = document.createElement('span');
        bd.className = 'acc-badge cookie-dead';
        bd.textContent = 'AUTHFAIL';
        row.appendChild(bd);
      } else if (isBlocked) {
        var bb = document.createElement('span');
        bb.className = 'acc-badge banned';
        bb.textContent = 'AUTHFAIL';
        row.appendChild(bb);
      }
      if (isCaptcha) {
        var bc = document.createElement('span');
        bc.className = 'acc-badge captcha';
        bc.textContent = 'captcha';
        row.appendChild(bc);
      }
      if (isLocked) {
        var bl = document.createElement('span');
        bl.className = 'acc-badge locked';
        bl.textContent = 'account lock';
        row.appendChild(bl);
      }
      if (a.backup) {
        var bk = document.createElement('span');
        if (a.globalized) {
          bk.style.cssText = 'display:inline-flex;align-items:center;margin-left:4px;vertical-align:-2px;';
          bk.innerHTML = GLOBALIZED_SVG;
          bk.setAttribute('data-tooltip', 'бэкап глобализирован (свежая кука через auth-ticket)');
        } else {
          bk.textContent = '✓';
          bk.style.cssText = 'color:#4ade80;font-size:12px;font-weight:700;margin-left:4px;';
          bk.setAttribute('data-tooltip', 'бэкап куки существует, и валиден');
        }
        name.appendChild(bk);
      }
      name.title = 'Нажми — скопировать куку';
      name.addEventListener('click', function () {
        try { navigator.clipboard.writeText(makeCookieLine(a.nick)); } catch (err) {}
        log('Скопировано куки: ' + a.nick);
      });
      row.appendChild(name);

      var status = document.createElement('span');
      status.className = 'acc-status';
      status.textContent = a.state === 'alive' ? 'Alive' : '';
      row.appendChild(status);

      var launch = document.createElement('button');
      launch.className = 'acc-launch-btn';
      launch.textContent = '🚀';
      launch.setAttribute('data-tooltip', 'лаунч');
      launch.addEventListener('click', function (e) {
        e.stopPropagation();
        if (!licenseValid) { log('⛔ Лаунч доступен только с активной лицензией'); return; }
        log('🚀 Лаунч: ' + a.nick + ' (демо)');
      });
      row.appendChild(launch);

      var del = document.createElement('button');
      del.className = 'acc-delete-btn';
      del.textContent = '×';
      del.setAttribute('data-tooltip', 'Удалить куки');
      del.addEventListener('click', function (e) {
        e.stopPropagation();
        var i = DEMO_PACKS[selectedPackId].accounts.indexOf(a);
        if (i > -1) DEMO_PACKS[selectedPackId].accounts.splice(i, 1);
        renderPacks();
        renderAccounts();
        log('🗑️ Куки удалены: ' + a.nick);
      });
      row.appendChild(del);
      container.appendChild(row);
    });
  }

  // ---------- Удаление пачки / бэкапов (подтверждения) ----------
  var pendingDeletePackId = null;
  function askDeletePack(packId) {
    pendingDeletePackId = packId;
    var txt = document.getElementById('confirm-delete-pack-text');
    if (txt) txt.textContent = 'Удалить пачку #' + packId + '? Куки, заметка и данные пачки будут удалены безвозвратно.';
    openModal('confirm-delete-pack-overlay');
  }
  function initPackConfirms() {
    var yes = document.getElementById('confirm-delete-pack-yes');
    if (yes) yes.addEventListener('click', function () {
      if (pendingDeletePackId && DEMO_PACKS[pendingDeletePackId]) {
        delete DEMO_PACKS[pendingDeletePackId];
        log('🗑️ Пачка #' + pendingDeletePackId + ' удалена');
        if (selectedPackId === pendingDeletePackId) {
          selectedPackId = null;
          var idEl = document.getElementById('accounts-pack-id');
          if (idEl) idEl.textContent = '—';
          var cont = document.getElementById('accounts-list-container');
          if (cont) cont.innerHTML = '<div class="queue-empty-msg">Нет данных</div>';
        }
        renderPacks();
      }
      pendingDeletePackId = null;
      closeModal('confirm-delete-pack-overlay');
    });
    var backupsYes = document.getElementById('confirm-clear-backups-yes');
    if (backupsYes) backupsYes.addEventListener('click', function () {
      if (selectedPackId && DEMO_PACKS[selectedPackId]) {
        var removed = 0;
        DEMO_PACKS[selectedPackId].accounts.forEach(function (a) {
          if (a.backup) { a.backup = false; removed++; }
        });
        renderAccounts();
        log('Бэкап куки удалён для пачки #' + selectedPackId + ' (' + removed + ' из ' + DEMO_PACKS[selectedPackId].accounts.length + ' акк.)');
      }
      closeModal('confirm-clear-backups-overlay');
    });
    var resetYes = document.getElementById('cookie-reset-yes');
    if (resetYes) resetYes.addEventListener('click', function () {
      if (pendingCookieReset) { pendingCookieReset(); pendingCookieReset = null; }
      closeModal('cookie-reset-overlay');
    });
    var backupsBtn = document.getElementById('btn-clear-cookie-backups');
    if (backupsBtn) backupsBtn.addEventListener('click', function () {
      if (!selectedPackId) { log('пачка не выбрана'); return; }
      openModal('confirm-clear-backups-overlay');
    });
  }

  // ---------- Проверка пачки (ZeroPoint) — анимация как в приложении ----------
  var packCheckTimer = null;
  function runPackCheck(packId, btnEl) {
    if (!DEMO_PACKS[packId]) return;
    if (packCheckTimer) return;
    if (btnEl) { btnEl.disabled = true; btnEl.textContent = '⏳'; }
    var badge = document.getElementById('pack-check-badge-' + packId);
    if (badge) badge.textContent = '⏳';

    var title = document.getElementById('packcheck-title');
    if (title) title.textContent = '🔎 ПРОВЕРКА ПАЧКИ #' + packId;
    var phaseEl = document.getElementById('packcheck-phase');
    var countEl = document.getElementById('packcheck-count');
    var bar = document.getElementById('packcheck-bar');
    var pct = document.getElementById('packcheck-pct');
    var statusEl = document.getElementById('packcheck-status');
    var actions = document.getElementById('packcheck-actions');
    var solve = document.getElementById('packcheck-solve');
    var copyFresh = document.getElementById('pc-copy-fresh');
    var cells = { alive: q('#pc-alive'), dead: q('#pc-dead'), face: q('#pc-face'), captcha: q('#pc-captcha'), ban: q('#pc-ban') };
    var btns = { captcha: q('#pc-act-captcha'), face: q('#pc-act-face'), dead: q('#pc-act-dead') };
    Object.keys(cells).forEach(function (k) { if (cells[k]) cells[k].textContent = '0'; });
    Object.keys(btns).forEach(function (k) { if (btns[k]) btns[k].disabled = true; });
    if (actions) actions.style.display = 'none';
    if (solve) solve.innerHTML = '';
    if (copyFresh) copyFresh.style.display = 'none';
    if (statusEl) statusEl.textContent = '';
    openModal('packcheck-modal-overlay');
    log('🔎 Проверка пачки #' + packId + ' отправлена на ZeroPoint');

    var accounts = DEMO_PACKS[packId].accounts;
    var total = accounts.length;
    var done = 0;
    var counts = { alive: 0, dead: 0, face: 0, captcha: 0, ban: 0 };
    var phases = ['Отправка...', 'В очереди...', 'Проверка...'];
    var phaseIdx = 0;
    if (phaseEl) phaseEl.textContent = phases[0];

    packCheckTimer = setInterval(function () {
      if (phaseIdx < phases.length - 1 && done === 0 && Math.random() < 0.3) {
        phaseIdx++;
        if (phaseEl) phaseEl.textContent = phases[phaseIdx];
      }
      if (done < total) {
        var a = accounts[done];
        var key = a.state === 'alive' ? 'alive' : a.state === 'dead' ? 'dead' : a.state === 'locked' ? 'face' : a.state === 'captcha' ? 'captcha' : 'ban';
        counts[key]++;
        done++;
        Object.keys(counts).forEach(function (k) { if (cells[k]) cells[k].textContent = String(counts[k]); });
        var pctVal = Math.round(done / total * 100);
        if (bar) bar.style.width = pctVal + '%';
        if (pct) pct.textContent = pctVal + '%';
        if (countEl) countEl.textContent = done + ' / ' + total;
        if (done >= total) {
          clearInterval(packCheckTimer);
          packCheckTimer = null;
          if (phaseEl) phaseEl.textContent = '✅ Проверка завершена';
          if (statusEl) statusEl.textContent = counts.alive === total ? '✅ Пачка полностью живая (' + total + ') — ничего делать не нужно' : 'Готово: ' + counts.alive + ' живых, проблемных: ' + (total - counts.alive);
          if (btns.captcha) btns.captcha.disabled = counts.captcha === 0;
          if (btns.face) btns.face.disabled = counts.face === 0;
          if (btns.dead) btns.dead.disabled = counts.dead === 0;
          if (actions) actions.style.display = 'flex';
          if (copyFresh) copyFresh.style.display = counts.dead > 0 ? 'block' : 'none';
          var packBadge = document.getElementById('pack-check-badge-' + packId);
          if (packBadge) packBadge.textContent = counts.alive === total ? '✅' : '⚠️';
          if (DEMO_PACKS[packId]) DEMO_PACKS[packId].checkBadge = counts.alive === total ? '✅' : '⚠️';
          if (btnEl) { btnEl.disabled = false; btnEl.textContent = '🔎'; }
          log('✅ Проверка пачки #' + packId + ' завершена: alive ' + counts.alive + ' / ' + total);
        }
      }
    }, 260);
  }
  function initPackCheckActions() {
    var actMap = {
      'pc-act-captcha': '🧩 CaptchaLock отправлены в ZeroSolver (демо)',
      'pc-act-face': '🧑 FaceLock отправлены на FaceUnlock (демо)',
      'pc-act-dead': '🍪 Запрошены свежие куки для CookieDead (демо)'
    };
    Object.keys(actMap).forEach(function (bid) {
      var el = document.getElementById(bid);
      if (el) el.addEventListener('click', function () {
        var solve = document.getElementById('packcheck-solve');
        if (solve) {
          var line = document.createElement('div');
          line.className = 'log-entry';
          line.innerHTML = '<span class="log-time">[zp]</span> ' + actMap[bid];
          solve.appendChild(line);
        }
        log(actMap[bid]);
      });
    });
    var copyFresh = document.getElementById('pc-copy-fresh');
    if (copyFresh) copyFresh.addEventListener('click', function () {
      log('📋 Свежие куки скопированы в буфер (демо)');
    });
  }

  // ---------- Manual toggle / cookie modal (Cookie Checker) ----------
  function initManual() {
    var manualToggle = document.getElementById('btn-toggle-manual');
    if (manualToggle) {
      manualToggle.addEventListener('click', function () {
        manualToggle.classList.toggle('on');
        log('🛡️ Manual режим ' + (manualToggle.classList.contains('on') ? 'включен' : 'выключен'));
      });
    }
    var openCookies = document.getElementById('btnOpenCookies');
    var cookieModal = document.getElementById('cookieModal');
    if (openCookies && cookieModal) {
      openCookies.addEventListener('click', function () { cookieModal.style.display = 'flex'; });
    }
    var closeCookie = document.getElementById('btnCloseModal');
    if (closeCookie && cookieModal) closeCookie.addEventListener('click', function () { cookieModal.style.display = 'none'; });
    var cancelCookie = document.getElementById('btnCancelModal');
    if (cancelCookie && cookieModal) cancelCookie.addEventListener('click', function () { cookieModal.style.display = 'none'; });

    var addPack = document.getElementById('btn-add-pack');
    if (addPack) addPack.addEventListener('click', openCookieModalForAdd);

    var modalStart = document.getElementById('btnModalStart');
    if (modalStart) modalStart.addEventListener('click', function () {
      var ta = document.getElementById('cookieInput');
      if (cookieModal) cookieModal.style.display = 'none';
      var lines = (ta && ta.value ? ta.value : '').split(/\r?\n/).map(function (s) { return s.trim(); }).filter(Boolean);
      if (lines.length === 0) {
        lines = ['xXShadowKnightXx', 'BloxKing_777', 'lil_bacon_gamer', 'NoobSlayer2007', 'TixCollector', 'OofSound_Remix', 'EpicJailbreak', 'ToxicRainbow_99']
          .map(function (n) { return makeCookieLine(n); });
        if (ta) ta.value = lines.join('\n');
        log('Подставлены демо-куки (8 шт)');
      }
      log('Куки отправлены на проверку (' + lines.length + ' шт)');
      runCheckerSimulation(lines);
    });
    var clearCookies = document.getElementById('btnClearCookies');
    if (clearCookies) {
      clearCookies.addEventListener('click', function () {
        var ta = document.getElementById('cookieInput');
        if (ta) ta.value = '';
        log('Список куки очищен');
      });
    }
    var manualCookieBtn = document.getElementById('btn-manual-cookie');
    if (manualCookieBtn && cookieModal) {
      manualCookieBtn.addEventListener('click', function () { cookieModal.style.display = 'flex'; });
    }
  }

  // ---------- Start/Stop ----------
  function initStartStop() {
    var startBtn = document.getElementById('btn-start-farm');
    var stopBtn = document.getElementById('btn-stop-farm');
    var statusText = document.getElementById('status-text-card');
    var yammi = document.getElementById('status-yammi-card');
    var volt = document.getElementById('status-volt-card');
    var onlineLabel = document.getElementById('status-roblox-online-card');
    var totalLabel = document.getElementById('status-roblox-total-card');

    function setOnline() {
      if (farmRunning) { log('Уже запущен'); return; }
      farmRunning = true;
      farmStartTime = nowHM();
      farmFinishedTime = '';
      if (statusText) { statusText.textContent = 'ONLINE'; statusText.classList.remove('status-offline'); statusText.classList.add('status-online'); }
      if (yammi) { yammi.textContent = 'ONLINE'; yammi.classList.remove('offline'); yammi.classList.add('online'); }
      if (volt) { volt.textContent = 'ONLINE'; volt.classList.remove('offline'); volt.classList.add('online'); }
      if (onlineLabel) onlineLabel.textContent = '3';
      if (totalLabel) totalLabel.textContent = '5';
      log('🚀 Запуск фермы');
      renderQueue();
      startProgress();
    }
    function setOffline() {
      if (!farmRunning) { log('Ферма не запущена'); return; }
      farmRunning = false;
      farmFinishedTime = nowHM();
      if (statusText) { statusText.textContent = 'OFFLINE'; statusText.classList.remove('status-online'); statusText.classList.add('status-offline'); }
      if (yammi) { yammi.textContent = 'OFFLINE'; yammi.classList.remove('online'); yammi.classList.add('offline'); }
      if (volt) { volt.textContent = 'OFFLINE'; volt.classList.remove('online'); volt.classList.add('offline'); }
      if (onlineLabel) onlineLabel.textContent = '0';
      log('⏹️ Ферма остановлена');
      renderQueue();
      stopProgress();
    }
    if (startBtn) startBtn.addEventListener('click', setOnline);
    if (stopBtn) stopBtn.addEventListener('click', setOffline);
  }

  // ---------- Progress ----------
  var progressTimer = null;
  var progress = 0;
  function startProgress() {
    stopProgress();
    progress = 0;
    progressTimer = setInterval(function () {
      progress = (progress + 2) % 101;
      var fill = document.getElementById('status-progress-fill-start');
      var pct = document.getElementById('status-percent-start');
      var time = document.getElementById('status-pack-time-start');
      if (fill) fill.style.width = progress + '%';
      if (pct) pct.textContent = progress + '%';
      if (time) time.textContent = Math.round(progress * 2.4);
    }, 200);
  }
  function stopProgress() {
    if (progressTimer) { clearInterval(progressTimer); progressTimer = null; }
  }

  // ---------- Console log ----------
  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function log(msg) {
    var box = document.getElementById('main-log-box');
    if (!box) return;
    var entry = document.createElement('div');
    entry.className = 'log-entry';
    var time = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    entry.innerHTML = '<span class="log-time">[' + time + ']</span> ' + esc(msg);
    box.appendChild(entry);
    box.scrollTop = box.scrollHeight;
  }

  function initConsole() {
    var clear = document.getElementById('btn-clear-main-console');
    var box = document.getElementById('main-log-box');
    if (clear && box) clear.addEventListener('click', function () { box.innerHTML = ''; log('🗑️ Консоль очищена'); });
    var devToggle = document.getElementById('btn-dev-mode');
    if (devToggle) {
      devToggle.addEventListener('click', function () {
        devToggle.classList.toggle('on');
        var devWrap = document.getElementById('dev-log-wrapper');
        var mainWrap = document.getElementById('console-log-wrapper');
        if (devWrap && mainWrap) {
          var on = devToggle.classList.contains('on');
          devWrap.style.display = on ? 'flex' : 'none';
          mainWrap.style.display = on ? 'none' : 'flex';
        }
        log('Режим разработчика: ' + (devToggle.classList.contains('on') ? 'ON' : 'OFF'));
      });
    }
  }

  // ---------- Cookie checker demo ----------
  var checkerRunId = 0;
  var CHECK_STYLES = {
    'Alive': '#4ade80',
    'CapLock': '#fbbf24',
    'JoinGameCaptcha': '#fbbf24',
    'FaceLock': '#c084fc',
    'Banned': '#f87171'
  };
  function nickFromLine(line) {
    var idx = line.indexOf(':');
    return idx > -1 ? line.slice(0, idx) : line.slice(0, 20);
  }
  function fakeCheckResult(line) {
    var seed = 0;
    for (var i = 0; i < line.length; i++) seed = (seed * 31 + line.charCodeAt(i)) >>> 0;
    var r = seed % 100;
    if (r < 70) return 'Alive';
    if (r < 80) return 'CapLock';
    if (r < 88) return 'JoinGameCaptcha';
    if (r < 94) return 'FaceLock';
    return 'Banned';
  }
  function updateCheckerCounts(rows) {
    var counts = { Alive: 0, CapLock: 0, JoinGameCaptcha: 0, FaceLock: 0, Banned: 0 };
    rows.forEach(function (r) { if (r.status && r.status !== 'Проверка...') counts[r.status] = (counts[r.status] || 0) + 1; });
    var map = { cLive: 'Alive', cLock: 'CapLock', cJoin: 'JoinGameCaptcha', cFaceLock: 'FaceLock', cBanned: 'Banned' };
    Object.keys(map).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.textContent = String(counts[map[id]] || 0);
    });
    var btnMap = { btnCopyLive: 'Alive', btnCopyLock: 'CapLock', btnCopyJoin: 'JoinGameCaptcha', btnCopyFaceLock: 'FaceLock', btnCopyBanned: 'Banned' };
    Object.keys(btnMap).forEach(function (id) {
      var btn = document.getElementById(id);
      if (btn) btn.disabled = !(counts[btnMap[id]] > 0);
    });
  }
  function runCheckerSimulation(lines) {
    var tbody = document.getElementById('resultsBody');
    if (!tbody) return;
    var runId = ++checkerRunId;
    tbody.innerHTML = '';
    var rows = lines.map(function (line, i) {
      return { idx: i, line: line, nick: nickFromLine(line), status: 'Проверка...' };
    });
    var stopBtn = document.getElementById('btnStop');
    if (stopBtn) stopBtn.disabled = false;
    updateCheckerCounts(rows);
    var pending = rows.length;
    rows.forEach(function (r) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + (r.idx + 1) + '</td><td>' + esc(r.nick) + '</td><td style="color:#94a3b8;">Проверка...</td>' +
        '<td style="font-size:10px; color:#94a3b8;">ROBLOSECURITY=_' + makeToken(r.nick).slice(0, 24) + '…</td>';
      tbody.appendChild(tr);
      r.tr = tr;
      setTimeout(function () {
        if (runId !== checkerRunId) return;
        r.status = fakeCheckResult(r.line);
        var td = r.tr ? r.tr.children[2] : null;
        if (td) { td.textContent = r.status; td.style.color = CHECK_STYLES[r.status] || '#cbd5e1'; }
        pending--;
        updateCheckerCounts(rows);
        if (pending <= 0) {
          if (stopBtn) stopBtn.disabled = true;
          var alive = rows.filter(function (x) { return x.status === 'Alive'; }).length;
          log('✅ Проверка завершена: Alive ' + alive + ' из ' + rows.length);
        }
      }, 400 + Math.random() * 1800);
    });
    if (stopBtn) {
      stopBtn.onclick = function () {
        checkerRunId++;
        rows.forEach(function (r) {
          if (r.status === 'Проверка...') {
            r.status = 'Остановлено';
            var td = r.tr ? r.tr.children[2] : null;
            if (td) { td.textContent = 'Остановлено'; td.style.color = '#94a3b8'; }
          }
        });
        stopBtn.disabled = true;
        updateCheckerCounts(rows);
        log('⏹️ Проверка остановлена');
      };
    }
  }
  function initCookieChecker() {
    var tbody = document.getElementById('resultsBody');
    if (tbody) {
      tbody.innerHTML = '';
      var data = [
        { nick: 'xXShadowKnightXx', status: 'Alive' },
        { nick: 'OofSound_Remix', status: 'CapLock' },
        { nick: 'EpicJailbreak', status: 'Banned' }
      ];
      data.forEach(function (d, i) {
        var tr = document.createElement('tr');
        tr.innerHTML = '<td>' + (i + 1) + '</td><td>' + d.nick + '</td><td style="color:' + (CHECK_STYLES[d.status] || '#cbd5e1') + ';">' + d.status + '</td>' +
          '<td style="font-size:10px; color:#94a3b8;">ROBLOSECURITY=_' + makeToken(d.nick).slice(0, 24) + '…</td>';
        tbody.appendChild(tr);
      });
      updateCheckerCounts(data.map(function (d) { return { status: d.status }; }));
    }
    qa('.copy-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        log('Скопировано куки: ' + btn.textContent.trim());
      });
    });
  }

  // ---------- Webhook / Discord demo ----------
  // ---------- Webhook / Discord demo ----------
  // Пример данных мониторинга (как приходит от Discord-бота в оригинале)
  var DISCORD_EXAMPLE = [
    { username: 'xXShadowKnightXx', prestige: 12, level: 87, gems: 154300, gold: 98200, safetyStatus: 'Safe', minsAgo: 2 },
    { username: 'BloxKing_777', prestige: 9, level: 74, gems: 88450, gold: 45100, safetyStatus: 'Safe', minsAgo: 4 },
    { username: 'PixelPanda_YT', prestige: 15, level: 96, gems: 231700, gold: 120400, safetyStatus: 'Safe', minsAgo: 6 },
    { username: 'NoobSlayer2007', prestige: 4, level: 41, gems: 12300, gold: 8700, safetyStatus: 'Safe', minsAgo: 8 },
    { username: 'lil_bacon_gamer', prestige: 7, level: 63, gems: 54900, gold: 31250, safetyStatus: 'Safe', minsAgo: 11 },
    { username: 'DarkVenom_Pro', prestige: 11, level: 82, gems: 132800, gold: 76300, safetyStatus: 'Safe', minsAgo: 14 },
    { username: 'ProGamer_Rus', prestige: 8, level: 70, gems: 71200, gold: 39800, safetyStatus: 'Safe', minsAgo: 17 },
    { username: 'SwordFight_Master', prestige: 6, level: 58, gems: 43100, gold: 24600, safetyStatus: 'Safe', minsAgo: 21 },
    { username: 'Guest1337_RBLX', prestige: 2, level: 19, gems: 900, gold: 400, safetyStatus: 'Banned', minsAgo: 26 },
    { username: 'EpicJailbreak', prestige: 3, level: 27, gems: 2100, gold: 1500, safetyStatus: 'Banned', minsAgo: 33 }
  ];

  // Разметка строки — как renderDiscordAccounts в приложении
  function renderDiscordAccounts(accounts, target) {
    var container = document.getElementById(target === 'banned' ? 'discord-banned-list' : 'discord-accounts-list');
    if (!container) return;
    container.innerHTML = '';
    if (!accounts || accounts.length === 0) {
      container.innerHTML = '<div style="text-align:center;color:#4a5568;padding:20px 0;font-size:13px;">📭 Нет данных</div>';
      return;
    }
    accounts.forEach(function (acc, index) {
      var row = document.createElement('div');
      row.className = 'discord-account-item';
      var gems = String(acc.gems || 0).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
      var gold = String(acc.gold || 0).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
      var statusText = '', statusClass = '';
      var st = String(acc.safetyStatus || '').toLowerCase();
      if (st.indexOf('banned') !== -1) { statusText = 'Banned'; statusClass = 'banned'; }
      else if (st.indexOf('safe') !== -1) { statusText = '🛡️ Safe'; statusClass = 'online'; }
      var d = new Date(Date.now() - (acc.minsAgo || 0) * 60000);
      var timeStr = ('0' + d.getDate()).slice(-2) + '.' + ('0' + (d.getMonth() + 1)).slice(-2) + ' ' +
        ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2);
      row.innerHTML =
        '<span class="acc-number">' + (index + 1) + '.</span>' +
        '<span style="color:#e2e8f0;font-weight:600;">' + esc(acc.username || 'Неизвестно') + '</span>' +
        '<span style="color:#94a3b8;">Prestige ' + acc.prestige + ' | Level ' + acc.level + '</span>' +
        '<span style="color:#0c9bfa;font-weight:500;">💎 ' + gems + '</span>' +
        '<span style="color:#facc15;font-weight:500;">🪙 ' + gold + '</span>' +
        '<span style="color:#94a3b8;">' + timeStr + '</span>' +
        '<span class="acc-status ' + statusClass + '" style="font-weight:600;text-align:right;">' + statusText + '</span>';
      container.appendChild(row);
    });
  }

  function fillDiscordExample() {
    renderDiscordAccounts(DISCORD_EXAMPLE.filter(function (a) { return a.safetyStatus !== 'Banned'; }), 'all');
    renderDiscordAccounts(DISCORD_EXAMPLE.filter(function (a) { return a.safetyStatus === 'Banned'; }), 'banned');
    var badge = document.getElementById('badge-banned');
    if (badge) badge.textContent = '2';
  }

  function initWebhook() {
    var toggle = document.getElementById('btn-toggle-discord');
    var icon = document.getElementById('discord-status-icon');
    var text = document.getElementById('discord-mod-text');
    var list = document.getElementById('discord-accounts-list');
    var bannedList = document.getElementById('discord-banned-list');
    var badge = document.getElementById('badge-banned');
    if (!toggle) return;
    // Пример аккаунтов виден сразу — как будто поток уже присылал данные
    fillDiscordExample();
    toggle.addEventListener('click', function () {
      var on = toggle.classList.contains('discord-mod-on');
      if (!on) {
        toggle.classList.remove('discord-mod-off');
        toggle.classList.add('discord-mod-on');
        if (text) text.textContent = 'Разорвать поток';
        if (icon) { icon.textContent = '✅'; icon.classList.remove('offline'); icon.classList.add('online'); }
        fillDiscordExample();
        log('✅ Discord открыт');
      } else {
        toggle.classList.remove('discord-mod-on');
        toggle.classList.add('discord-mod-off');
        if (text) text.textContent = 'Подключить поток';
        if (icon) { icon.textContent = '❌'; icon.classList.remove('online'); icon.classList.add('offline'); }
        if (list) list.innerHTML = '<div class="discord-empty-msg">Ожидание данных от Discord...</div>';
        if (bannedList) bannedList.innerHTML = '<div class="discord-empty-msg">Нет забаненных аккаунтов</div>';
        if (badge) badge.textContent = '0';
        log('поток off');
      }
    });
    var clearAll = document.getElementById('btn-clear-all-accounts');
    if (clearAll) clearAll.addEventListener('click', function () {
      if (list) list.innerHTML = '<div style="text-align:center;color:#4a5568;padding:20px 0;font-size:13px;">📭 Нет данных</div>';
      log('🗑️ Список аккаунтов очищен (по запросу пользователя)');
    });
    var clearBanned = document.getElementById('btn-clear-banned');
    if (clearBanned) clearBanned.addEventListener('click', function () {
      if (bannedList) bannedList.innerHTML = '<div style="text-align:center;color:#4a5568;padding:20px 0;font-size:13px;">📭 Нет данных</div>';
      if (badge) badge.textContent = '0';
      log('🗑️ Бан-лист очищен (по запросу пользователя)');
    });
    var removeBanned = document.getElementById('btn-remove-banned-cookies');
    if (removeBanned) removeBanned.addEventListener('click', function () { log('🍪 Куки забаненных удалены из пачек (демо)'); });
  }

  // ---------- Solver log ----------
  function initSolver() {
    var box = document.getElementById('solver-log-box');
    if (box) {
      var e = document.createElement('div');
      e.className = 'log-entry';
      e.innerHTML = '<span class="log-time">[system]</span> Solver готов к работе';
      box.appendChild(e);
    }
    var mini = document.getElementById('btn-toggle-solver-mini');
    var gear = mini ? mini.querySelector('.mod-gear') : null;
    if (gear) gear.addEventListener('click', function (e) {
      e.stopPropagation();
      log('⛔ Solver недоступен на вашей лицензии');
    });
  }

  // ---------- Yummy / Console Launcher ----------
  function initYummy() {
    var box = document.getElementById('cl-log-box');
    if (box) {
      var e = document.createElement('div');
      e.className = 'log-entry';
      e.innerHTML = '<span class="log-time">[system]</span> Console Launcher готов';
      box.appendChild(e);
    }
    var label = document.getElementById('cl-gear-label');
    if (label) label.addEventListener('click', function () { openModal('cl-settings-modal-overlay'); });
  }

  // ---------- Console Launcher settings modal ----------
  var driverInstalled = false;
  function initClSettings() {
    var envDot = document.getElementById('cl-nav-env-dot');
    var envText = document.getElementById('cl-nav-env-text');
    if (envDot) { envDot.classList.remove('checking'); envDot.classList.add('ok'); }
    if (envText) envText.textContent = 'Экран 1920×1080, DPI 100% — подходит для навигации';

    var sel = document.getElementById('cl-version');
    if (sel) {
      ['version-9e8a2c3b7f (current)', 'version-8d41f0a2c5', 'version-7b2e9d1f84'].forEach(function (v) {
        var opt = document.createElement('option');
        opt.textContent = v;
        sel.appendChild(opt);
      });
    }

    var minS = document.getElementById('cl-delay-min-slider');
    var maxS = document.getElementById('cl-delay-max-slider');
    var fill = document.getElementById('cl-open-delay-fill');
    var minV = document.getElementById('cl-delay-min-value');
    var maxV = document.getElementById('cl-delay-max-value');
    function syncDual() {
      if (!minS || !maxS) return;
      var lo = Math.min(+minS.value, +maxS.value);
      var hi = Math.max(+minS.value, +maxS.value);
      if (minV) minV.textContent = lo;
      if (maxV) maxV.textContent = hi;
      if (fill) {
        var span = +maxS.max - +minS.min;
        fill.style.left = ((lo - +minS.min) / span * 100) + '%';
        fill.style.width = ((hi - lo) / span * 100) + '%';
      }
    }
    if (minS) minS.addEventListener('input', syncDual);
    if (maxS) maxS.addEventListener('input', syncDual);
    syncDual();

    var testProxy = document.getElementById('cl-test-proxy-btn');
    if (testProxy) testProxy.addEventListener('click', function () { log('✅ Тест прокси: OK 443ms (демо)'); });
    var driverDot = document.getElementById('cl-driver-dot');
    var driverCheck = document.getElementById('cl-driver-check-btn');
    if (driverCheck) driverCheck.addEventListener('click', function () {
      if (driverDot) { driverDot.classList.remove('checking'); driverDot.classList.add(driverInstalled ? 'ok' : 'fail'); }
      log(driverInstalled ? '🔌 Драйвер: установлен' : '🔌 Драйвер: не установлен');
    });
    var driverInstall = document.getElementById('cl-driver-install-btn');
    if (driverInstall) driverInstall.addEventListener('click', function () {
      var path = document.getElementById('driver-exception-path');
      if (path) path.textContent = 'C:\\Users\\Belamor\\AppData\\Local\\automatic-ferma';
      openModal('driver-install-overlay');
    });
    var driverYes = document.getElementById('driver-install-yes');
    if (driverYes) driverYes.addEventListener('click', function () {
      driverInstalled = true;
      if (driverDot) { driverDot.classList.remove('fail'); driverDot.classList.add('ok'); }
      closeModal('driver-install-overlay');
      log('🔌 Драйвер: установлен');
    });
    var saveGame = document.getElementById('cl-save-gamename-btn');
    if (saveGame) saveGame.addEventListener('click', function () { log('💾 GameName сохранён'); });
    var vInstall = document.getElementById('cl-version-install-btn');
    if (vInstall) vInstall.addEventListener('click', function () {
      log('⬇️ Установка версии... (демо)');
      setTimeout(function () { log('✅ Roblox переустановлен, Volt-файлы вернулись (демо)'); }, 1200);
    });
    var vExport = document.getElementById('cl-version-export-btn');
    if (vExport) vExport.addEventListener('click', function () { log('📄 Список версий сохранён (демо)'); });
    var vBackup = document.getElementById('cl-open-version-backup');
    if (vBackup) vBackup.addEventListener('click', function () { log('🗄️ Хранилище версий открыто (демо)'); });
    var manualToggle = document.getElementById('cl-version-manual-toggle');
    var manualRow = document.getElementById('cl-version-manual-row');
    if (manualToggle && manualRow) manualToggle.addEventListener('click', function () {
      setTimeout(function () { manualRow.style.display = manualToggle.classList.contains('on') ? '' : 'none'; }, 0);
    });
    var regToggle = document.getElementById('cl-version-register-toggle');
    if (regToggle) regToggle.addEventListener('click', function () { log('✅ Версия зарегистрирована (демо)'); });
  }

  // ---------- Sliders value sync ----------
  function initSliders() {
    var cycles = document.getElementById('smart-cycles-slider');
    var cyclesVal = document.getElementById('smart-cycles-value');
    if (cycles && cyclesVal) cycles.addEventListener('input', function () {
      var newCount = parseInt(cycles.value, 10);
      var oldCount = smartSwap.activeCount;
      if (newCount < oldCount) {
        for (var i = newCount; i < oldCount; i++) {
          smartSwap.slots[i] = { work: '', end: '', packId: null, sleepMinutes: null };
        }
      }
      smartSwap.activeCount = newCount;
      updateSmartCyclesSlider();
      renderSmartSwapSlots();
      log('Циклов: ' + newCount + ' — слот ' + (newCount < oldCount ? 'удалён' : 'добавлен'));
    });

    var rbInterval = document.getElementById('ramboost-interval-slider');
    var rbIntervalVal = document.getElementById('ramboost-interval-value');
    if (rbInterval && rbIntervalVal) rbInterval.addEventListener('input', function () { rbIntervalVal.textContent = rbInterval.value + 'с'; });
    var rbProcess = document.getElementById('ramboost-process-interval-slider');
    var rbProcessVal = document.getElementById('ramboost-process-interval-value');
    if (rbProcess && rbProcessVal) rbProcess.addEventListener('input', function () { rbProcessVal.textContent = rbProcess.value + 'с'; });

    var afk = document.getElementById('antiafk-intensity-slider');
    var afkVal = document.getElementById('antiafk-intensity-value');
    if (afk && afkVal) afk.addEventListener('input', function () { afkVal.textContent = afk.value + 'с'; });

    var ccWorkers = document.getElementById('ccWorkers');
    var ccWorkersVal = document.getElementById('ccWorkersVal');
    if (ccWorkers && ccWorkersVal) ccWorkers.addEventListener('input', function () { ccWorkersVal.textContent = ccWorkers.value; });
    var ccDelay = document.getElementById('ccDelay');
    var ccDelayVal = document.getElementById('ccDelayVal');
    if (ccDelay && ccDelayVal) ccDelay.addEventListener('input', function () { ccDelayVal.textContent = ccDelay.value; });

    var smooth = document.getElementById('smooth-stop-enabled');
    var sliderSection = document.getElementById('slider-section');
    if (smooth && sliderSection) smooth.addEventListener('change', function () {
      sliderSection.classList.toggle('hidden', !smooth.checked);
    });
    var stopSlider = document.getElementById('stop-slider');
    var stopVal = document.getElementById('slider-value-display');
    if (stopSlider && stopVal) stopSlider.addEventListener('input', function () {
      var v = +stopSlider.value;
      stopVal.textContent = v >= 60 ? Math.round(v / 60 * 10) / 10 + ' мин' : v + ' сек';
    });

    var queueMode = document.getElementById('farmtimer-queue-mode');
    if (queueMode) {
      queueMode.addEventListener('change', function () {
        var workRow = document.getElementById('farmtimer-work-row');
        var restRow = document.getElementById('farmtimer-rest-row');
        var on = queueMode.checked;
        if (workRow) workRow.style.display = on ? 'none' : '';
        if (restRow) restRow.style.display = on ? 'none' : '';
        log('Фармить по очереди: ' + (on ? 'ON' : 'OFF'));
      });
    }
  }

  // ---------- License ----------
  function initLicense() {
    var btn = document.getElementById('btn-license-activate');
    var input = document.getElementById('license-key-input');
    function activate() {
      var badge = document.getElementById('license-status-badge');
      if (!input || !input.value.trim()) { log('⚠️ Введите ключ активации'); return; }
      if (badge) { badge.textContent = 'ACTIVE'; badge.classList.remove('unregistered'); badge.classList.add('active'); }
      var kt = document.getElementById('license-key-type');
      if (kt) kt.textContent = 'Unlimited';
      var exp = document.getElementById('license-expires');
      if (exp) {
        var d = new Date();
        d.setDate(d.getDate() + 30);
        exp.textContent = d.toLocaleDateString('ru-RU');
      }
      var hwid = document.getElementById('license-hwid');
      if (hwid) hwid.textContent = '8F3A-12D4-9B7C-E5A1';
      var resetBtn = document.getElementById('btn-license-reset-hwid');
      if (resetBtn) resetBtn.disabled = false;
      licenseValid = true;
      log('✅ Лицензия активирована (демо)');
    }
    if (btn) btn.addEventListener('click', activate);
    if (input) input.addEventListener('keydown', function (e) { if (e.key === 'Enter') activate(); });
    var buy = document.getElementById('btn-license-buy-discord');
    if (buy) buy.addEventListener('click', function () { log('Открываю Discord: dota_sng (демо)'); });
  }

  // ---------- Удержание 5 сек (Spoofer / Reset HWID) ----------
  // ---------- Удержание 5 сек (Spoofer / Reset HWID) — янтарная заливка как в оригинале ----------
  function initHoldButtons() {
    var HOLD_MS = 5000;

    // Фаза удержания: класс .holding + --hold-progress (янтарная заливка ::after)
    function holdPhase(btn, stateEl, labelIdle, isBusy, onComplete) {
      if (!btn) return;
      var holdTimer = null, holdInterval = null;
      function clearHold() {
        if (holdTimer) { clearTimeout(holdTimer); holdTimer = null; }
        if (holdInterval) { clearInterval(holdInterval); holdInterval = null; }
        btn.classList.remove('holding');
        btn.style.removeProperty('--hold-progress');
        if (!isBusy() && stateEl) stateEl.textContent = labelIdle;
      }
      btn.addEventListener('mousedown', function (e) {
        if (e.button !== 0) return;
        if (isBusy()) return;
        clearHold();
        var started = Date.now();
        btn.classList.add('holding');
        holdInterval = setInterval(function () {
          var p = Math.min(1, (Date.now() - started) / HOLD_MS);
          btn.style.setProperty('--hold-progress', (p * 100).toFixed(1) + '%');
          if (stateEl) stateEl.textContent = Math.max(0, Math.ceil((HOLD_MS - (Date.now() - started)) / 1000)) + 'с';
        }, 100);
        holdTimer = setTimeout(function () { clearHold(); onComplete(); }, HOLD_MS);
      });
      btn.addEventListener('mouseup', function () { if (!isBusy()) clearHold(); });
      btn.addEventListener('mouseleave', function () { if (!isBusy()) clearHold(); });
      btn.addEventListener('click', function (e) { e.preventDefault(); });
    }

    // 🧬 Spoofer: удержание → running (проценты) → done (✅ Готово)
    var spoofer = document.getElementById('btn-spoofer');
    if (spoofer) {
      var spState = spoofer.querySelector('.mod-state');
      var spRunning = false;
      holdPhase(spoofer, spState, 'Hold 5s', function () { return spRunning; }, function () {
        spRunning = true;
        spoofer.classList.add('running');
        if (spState) spState.textContent = '0%';
        log('🧬 Spoofer: запуск полной чистки (мусор + HWID Volt + Roblox + MAC)');
        var pct = 0;
        var iv = setInterval(function () {
          pct += 7 + Math.floor(Math.random() * 9);
          if (pct >= 100) {
            clearInterval(iv);
            if (spState) spState.textContent = '100%';
            setTimeout(function () {
              spRunning = false;
              spoofer.classList.remove('running');
              spoofer.classList.add('done');
              if (spState) spState.textContent = '✅ Готово';
              log('🧬 Спуфер успешно завершил работу');
              setTimeout(function () {
                spoofer.classList.remove('done');
                if (spState) spState.textContent = 'Hold 5s';
              }, 2500);
            }, 250);
          } else if (spState) {
            spState.textContent = pct + '%';
          }
        }, 160);
      });
    }

    // 🔑 Reset HWID: тот же паттерн, прогресс в подсказке рядом с кнопкой
    var hwid = document.getElementById('btn-license-reset-hwid');
    if (hwid) {
      var hwWrap = hwid.closest('.license-reset-btn-wrap');
      var hwState = hwid.querySelector('.mod-state') || (hwWrap ? hwWrap.querySelector('.license-reset-hint') : null);
      var hwRunning = false;
      holdPhase(hwid, hwState, 'Hold 5 sec', function () { return hwRunning; }, function () {
        hwRunning = true;
        hwid.classList.add('running');
        if (hwState) hwState.textContent = '0%';
        var pct = 0;
        var iv = setInterval(function () {
          pct += 12 + Math.floor(Math.random() * 10);
          if (pct >= 100) {
            clearInterval(iv);
            setTimeout(function () {
              hwRunning = false;
              hwid.classList.remove('running');
              hwid.classList.add('done');
              if (hwState) hwState.textContent = '✅ Готово';
              log('✅ HWID сброшен (демо). Новый сброс — через 24ч');
              var cd = document.getElementById('license-reset-cooldown');
              if (cd) cd.textContent = 'Доступно через 24ч';
              setTimeout(function () {
                hwid.classList.remove('done');
                if (hwState) hwState.textContent = 'Hold 5 sec';
              }, 2500);
            }, 250);
          } else if (hwState) {
            hwState.textContent = pct + '%';
          }
        }, 140);
      });
    }
  }

  // ---------- Smart-Swap: слоты + переключатель гибкой смены IP ----------
  var smartSwap = {
    enabled: false,
    activeCount: 3,
    open: false,
    slots: (function () {
      var arr = [];
      for (var i = 0; i < 20; i++) arr.push({ work: '', end: '', packId: null, sleepMinutes: null });
      arr[0] = { work: '20:00', end: '23:50', packId: 1, sleepMinutes: null };
      arr[1] = { work: '23:58', end: '03:48', packId: 2, sleepMinutes: 10 };
      arr[2] = { work: '04:00', end: '07:50', packId: 3, sleepMinutes: null };
      return arr;
    })()
  };

  function availPackIds() {
    return Object.keys(DEMO_PACKS).map(Number).sort(function (a, b) { return a - b; });
  }
  function minutesToHM(min) {
    var m = ((min % 1440) + 1440) % 1440;
    return ('0' + Math.floor(m / 60)).slice(-2) + ':' + ('0' + (m % 60)).slice(-2);
  }
  function hmToMinutes(hm) {
    var p = String(hm || '').split(':');
    if (p.length !== 2) return null;
    var h = parseInt(p[0], 10), m = parseInt(p[1], 10);
    if (isNaN(h) || isNaN(m)) return null;
    return h * 60 + m;
  }

  function renderSmartSwapSlots() {
    var table = document.getElementById('smart-slot-table');
    if (!table) return;
    table.innerHTML = '';
    var packs = availPackIds();
    for (var i = 0; i < smartSwap.activeCount; i++) {
      (function (i) {
        var slot = smartSwap.slots[i] || { work: '', end: '', packId: null, sleepMinutes: null };
        var row = document.createElement('div');
        row.className = 'slot-row' + ((slot.work || slot.end) ? ' filled' : '');

        var num = document.createElement('div');
        num.className = 'slot-num';
        num.textContent = ('0' + (i + 1)).slice(-2);
        row.appendChild(num);

        var workInput = document.createElement('input');
        workInput.type = 'text';
        workInput.className = 'time-input' + (slot.work ? ' filled' : '');
        workInput.placeholder = '--:--';
        workInput.value = slot.work || '';
        workInput.dataset.index = i;
        workInput.dataset.type = 'work';
        workInput.autocomplete = 'off';
        workInput.spellcheck = false;
        if (i !== 0) { workInput.readOnly = true; workInput.classList.add('readonly'); }
        row.appendChild(workInput);

        var endInput = document.createElement('input');
        endInput.type = 'text';
        endInput.className = 'time-input' + (slot.end ? ' filled' : '');
        endInput.placeholder = '--:--';
        endInput.value = slot.end || '';
        endInput.dataset.index = i;
        endInput.dataset.type = 'end';
        endInput.autocomplete = 'off';
        endInput.spellcheck = false;
        row.appendChild(endInput);

        var packSelect = document.createElement('select');
        packSelect.className = 'pack-select' + (slot.packId != null ? ' filled' : '');
        packSelect.dataset.index = i;
        var optEmpty = document.createElement('option');
        optEmpty.value = ''; optEmpty.textContent = '--';
        packSelect.appendChild(optEmpty);
        var optSleep = document.createElement('option');
        optSleep.value = 'sleep'; optSleep.textContent = '😴';
        optSleep.title = 'Сон — ферма в этом слоте не запускается';
        packSelect.appendChild(optSleep);
        packs.forEach(function (pid) {
          var opt = document.createElement('option');
          opt.value = String(pid);
          opt.textContent = '🍪' + pid;
          packSelect.appendChild(opt);
        });
        if (slot.packId !== 'sleep' && slot.packId != null && packs.indexOf(parseInt(slot.packId, 10)) === -1) {
          var optWarn = document.createElement('option');
          optWarn.value = String(slot.packId);
          optWarn.textContent = '🍪' + slot.packId + ' ⚠';
          packSelect.appendChild(optWarn);
        }
        packSelect.value = slot.packId != null ? String(slot.packId) : '';
        packSelect.addEventListener('change', function () {
          var v = this.value;
          smartSwap.slots[i].packId = v === '' ? null : (v === 'sleep' ? 'sleep' : parseInt(v, 10));
          this.classList.toggle('filled', v !== '');
        });
        row.appendChild(packSelect);

        var sleepSelect = document.createElement('select');
        sleepSelect.className = 'sleep-select' + (slot.sleepMinutes != null ? ' filled' : '');
        sleepSelect.dataset.index = i;
        var se = document.createElement('option');
        se.value = ''; se.textContent = '--';
        sleepSelect.appendChild(se);
        for (var m = 5; m <= 30; m += 5) {
          var so = document.createElement('option');
          so.value = String(m); so.textContent = String(m);
          sleepSelect.appendChild(so);
        }
        sleepSelect.value = slot.sleepMinutes != null ? String(slot.sleepMinutes) : '';
        sleepSelect.addEventListener('change', function () {
          var v = this.value;
          smartSwap.slots[i].sleepMinutes = v === '' ? null : parseInt(v, 10);
          this.classList.toggle('filled', v !== '');
        });
        row.appendChild(sleepSelect);
        table.appendChild(row);
      })(i);
    }

    // Маска времени HH:MM на редактируемых полях
    qa('input.time-input', table).forEach(function (inp) {
      if (inp.readOnly) return;
      inp.addEventListener('keydown', function (e) {
        var allowed = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter', 'Home', 'End'];
        if (allowed.indexOf(e.key) !== -1) return;
        if (e.ctrlKey || e.metaKey) return;
        if (!/^\d$/.test(e.key)) e.preventDefault();
        if (e.key === 'Enter') { e.preventDefault(); e.target.blur(); }
      });
      inp.addEventListener('input', function () {
        var raw = this.value.replace(/\D/g, '');
        if (raw.length > 4) raw = raw.slice(0, 4);
        if (raw.length >= 1 && parseInt(raw[0], 10) > 2) raw = raw.slice(1);
        if (raw.length >= 2) {
          var h0 = parseInt(raw[0], 10), h1 = parseInt(raw[1], 10);
          if (h0 === 2 && h1 > 3) raw = raw.slice(0, 1) + raw.slice(2);
        }
        if (raw.length >= 3 && parseInt(raw[2], 10) > 5) raw = raw.slice(0, 2);
        var formatted = raw.length === 0 ? '' : (raw.length <= 2 ? raw : raw.slice(0, 2) + ':' + raw.slice(2));
        this.value = formatted;
        this.classList.toggle('filled', formatted.length === 5);
      });
      inp.addEventListener('blur', function () {
        var idx = parseInt(this.dataset.index, 10);
        var type = this.dataset.type;
        var v = this.value.trim();
        if (v.length < 5) {
          this.value = '';
          this.classList.remove('filled');
          smartSwap.slots[idx][type] = '';
        } else {
          smartSwap.slots[idx][type] = v;
        }
        var row = this.closest('.slot-row');
        if (row) row.classList.toggle('filled', !!(smartSwap.slots[idx].work || smartSwap.slots[idx].end));
        autoFillNextSlots();
      });
    });
  }

  // Work последующих слотов заполняется автоматом: конец предыдущего + сон/отдых
  function autoFillNextSlots() {
    var rest = 8;
    var restInput = document.getElementById('farmtimer-rest-input');
    if (restInput && parseInt(restInput.value, 10) > 0) rest = parseInt(restInput.value, 10);
    for (var i = 1; i < smartSwap.activeCount; i++) {
      var prev = smartSwap.slots[i - 1];
      var cur = smartSwap.slots[i];
      var prevEnd = hmToMinutes(prev.end);
      if (prevEnd == null) break;
      var hm = minutesToHM(prevEnd + (prev.sleepMinutes != null ? prev.sleepMinutes : rest));
      if (cur.work !== hm) {
        cur.work = hm;
        var inp = q('#smart-slot-table input.time-input[data-index="' + i + '"][data-type="work"]');
        if (inp) { inp.value = hm; inp.classList.add('filled'); }
      }
    }
  }

  function updateSmartCyclesSlider() {
    var slider = document.getElementById('smart-cycles-slider');
    var value = document.getElementById('smart-cycles-value');
    if (!slider || !value) return;
    var val = smartSwap.activeCount;
    slider.value = val;
    value.textContent = val;
    var percent = ((val - 1) / 19) * 100;
    slider.style.background = 'linear-gradient(to right, #a855f7 0%, #a855f7 ' + percent + '%, #334155 ' + percent + '%, #334155 100%)';
  }

  function updateSmartSwapToggleUI() {
    var toggle = document.getElementById('smart-swap-toggle');
    var block = document.getElementById('smart-swap-block');
    var queueModeRow = document.getElementById('queue-mode-row');
    var workRow = document.getElementById('farmtimer-work-row');
    var restRow = document.getElementById('farmtimer-rest-row');
    var hint = document.getElementById('farmtimer-hint');
    if (!toggle || !block) return;

    toggle.classList.toggle('on', smartSwap.enabled);
    block.classList.toggle('active', smartSwap.enabled);

    if (smartSwap.enabled) {
      if (queueModeRow) queueModeRow.classList.add('hidden');
      if (workRow) workRow.classList.add('hidden');
      if (restRow) restRow.style.display = 'none';
      if (hint) hint.style.display = 'none';
      smartSwap.open = true;
      block.classList.add('open');
    } else {
      if (queueModeRow) queueModeRow.classList.remove('hidden');
      var queueMode = document.getElementById('farmtimer-queue-mode');
      var queueOn = !!(queueMode && queueMode.checked);
      if (workRow) workRow.style.display = queueOn ? 'none' : '';
      if (restRow) restRow.style.display = queueOn ? 'none' : 'flex';
      if (hint) hint.style.display = '';
      block.classList.remove('open');
      smartSwap.open = false;
    }
  }

  function initSmartSwap() {
    var header = document.getElementById('smart-swap-header');
    var toggle = document.getElementById('smart-swap-toggle');
    if (header) {
      header.addEventListener('click', function (e) {
        if (e.target.closest('.smart-swap-toggle')) return;
        smartSwap.open = !smartSwap.open;
        var block = document.getElementById('smart-swap-block');
        if (block) block.classList.toggle('open', smartSwap.open);
        log('Smart-Swap: ' + (smartSwap.open ? 'открыто' : 'свернуто'));
      });
    }
    if (toggle) {
      toggle.addEventListener('click', function (e) {
        e.stopPropagation();
        smartSwap.enabled = !smartSwap.enabled;
        if (smartSwap.enabled) smartSwap.open = true;
        updateSmartSwapToggleUI();
        log('🌐 Смена IP + гибкий график: ' + (smartSwap.enabled ? 'ON' : 'OFF'));
      });
    }
    updateSmartCyclesSlider();
    renderSmartSwapSlots();
    updateSmartSwapToggleUI();
  }

  // ---------- Misc ----------
  function initMisc() {
    var getCookie = document.getElementById('btn-get-cookie');
    var gcStatus = document.getElementById('getcookie-status');
    var gcTimer = null;
    if (getCookie) getCookie.addEventListener('click', function () {
      // Кнопка горит «⏳ Стоп» весь прогон глобализации — как в оригинале
      if (getCookie.classList.contains('busy')) {
        if (gcTimer) { clearInterval(gcTimer); gcTimer = null; }
        getCookie.classList.remove('busy');
        getCookie.textContent = '🔄 GetCookie';
        if (gcStatus) gcStatus.textContent = 'отмена запрошена';
        log('getcookie: отмена запрошена');
        return;
      }
      if (!licenseValid) { log('⛔ GetCookie доступен только с активной лицензией'); return; }
      var n = selectedPackId ? packCount(selectedPackId) : 0;
      if (!n) { log('⚠️ пачка не выбрана'); return; }
      getCookie.classList.add('busy');
      getCookie.textContent = '⏳ Стоп';
      if (gcStatus) gcStatus.textContent = 'запуск...';
      log('getcookie: ' + n + ' аккаунтов');
      var i = 0;
      gcTimer = setInterval(function () {
        i++;
        var accs = DEMO_PACKS[selectedPackId] ? DEMO_PACKS[selectedPackId].accounts : [];
        var nick = accs[i - 1] ? accs[i - 1].nick : '';
        if (gcStatus) gcStatus.textContent = '⏳ ' + i + ' / ' + n;
        log('GetCookie: ' + nick + ' — кука обновлена, глобализация (демо)');
        if (i >= n) {
          clearInterval(gcTimer);
          gcTimer = null;
          // Глобализация закончилась — только теперь кнопка гаснет
          getCookie.classList.remove('busy');
          getCookie.textContent = '🔄 GetCookie';
          if (gcStatus) gcStatus.textContent = '✅ готов: ' + n;
          log('🌍 GetCookie: глобализация завершена (' + n + ' акк.)');
        }
      }, 500);
    });
    var refresh = document.getElementById('accounts-refresh-btn');
    if (refresh) refresh.addEventListener('click', function () {
      renderAccounts();
      log('Список аккаунтов обновлён');
    });
    var toggleSolver = document.getElementById('btn-toggle-solver');
    if (toggleSolver) toggleSolver.addEventListener('click', function () {
      toggleSolver.classList.toggle('state-off');
      toggleSolver.classList.toggle('state-on');
      toggleSolver.textContent = toggleSolver.classList.contains('state-on') ? 'Solver On' : 'Solver Off';
    });
    var tmin = document.getElementById('titlebar-min');
    var tmax = document.getElementById('titlebar-max');
    var tclose = document.getElementById('titlebar-close');
    if (tmin) tmin.addEventListener('click', function () { log('Демо: свернуть/развернуть управляет браузер'); });
    if (tmax) tmax.addEventListener('click', function () { log('Демо: свернуть/развернуть управляет браузер'); });
    if (tclose) tclose.addEventListener('click', function () { log('Демо-версия: закрытие окна недоступно в браузере'); });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initTabs();
    initTabsGearMenu();
    initCloseButtons();
    initGears();
    initToggles();
    initCookieInputModal();
    initPackConfirms();
    initPackCheckActions();
    initManual();
    initStartStop();
    renderPacks();
    selectPack(1, true);
    initConsole();
    initCookieChecker();
    initWebhook();
    initSolver();
    initYummy();
    initClSettings();
    initSliders();
    initSmartSwap();
    initLicense();
    initHoldButtons();
    initMisc();
    log('Демо интерфейса загружено');
  });
})();
