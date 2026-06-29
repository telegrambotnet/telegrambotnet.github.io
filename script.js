/* =========================================================================
   КОНФИГ
   ========================================================================= */
const CONFIG = {
  profile: {
    username: "trendsetter",
    discordId: "1423390379587408015",
    tagline: "ебу всех.",
    avatar: "avatar.jpg",
    status: { show: true, color: "#5cff9d" }
  },
  badges: ["UID · 0001", "EST · 2026"],
  socials: [
    { name: "Telegram",  url: "https://t.me/fuckyourselfharm", icon: "paperplane" },
    { name: "GitHub",    url: "https://github.com/telegrambotnet", icon: "code" },
    { name: "SoundCloud", url: "https://soundcloud.com/fr3v3r", icon: "spark" }
  ],
  music: {
    src: "music.mp3",
    title: "Babyface Maniacs",
    artist: "Yung Lean",
    defaultVolume: 0.5
  },
  effects: {
    particles: true,
    cursor: true,
    tilt: true,
    holoSpin: true,
    typing: true
  },
  cursor: {
    // Впиши сюда название файла (например "cursor.cur" или "cursor.png"),
    // чтобы заменить кружочек на свою картинку.
    // Если оставить пустым "", будет стандартный анимированный курсор из CSS.
    image: "" 
  }
};

/* =========================================================================
   ИКОНКИ
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
   РЕНДЕР ПРОФИЛЯ
   ========================================================================= */
function renderProfile() {
  document.title = CONFIG.profile.username;

  $('#avatar').src = CONFIG.profile.avatar || generatePlaceholderAvatar(CONFIG.profile.username[0] || "?");
  $('#statusDot').style.display = CONFIG.profile.status.show ? 'block' : 'none';
  $('#statusDot').style.background = CONFIG.profile.status.color;
  document.documentElement.style.setProperty('--status-color', CONFIG.profile.status.color);

  $('#username').textContent = CONFIG.profile.username;

  const badgesEl = $('#badges');
  badgesEl.style.display = CONFIG.badges.length ? 'flex' : 'none';
  badgesEl.innerHTML = CONFIG.badges.map(b => `<span class="badge">${b}</span>`).join('');

  $('#socials').innerHTML = CONFIG.socials.map(s => `
    <a class="social" href="${s.url}" target="_blank" rel="noopener" title="${s.name}" aria-label="${s.name}">
      ${svgIcon(ICONS[s.icon] || ICONS.link)}
    </a>`).join('');

  const track = `${CONFIG.music.title} — ${CONFIG.music.artist}`;
  const trackEl = $('#trackText');
  trackEl.textContent = CONFIG.music.src ? track : '— add a song in script.js —';
  if (track.length > 28 && CONFIG.music.src) {
    trackEl.parentElement.classList.add('is-marquee');
    trackEl.innerHTML = `<span>${track}</span>&nbsp;&nbsp;&nbsp;&nbsp;<span>${track}</span>`;
  }

  const audio = $('#bgAudio');
  if (CONFIG.music.src) {
    audio.src = CONFIG.music.src;
    audio.volume = CONFIG.music.defaultVolume;
    $('#volumeSlider').value = CONFIG.music.defaultVolume;
  } else {
    $('#playBtn').disabled = true;
    $('#playBtn').style.opacity = '.4';
    $('#playBtn').style.cursor = 'default';
    $('#volumeSlider').disabled = true;
  }
}

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
   ЭКРАН-ВХОД
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

    const audio = $('#bgAudio');
    if (CONFIG.music.src) {
      audio.play().then(() => setPlayingUI(true)).catch(() => setPlayingUI(false));
    }
    typeTagline();
  }, { once: true });
}

