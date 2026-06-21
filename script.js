/* =========================================================================
   КОНФИГ — ЕДИНСТВЕННОЕ МЕСТО, КОТОРОЕ ТЕБЕ НУЖНО РЕДАКТИРОВАТЬ
   ========================================================================= */
const CONFIG = {

  profile: {
    username: "trendsetter",
    tagline: "когда я выросту, я трахну лесбиянку",
    // avatar: ссылка на картинку ("https://...") или локальный файл рядом
    // с index.html (например "avatar.jpg"). Если null — сгенерится
    // аватар-заглушка с первой буквой ника.
    avatar: "avatar.jpg",
    status: { show: true, color: "#5cff9d" } // зелёная точка "онлайн"
  },

  // бейджи под ником. Оставь [] чтобы скрыть блок совсем
  badges: ["UID · 0001", "EST · 2026"],

  // соцсети. icon — один из ключей объекта ICONS ниже
  socials: [
    { name: "Discord",   url: "#", icon: "chat" },
    { name: "Telegram",  url: "#", icon: "paperplane" },
    { name: "Instagram", url: "#", icon: "camera" },
    { name: "GitHub",    url: "#", icon: "code" },
    { name: "X",         url: "#", icon: "spark" }
  ],

  music: {
    // положи mp3 рядом с index.html и укажи имя файла, например "song.mp3"
    // (свой же файл = без проблем с CORS, волна будет honest-реактивная)
    src: "music.mp3",
    title: "Когда я вырасту",
    artist: "3g0th2002"
  },

  effects: {
    particles: true,
    cursor: true,
    tilt: true,
    holoSpin: true,   // медленное "дыхание" голо-рамки само по себе
    typing: true
  }
};

/* =========================================================================
   ИКОНКИ (нейтральные глифы, не логотипы конкретных брендов —
   так safe по IP и одинаково хорошо смотрится для любой платформы)
   ========================================================================= */
const ICONS = {
  chat: '<path d="M4 4h16v12H8l-4 4z"/>',
  paperplane: '<path d="M3 11l18-8-8 18-2-7-7-2.5z"/>',
  camera: '<path d="M4 7h3l2-2h6l2 2h3v12H4z M12 10a3 3 0 100 6 3 3 0 000-6z"/>',
  code: '<path d="M8 6L2 12l6 6M16 6l6 6-6 6"/>',
  spark: '<path d="M12 2l2 7 7 2-7 2-2 7-2-7-7-2 7-2z"/>',
  music: '<path d="M9 18V5l11-2v13M9 18a3 3 0 11-6 0 3 3 0 016 0zM20 16a3 3 0 11-6 0 3 3 0 016 0z"/>',
  link: '<path d="M10 14a5 5 0 007 0l3-3a5 5 0 00-7-7l-1 1M14 10a5 5 0 00-7 0l-3 3a5 5 0 007 7l1-1"/>'
};

/* =========================================================================
   УТИЛИТЫ
   ========================================================================= */
const $ = (sel) => document.querySelector(sel);
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
const lerp = (a, b, n) => a + (b - a) * n;

function svgIcon(pathMarkup) {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${pathMarkup}</svg>`;
}

/* заглушка-аватар: градиентный круг с первой буквой ника, как data-URI SVG.
   Работает офлайн, без сторонних сервисов. */
function generatePlaceholderAvatar(letter) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="50%" stop-color="#ffffff"/>
          <stop offset="100%" stop-color="#ffffff"/>
        </linearGradient>
      </defs>
      <rect width="200" height="200" fill="url(#g)"/>
      <text x="100" y="118" font-family="Arial, sans-serif" font-size="86" font-weight="700"
            fill="rgba(10,10,15,0.85)" text-anchor="middle">${letter.toUpperCase()}</text>
    </svg>`;
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}

/* =========================================================================
   РЕНДЕР ПРОФИЛЯ ИЗ CONFIG
   ========================================================================= */