/* =========================================================================
   ЧАСТИЦЫ
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
  if (!prefersReducedMotion) draw(); else draw_static();
  
  function draw_static(){ 
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
  if (isTouch) return;

  // Если указана картинка в конфиге, ставим её и скрываем DOM-курсоры
  if (CONFIG.cursor && CONFIG.cursor.image) {
    const style = document.createElement('style');
    style.innerHTML = `* { cursor: url('${CONFIG.cursor.image}'), auto !important; }`;
    document.head.appendChild(style);
    $('#cursorDot').style.display = 'none';
    $('#cursorRing').style.display = 'none';
    return;
  }

  // Иначе используем стандартный кольцевой курсор изначального дизайна
  if (!CONFIG.effects.cursor) return;
  
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
    if (e.target.closest('a, button, input')) ring.classList.add('is-active');
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest('a, button, input')) ring.classList.remove('is-active');
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
   ГОЛО-РАМКА И НАКЛОН
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
      targetTiltY = px * 14;   
      targetTiltX = -py * 14;  
    });
    card.addEventListener('mouseleave', () => { targetTiltX = 0; targetTiltY = 0; });
  }

  if (prefersReducedMotion) {
    root.style.setProperty('--holo-angle', '0deg');
    return;
  }

  function loop() {
    curTiltX = lerp(curTiltX, targetTiltX, 0.08);
    curTiltY = lerp(curTiltY, targetTiltY, 0.08);
    card.style.transform = `perspective(900px) rotateX(${curTiltX.toFixed(2)}deg) rotateY(${curTiltY.toFixed(2)}deg)`;

    if (CONFIG.effects.holoSpin && !prefersReducedMotion) {
      angle = (angle + 0.15) % 360;
    }
    root.style.setProperty('--holo-angle', (angle + curTiltY * 2).toFixed(1) + 'deg');

    requestAnimationFrame(loop);
  }
  loop();
}

/* =========================================================================
   АУДИО: визуализатор на всю карточку + громкость
   ========================================================================= */
function setupAudio() {
  const audio = $('#bgAudio');
  const btn = $('#playBtn');
  const canvas = $('#waveform');
  const ctx2d = canvas.getContext('2d');
  const volumeSlider = $('#volumeSlider');

  let audioCtx, analyser, dataArray, hasRealData = false;

  function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas(); // Initial size

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
      hasRealData = false; 
    }
  }

  function drawBars(values) {
    ctx2d.clearRect(0, 0, canvas.width, canvas.height);
    const bars = values.length;
    const gap = 4;
    const bw = (canvas.width - gap * (bars - 1)) / bars;
    
    for (let i = 0; i < bars; i++) {
      const v = values[i];
      // Высота бара зависит от высоты карточки
      const bh = Math.max(2, v * canvas.height * 0.4); 
      
      // Градиент для баров
      const gradient = ctx2d.createLinearGradient(0, canvas.height, 0, canvas.height - bh);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.05)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0.3)');
      
      ctx2d.fillStyle = gradient;
      // Рисуем бары снизу вверх
      ctx2d.fillRect(i * (bw + gap), canvas.height - bh, bw, bh);
    }
  }

  function frame(t) {
    const barsCount = 20; 
    if (!audio.paused && hasRealData) {
      analyser.getByteFrequencyData(dataArray);
      const step = Math.floor(dataArray.length / barsCount);
      const vals = Array.from({ length: barsCount }, (_, i) => dataArray[i * step] / 255);
      drawBars(vals);
    } else if (!audio.paused) {
      const vals = Array.from({ length: barsCount }, (_, i) => 0.1 + Math.abs(Math.sin(t / 220 + i)) * 0.4);
      drawBars(vals);
    } else {
      const vals = Array.from({ length: barsCount }, (_, i) => 0.05 + Math.abs(Math.sin(t / 900 + i)) * 0.05);
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

  volumeSlider.addEventListener('input', (e) => {
    audio.volume = e.target.value;
  });

  audio.addEventListener('play', () => { tryInitAnalyser(); if (audioCtx?.state === 'suspended') audioCtx.resume(); });
}

function setPlayingUI(isPlaying) {
  $('#iconPlay').style.display = isPlaying ? 'none' : 'block';
  $('#iconPause').style.display = isPlaying ? 'block' : 'none';
}

let lanyardWs = null;

function initLanyard() {
  if (!CONFIG.profile.discordId || CONFIG.profile.discordId === "ТВОЙ_ДИСКОРД_ID_ЗДЕСЬ") return;

  lanyardWs = new WebSocket("wss://api.lanyard.rest/socket");

  lanyardWs.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    
    // Хендшейк и подписка на ID
    if (msg.op === 1) {
      setInterval(() => {
        if (lanyardWs.readyState === WebSocket.OPEN) {
          lanyardWs.send(JSON.stringify({ op: 3 }));
        }
      }, msg.d.heartbeat_interval);

      lanyardWs.send(JSON.stringify({
        op: 2,
        d: { subscribe_to_id: CONFIG.profile.discordId }
      }));
    } 
    // Получение данных состояния
    else if (msg.op === 0 && (msg.t === "INIT_STATE" || msg.t === "PRESENCE_UPDATE")) {
      updateDiscordPresence(msg.d);
    }
  };

  lanyardWs.onclose = () => {
    setTimeout(initLanyard, 5000); // Авто-реконнект при обрыве
  };
}

function updateDiscordPresence(data) {
  const { discord_user, discord_status, activities } = data;

  if (!discord_user) return;

  // 1. Обновление никнейма (берет Global Name или Username)
  $('#username').textContent = discord_user.global_name || discord_user.username;

  // 2. Живой аватар из Discord
  if (discord_user.avatar) {
    const isGif = discord_user.avatar.startsWith('a_');
    $('#avatar').src = `https://cdn.discordapp.com/avatars/${discord_user.id}/${discord_user.avatar}.${isGif ? 'gif' : 'png'}?size=256`;
  } else {
    // Если аватара нет — ставим дефолтный от Дискорда
    const defaultAvatarIdx = discord_user.discriminator === "0" 
      ? Number(BigInt(discord_user.id) >> 22n) % 6 
      : parseInt(discord_user.discriminator) % 5;
    $('#avatar').src = `https://cdn.discordapp.com/embed/avatars/${defaultAvatarIdx}.png`;
  }

  // 3. Украшение аватара (Avatar Decoration)
  const deco = discord_user.avatar_decoration_data;
  const decoEl = $('#avatarDecoration');
  if (deco && deco.asset) {
    decoEl.src = `https://cdn.discordapp.com/avatar-decorations/${deco.asset}.png`;
    decoEl.style.display = 'block';
  } else {
    decoEl.style.display = 'none';
  }

  // 4. Статус активности (Цвет точки)
  const statusColors = {
    online: "#23a55a",
    idle: "#f0b232",
    dnd: "#f23f43",
    offline: "#80848e"
  };
  const currentStatusColor = statusColors[discord_status] || statusColors.offline;
  $('#statusDot').style.background = currentStatusColor;
  document.documentElement.style.setProperty('--status-color', currentStatusColor);

  // 5. Парсинг активности (Игры, Spotify или кастомный статус)
  const activityEl = $('#discordActivity');
  let activityText = "";

  const gameActivity = activities.find(a => a.type !== 4);
  const customStatus = activities.find(a => a.type === 4);

  if (gameActivity) {
    const verb = gameActivity.type === 2 ? "Слушает" : gameActivity.type === 3 ? "Смотрит" : "Играет в";
    activityText = `${verb} <b>${gameActivity.name}</b>`;
    if (gameActivity.details) activityText += ` — ${gameActivity.details}`;
  } else if (customStatus) {
    const emojiHtml = customStatus.emoji?.id 
      ? `<img src="https://cdn.discordapp.com/emojis/${customStatus.emoji.id}.${customStatus.emoji.animated ? 'gif' : 'png'}" class="activity-emoji">`
      : (customStatus.emoji?.name || "");
    activityText = `${emojiHtml}<span>${customStatus.state || ''}</span>`;
  }

  if (activityText) {
    activityEl.innerHTML = activityText;
    activityEl.style.display = 'inline-flex';
  } else {
    activityEl.style.display = 'none';
  }
}

// Вызываем инициализацию Lanyard в самом конце скрипта или внутри renderProfile
initLanyard();

/* =========================================================================
   ИНИЦИАЛИЗАЦИЯ
   ========================================================================= */
renderProfile();
setupGate();
setupParticles();
setupCursor();
setupTilt();
setupAudio();