function renderProfile() {
  document.title = CONFIG.profile.username;

  $('#avatar').src = CONFIG.profile.avatar || generatePlaceholderAvatar(CONFIG.profile.username[0] || "?");
  $('#statusDot').style.display = CONFIG.profile.status.show ? 'block' : 'none';
  $('#statusDot').style.background = CONFIG.profile.status.color;
  document.documentElement.style.setProperty('--status-color', CONFIG.profile.status.color);

  $('#username').textContent = CONFIG.profile.username;

  // бейджи
  const badgesEl = $('#badges');
  badgesEl.style.display = CONFIG.badges.length ? 'flex' : 'none';
  badgesEl.innerHTML = CONFIG.badges.map(b => `<span class="badge">${b}</span>`).join('');

  // соцсети
  $('#socials').innerHTML = CONFIG.socials.map(s => `
    <a class="social" href="${s.url}" target="_blank" rel="noopener" title="${s.name}" aria-label="${s.name}">
      ${svgIcon(ICONS[s.icon] || ICONS.link)}
    </a>`).join('');

  // плеер: метаданные трека
  const track = `${CONFIG.music.title} — ${CONFIG.music.artist}`;
  const trackEl = $('#trackText');
  trackEl.textContent = CONFIG.music.src ? track : '— add a song in script.js —';
  if (track.length > 28 && CONFIG.music.src) {
    trackEl.parentElement.classList.add('is-marquee');
    trackEl.innerHTML = `<span>${track}</span>&nbsp;&nbsp;&nbsp;&nbsp;<span>${track}</span>`;
  }

  if (CONFIG.music.src) {
    $('#bgAudio').src = CONFIG.music.src;
  } else {
    $('#playBtn').disabled = true;
    $('#playBtn').style.opacity = '.4';
    $('#playBtn').style.cursor = 'default';
  }
}

/* печатающийся тэглайн */
function typeTagline() {
  const el = $('#tagline');
  const text = CONFIG.profile.tagline;
  if (!CONFIG.effects.typing || prefersReducedMotion) {
    el.textContent = text;
    return;
  }
  el.textContent = '';
  const caret = document.createElement('span');
  caret.className = 'caret';
  el.appendChild(caret);
  let i = 0;
  const step = () => {
    if (i < text.length) {
      caret.insertAdjacentText('beforebegin', text[i]);
      i++;
      setTimeout(step, 22);
    }
  };
  step();
}

/* =========================================================================
   ЭКРАН-ВХОД: "decode" эффект на тексте ENTER + разблокировка звука
   ========================================================================= */
function decodeText(el, finalText, duration = 700) {
  const glyphs = "!<>-_\\/[]{}—=+*^?#";
  const frames = Math.round(duration / 35);
  let frame = 0;
  const tick = () => {
    let out = '';
    for (let i = 0; i < finalText.length; i++) {
      const revealAt = (i / finalText.length) * frames;
      out += frame >= revealAt ? finalText[i] : glyphs[Math.floor(Math.random() * glyphs.length)];
    }
    el.textContent = out;
    frame++;
    if (frame <= frames) requestAnimationFrame(tick); else el.textContent = finalText;
  };
  tick();
}

function setupGate() {
  const gate = $('#gate');
  const gateText = $('#gateText');
  decodeText(gateText, gateText.dataset.final);

  let entered = false;
  gate.addEventListener('click', () => {
    if (entered) return;
    entered = true;
    gate.classList.add('is-leaving');
    $('#app').classList.add('is-visible');
    $('#app').setAttribute('aria-hidden', 'false');

    // звук можно запускать только после жеста пользователя — вот он
    const audio = $('#bgAudio');
    if (CONFIG.music.src) {
      audio.play().then(() => setPlayingUI(true)).catch(() => setPlayingUI(false));
    }
    typeTagline();
  }, { once: true });
}

/* =========================================================================
   ЧАСТИЦЫ НА ФОНЕ
   ========================================================================= */
function setupParticles() {
  const canvas = $('#particles');
  if (!CONFIG.effects.particles) { canvas.style.display = 'none'; return; }
  const ctx = canvas.getContext('2d');
  let w, h, particles;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  function makeParticles() {
    const count = Math.min(70, Math.floor((w * h) / 18000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.6 + 0.4,
      vy: Math.random() * 0.25 + 0.05,
      vx: (Math.random() - 0.5) * 0.12,
      a: Math.random() * 0.5 + 0.15
    }));
  }
  function draw() {
    ctx.clearRect(0, 0, w, h);
    for (const p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200,190,255,${p.a})`;
      ctx.fill();
      p.y -= p.vy;
      p.x += p.vx;
      if (p.y < -5) { p.y = h + 5; p.x = Math.random() * w; }
    }
    requestAnimationFrame(draw);
  }
  window.addEventListener('resize', () => { resize(); makeParticles(); });
  resize(); makeParticles();
  if (!prefersReducedMotion) draw(); else { draw_static(); }
  function draw_static(){ // статичный кадр для reduced-motion
    ctx.clearRect(0,0,w,h);
    for (const p of particles){
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle = `rgba(200,190,255,${p.a})`; ctx.fill();
    }
  }
}

/* =========================================================================
   КАСТОМНЫЙ КУРСОР
   ========================================================================= */
function setupCursor() {
  if (!CONFIG.effects.cursor || isTouch) return;
  $('#app').classList.add('has-custom-cursor');
  const dot = $('#cursorDot');
  const ring = $('#cursorRing');
  let mx = innerWidth / 2, my = innerHeight / 2;
  let rx = mx, ry = my;

  window.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
  });

  document.addEventListener('mouseover', (e) => {
    if (e.target.closest('a, button')) ring.classList.add('is-active');
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest('a, button')) ring.classList.remove('is-active');
  });

  function loop() {
    rx = lerp(rx, mx, 0.18);
    ry = lerp(ry, my, 0.18);
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
    requestAnimationFrame(loop);
  }
  loop();
}

/* =========================================================================
   ГОЛО-РАМКА: медленное вращение + лёгкий наклон карточки за курсором
   ========================================================================= */
function setupTilt() {
  const card = $('#card');
  const root = document.documentElement;
  let angle = 0;
  let targetTiltX = 0, targetTiltY = 0;
  let curTiltX = 0, curTiltY = 0;

  if (CONFIG.effects.tilt && !isTouch && !prefersReducedMotion) {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      targetTiltY = px * 14;   // влево-вправо мышь -> поворот по Y
      targetTiltX = -py * 14;  // вверх-вниз мышь -> поворот по X
    });
    card.addEventListener('mouseleave', () => { targetTiltX = 0; targetTiltY = 0; });
  }

  if (prefersReducedMotion) {
    // статичная рамка без анимации/наклона — уважаем системную настройку
    root.style.setProperty('--holo-angle', '0deg');
    return;
  }

  function loop() {
    curTiltX = lerp(curTiltX, targetTiltX, 0.08);
    curTiltY = lerp(curTiltY, targetTiltY, 0.08);
    card.style.transform = `perspective(900px) rotateX(${curTiltX.toFixed(2)}deg) rotateY(${curTiltY.toFixed(2)}deg)`;

    if (CONFIG.effects.holoSpin && !prefersReducedMotion) {
      angle = (angle + 0.12) % 360;
    }
    // курсор слегка ускоряет вращение голо-рамки рядом с краями карточки
    root.style.setProperty('--holo-angle', (angle + curTiltY * 2).toFixed(1) + 'deg');

    requestAnimationFrame(loop);
  }
  loop();
}

/* =========================================================================
   АУДИО: play/pause + волна (реальная через Web Audio, либо "idle"-фоллбек
   если источник кросс-доменный и анализатор недоступен)
   ========================================================================= */
function setupAudio() {
  const audio = $('#bgAudio');
  const btn = $('#playBtn');
  const canvas = $('#waveform');
  const ctx2d = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;

  let audioCtx, analyser, dataArray, hasRealData = false;

  function tryInitAnalyser() {
    if (audioCtx) return;
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioCtx.createMediaElementSource(audio);
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      source.connect(analyser);
      analyser.connect(audioCtx.destination);
      dataArray = new Uint8Array(analyser.frequencyBinCount);
      hasRealData = true;
    } catch (e) {
      hasRealData = false; // например CORS на чужом mp3 — это ок, идём в фоллбек
    }
  }

  function drawBars(values) {
    ctx2d.clearRect(0, 0, W, H);
    const bars = 14;
    const gap = 2;
    const bw = (W - gap * (bars - 1)) / bars;
    for (let i = 0; i < bars; i++) {
      const v = values[i];
      const bh = Math.max(2, v * H);
      ctx2d.fillStyle = i % 2 === 0 ? '#6cf0ff' : '#b98cff';
      ctx2d.globalAlpha = 0.85;
      ctx2d.fillRect(i * (bw + gap), (H - bh) / 2, bw, bh);
    }
  }

  function frame(t) {
    if (!audio.paused && hasRealData) {
      analyser.getByteFrequencyData(dataArray);
      const step = Math.floor(dataArray.length / 14);
      const vals = Array.from({ length: 14 }, (_, i) => dataArray[i * step] / 255);
      drawBars(vals);
    } else if (!audio.paused) {
      // фоллбек-анимация, если реальные данные недоступны
      const vals = Array.from({ length: 14 }, (_, i) => 0.25 + Math.abs(Math.sin(t / 220 + i)) * 0.6);
      drawBars(vals);
    } else {
      const vals = Array.from({ length: 14 }, (_, i) => 0.12 + Math.abs(Math.sin(t / 900 + i)) * 0.08);
      drawBars(vals);
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  btn.addEventListener('click', () => {
    if (!CONFIG.music.src) return;
    tryInitAnalyser();
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
    if (audio.paused) { audio.play().then(() => setPlayingUI(true)); }
    else { audio.pause(); setPlayingUI(false); }
  });

  audio.addEventListener('play', () => { tryInitAnalyser(); if (audioCtx?.state === 'suspended') audioCtx.resume(); });
}

function setPlayingUI(isPlaying) {
  $('#iconPlay').style.display = isPlaying ? 'none' : 'block';
  $('#iconPause').style.display = isPlaying ? 'block' : 'none';
}

/* =========================================================================
   ИНИЦИАЛИЗАЦИЯ
   ========================================================================= */
renderProfile();
setupGate();
setupParticles();
setupCursor();
setupTilt();
setupAudio();
