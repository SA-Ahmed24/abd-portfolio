/* pixel-fans.js — a live, animated pixel-art stadium crowd.
   Rendered on <canvas> so we can pack hundreds of fans in tiered stands and
   animate them at 60fps (a stadium "wave", idle bob, random cheers, flapping
   flags/scarves). No labels — fans are recognisable by team colours + the
   merch they hold: Pakistan flag, Blue Jays cap, Raptors basketball,
   Liverpool scarf, Federer racket.
*/
(function () {
  const canvas = document.getElementById('stands-canvas');
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext('2d');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- palette ----------
  const SKIN = ['#f2c79a', '#e6b389', '#c8895a', '#9c6233', '#7a4a22'];
  const WOOD = '#7a5326';

  // Teams, weighted so the crowd skews toward Abdullah's sides.
  // prop drives what's drawn in their hands.
  const TEAMS = [
    { id: 'pak',  jersey: '#0b7a3b', shade: '#075c2c', trim: '#ffffff', hair: '#181008', cap: null,       prop: 'flag',   weight: 5 },
    { id: 'jays', jersey: '#1d4f91', shade: '#163e72', trim: '#ffffff', hair: '#181008', cap: '#0a2342',  prop: 'sign',   weight: 4, accent: '#e8112d' },
    { id: 'raps', jersey: '#ce1141', shade: '#a50d34', trim: '#0b0b0b', hair: '#181008', cap: null,       prop: 'ball',   weight: 4 },
    { id: 'lfc',  jersey: '#c8102e', shade: '#9d0c24', trim: '#f6eb61', hair: '#181008', cap: null,       prop: 'scarf',  weight: 3 },
    { id: 'fed',  jersey: '#f4f4f4', shade: '#d8d8d8', trim: '#d52b1e', hair: '#3a2a1a', cap: '#d52b1e',  prop: 'racket', weight: 2 },
  ];

  // ---------- sprite generation ----------
  // Each sprite is drawn on a 16x22 logical grid, pre-rendered to an offscreen
  // canvas at U px/cell, then blitted (scaled) per tier. Two poses (sit/cheer)
  // and two flap frames give us movement without per-frame pixel work.
  const GW = 16, GH = 22, U = 5;
  const spriteCache = {}; // key: id|pose|flap -> canvas

  function makeSprite(team, pose, flap) {
    const c = document.createElement('canvas');
    c.width = GW * U; c.height = GH * U;
    const o = c.getContext('2d');
    const P = (x, y, w, h, col) => { o.fillStyle = col; o.fillRect(x * U, y * U, w * U, h * U); };
    drawFan(P, team, pose, flap);
    return c;
  }

  function drawFan(P, team, pose, flap) {
    const skin = team._skin || SKIN[0];
    const cheer = pose === 'cheer';
    const lift = cheer ? -1 : 0;            // body sits a touch higher when cheering

    // ----- head -----
    if (team.cap) {
      P(5, 6 + lift, 7, 2, team.cap);                 // cap dome
      P(6, 8 + lift, 6, 1, team.cap);
      P(10, 8 + lift, 4, 1, shadeOf(team.cap));       // brim
    } else {
      P(6, 6 + lift, 5, 2, team.hair);                // hair
      P(5, 7 + lift, 1, 2, team.hair);
      P(11, 7 + lift, 1, 2, team.hair);
    }
    P(6, 8 + lift, 5, 4, skin);                        // face
    P(7, 10 + lift, 1, 1, '#241a12');                  // eyes
    P(9, 10 + lift, 1, 1, '#241a12');
    P(7, 13 + lift, 3, 1, skin);                       // neck

    // ----- torso -----
    P(4, 14 + lift, 9, 6, team.jersey);                // body
    P(4, 14 + lift, 9, 1, team.trim);                  // shoulder line
    P(6, 16 + lift, 4, 2, team.shade);                 // crest panel
    P(7, 16 + lift, 2, 2, team.trim);                  // crest

    // ----- arms + prop -----
    const handR = (cheer ? 10 : 11) + lift;            // right-hand row
    const handL = (cheer ? 10 : 17) + lift;            // left-hand row
    // sleeves
    if (cheer) {
      P(3, 12 + lift, 1, 3, team.jersey); P(3, 11 + lift, 1, 1, skin);   // left up
      P(13, 12 + lift, 1, 3, team.jersey); P(13, 11 + lift, 1, 1, skin); // right up
    } else {
      P(3, 15 + lift, 1, 3, team.jersey); P(3, 18 + lift, 1, 1, skin);   // left down
    }

    drawProp(P, team, pose, flap, lift, skin);
  }

  function drawProp(P, team, pose, flap, lift, skin) {
    const cheer = pose === 'cheer';
    const dx = flap ? 1 : 0;
    const dy = flap ? -1 : 0;

    switch (team.prop) {
      case 'flag': {
        const top = (cheer ? 1 : 4) + lift;
        // pole held in right hand
        P(12, top, 1, (cheer ? 13 : 11), WOOD);
        P(12, cheer ? 10 + lift : 12 + lift, 1, 1, skin);   // gripping hand
        if (!cheer) { P(12, 13 + lift, 1, 3, team.jersey); } // forearm to pole
        // flag: white hoist + green field + crescent/star
        const fx = 7 + dx, fy = top + dy;
        P(fx, fy, 5, 5, '#01411c');
        P(fx, fy, 1, 5, '#ffffff');
        P(fx + 2, fy + 1, 2, 1, '#ffffff');               // crescent
        P(fx + 2, fy + 2, 1, 2, '#ffffff');
        P(fx + 4, fy + 1, 1, 1, '#ffffff');               // star
        break;
      }
      case 'scarf': {
        // Liverpool scarf stretched between both hands (overhead when cheering)
        const row = (cheer ? 4 : 12) + lift + (flap ? 0 : 0);
        const xL = cheer ? 2 : 3, xR = cheer ? 13 : 12;
        const wide = xR - xL + 1;
        P(xL, row + (flap ? 1 : 0), wide, 2, team.jersey);
        for (let i = xL; i <= xR; i += 2) P(i, row + (flap ? 1 : 0), 1, 2, team.trim); // stripes
        // hands gripping the ends
        P(xL, row + 2 + (flap ? 1 : 0), 1, 1, skin);
        P(xR, row + 2 + (flap ? 1 : 0), 1, 1, skin);
        if (cheer) { P(3, 5 + lift, 1, 1, skin); P(13, 5 + lift, 1, 1, skin); }
        break;
      }
      case 'ball': {
        // basketball held up in right hand
        const cx = cheer ? 8 : 12, cy = (cheer ? 3 : 8) + lift;
        const O = '#e8772b';
        P(cx - 1, cy, 4, 1, O); P(cx - 2, cy + 1, 6, 3, O); P(cx - 1, cy + 4, 4, 1, O);
        P(cx, cy, 1, 5, '#7a3d12');               // seam vertical
        P(cx - 2, cy + 2, 6, 1, '#7a3d12');       // seam horizontal
        if (cheer) P(8, 6 + lift, 1, 1, skin); else P(12, cy + 5, 1, 1, skin);
        break;
      }
      case 'racket': {
        // tennis racket raised
        const hx = cheer ? 8 : 13, hy = (cheer ? 2 : 5) + lift;
        // head (oval-ish)
        P(hx - 1, hy, 3, 1, '#1a1a1a'); P(hx - 2, hy + 1, 5, 3, '#1a1a1a');
        P(hx - 1, hy + 1, 3, 2, team.trim === '#d52b1e' ? '#ffffff' : '#ffffff'); // string bed (white)
        P(hx, hy + 1, 1, 2, '#c9c9c9'); P(hx - 1, hy + 2, 3, 1, '#c9c9c9');       // strings
        P(hx - 1, hy + 4, 3, 1, '#1a1a1a');
        // handle
        P(hx, hy + 4, 1, cheer ? 6 : 6, WOOD);
        if (cheer) P(8, 8 + lift, 1, 1, skin); else P(13, 11 + lift, 1, 1, skin);
        break;
      }
      case 'sign':
      default: {
        // rally placard with team accent
        const sx = cheer ? 9 : 11, sy = (cheer ? 2 : 6) + lift;
        P(sx, sy, 6, 5, '#ffffff');
        P(sx, sy, 6, 1, team.jersey); P(sx, sy + 4, 6, 1, team.jersey);
        P(sx, sy, 1, 5, team.jersey); P(sx + 5, sy, 1, 5, team.jersey);
        P(sx + 2, sy + 2, 2, 1, team.accent || team.jersey);   // mark
        if (cheer) P(8, 7 + lift, 1, 1, skin); else { P(11, sy + 5, 1, 1, skin); P(12, sy + 5, 1, 1, skin); }
        break;
      }
    }
  }

  function shadeOf(hex) {
    const n = parseInt(hex.slice(1), 16);
    const r = Math.max(0, ((n >> 16) & 255) - 40);
    const g = Math.max(0, ((n >> 8) & 255) - 40);
    const b = Math.max(0, (n & 255) - 40);
    return `rgb(${r},${g},${b})`;
  }

  function getSprite(team, pose, flap) {
    const key = `${team._skinKey}|${team.id}|${pose}|${flap ? 1 : 0}`;
    if (!spriteCache[key]) spriteCache[key] = makeSprite(team, pose, flap);
    return spriteCache[key];
  }

  // ---------- crowd layout ----------
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let W = 0, H = 0;
  let fans = [];
  let bg = null;       // pre-rendered stadium structure
  const ROWS = 9;

  function pickTeam() {
    const total = TEAMS.reduce((s, t) => s + t.weight, 0);
    let r = Math.random() * total;
    for (const t of TEAMS) { if ((r -= t.weight) <= 0) return t; }
    return TEAMS[0];
  }

  function layout() {
    const cssW = canvas.parentElement.clientWidth || 900;
    W = cssW;
    H = Math.round(Math.max(300, Math.min(470, cssW * 0.36)));
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = false;

    buildFans();
    bg = renderStructure();
  }

  function buildFans() {
    fans = [];
    const topPad = H * 0.20;            // roof + lights area
    const bottomPad = H * 0.10;         // front hoarding + field
    const deck = H - topPad - bottomPad;

    for (let r = 0; r < ROWS; r++) {
      const f = r / (ROWS - 1);                 // 0 back .. 1 front
      const scale = lerp(0.52, 1.0, f);
      const fh = scale * (H * 0.16);            // fan height in px
      const fw = fh * (GW / GH);
      const y = topPad + Math.pow(f, 1.18) * deck;   // perspective: rows bunch at back
      const step = fw * 0.82;
      const stagger = (r % 2) * step * 0.5;
      const n = Math.ceil(W / step) + 2;
      for (let i = 0; i < n; i++) {
        const team = pickTeam();
        const sk = (Math.random() * SKIN.length) | 0;
        const t = Object.create(team);
        t._skin = SKIN[sk]; t._skinKey = sk;
        fans.push({
          team: t, x: i * step - step + stagger, y, fw, fh,
          row: r, depth: f,
          phase: Math.random() * Math.PI * 2,
          bob: lerp(1.4, 3.2, f) * scale,
          alpha: lerp(0.62, 1, f),
          nextJump: 1500 + Math.random() * 12000,
          jumpAt: -1,
          flapPhase: Math.random() * 1000,
        });
      }
    }
    // paint back-to-front (already in row order)
  }

  // Pre-render the stands architecture once per layout.
  function renderStructure() {
    const c = document.createElement('canvas');
    c.width = canvas.width; c.height = canvas.height;
    const o = c.getContext('2d');
    o.setTransform(dpr, 0, 0, dpr, 0, 0);

    // night sky / arena gradient
    const sky = o.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, '#0a1a2a');
    sky.addColorStop(0.45, '#102a44');
    sky.addColorStop(1, '#0c1f33');
    o.fillStyle = sky; o.fillRect(0, 0, W, H);

    // floodlight glows from top corners
    [0.12, 0.88].forEach((fx) => {
      const g = o.createRadialGradient(W * fx, -10, 4, W * fx, -10, H * 0.9);
      g.addColorStop(0, 'rgba(255,247,214,0.22)');
      g.addColorStop(1, 'rgba(255,247,214,0)');
      o.fillStyle = g; o.fillRect(0, 0, W, H);
    });

    // roof beam
    o.fillStyle = '#0a141f'; o.fillRect(0, 0, W, H * 0.07);
    o.fillStyle = '#1c3144'; o.fillRect(0, H * 0.07 - 3, W, 3);
    // floodlight rigs
    [0.12, 0.88].forEach((fx) => {
      const px = W * fx;
      o.fillStyle = '#22384c'; o.fillRect(px - 26, H * 0.025, 52, 7);
      for (let i = 0; i < 6; i++) {
        o.fillStyle = i % 2 ? '#fff7d6' : '#ffe9a8';
        o.fillRect(px - 24 + i * 8, H * 0.028, 6, 4);
      }
    });

    // raked seating deck — banded tiers, darker at back
    const topPad = H * 0.20, bottomPad = H * 0.10, deck = H - topPad - bottomPad;
    for (let r = 0; r < ROWS; r++) {
      const f = r / (ROWS - 1);
      const y = topPad + Math.pow(f, 1.18) * deck;
      const bandH = lerp(deck / ROWS * 0.7, deck / ROWS * 1.15, f);
      const base = Math.round(lerp(22, 52, f));
      o.fillStyle = `rgb(${base},${base + 10},${base + 22})`;
      o.fillRect(0, y - bandH * 0.1, W, bandH + 2);
      // seat highlight line
      o.fillStyle = 'rgba(255,255,255,0.05)';
      o.fillRect(0, y - bandH * 0.1, W, 1);
      // aisle steps
      o.fillStyle = 'rgba(0,0,0,0.22)';
      const aisleStep = W / 7;
      for (let a = aisleStep * 0.5; a < W; a += aisleStep) o.fillRect(a, y - bandH * 0.1, 2, bandH);
    }

    // atmospheric haze toward the back
    const haze = o.createLinearGradient(0, topPad, 0, topPad + deck * 0.6);
    haze.addColorStop(0, 'rgba(12,28,46,0.55)');
    haze.addColorStop(1, 'rgba(12,28,46,0)');
    o.fillStyle = haze; o.fillRect(0, 0, W, H);

    return c;
  }

  // front hoarding (advertising boards) + field strip, drawn over the fans
  function renderForeground(o) {
    const y = H * 0.90;
    o.fillStyle = '#0b1622'; o.fillRect(0, y, W, H - y);
    // ad boards in team colours
    const cols = ['#0b7a3b', '#1d4f91', '#ce1141', '#c8102e', '#e8b923'];
    const bw = W / 14;
    for (let i = 0, x = 0; x < W; i++, x += bw) {
      o.fillStyle = cols[i % cols.length];
      o.fillRect(x + 2, y + 4, bw - 4, (H - y) * 0.46);
    }
    o.fillStyle = 'rgba(255,255,255,0.08)'; o.fillRect(0, y + 3, W, 1);
    // sliver of green field
    o.fillStyle = '#15572b'; o.fillRect(0, y + (H - y) * 0.5 + 4, W, (H - y) * 0.5);
    o.fillStyle = 'rgba(255,255,255,0.10)'; o.fillRect(0, y + (H - y) * 0.5 + 4, W, 1);
  }

  // ---------- animation ----------
  const WAVE_PERIOD = 5200;      // ms for the wave to cross
  const WAVE_GAP = 3200;         // ms pause between waves
  const WAVE_WIDTH = 0.16;       // fraction of width that's "standing"

  function frame(now) {
    ctx.clearRect(0, 0, W, H);
    if (bg) ctx.drawImage(bg, 0, 0, W, H);

    const cycle = WAVE_PERIOD + WAVE_GAP;
    const tw = now % cycle;
    const waveActive = tw < WAVE_PERIOD;
    const waveX = waveActive ? lerp(-0.1, 1.1, tw / WAVE_PERIOD) * W : -9999;

    for (const fan of fans) {
      // idle bob
      let yOff = reduceMotion ? 0 : Math.sin(now / 520 + fan.phase) * fan.bob;

      // stadium wave — fans near waveX stand & jump
      let pose = 'sit';
      if (!reduceMotion && waveActive) {
        const d = Math.abs((fan.x + fan.fw / 2) - waveX) / W;
        if (d < WAVE_WIDTH) {
          const k = Math.cos((d / WAVE_WIDTH) * (Math.PI / 2)); // 1 at centre
          yOff -= k * fan.fh * 0.42;
          if (k > 0.35) pose = 'cheer';
        }
      }

      // occasional independent cheer
      if (!reduceMotion) {
        if (fan.jumpAt < 0 && now > fan.nextJump) { fan.jumpAt = now; }
        if (fan.jumpAt > 0) {
          const dt = now - fan.jumpAt;
          if (dt > 650) { fan.jumpAt = -1; fan.nextJump = now + 6000 + Math.random() * 14000; }
          else { const k = Math.sin((dt / 650) * Math.PI); yOff -= k * fan.fh * 0.3; if (k > 0.4) pose = 'cheer'; }
        }
      }

      const flap = reduceMotion ? 0 : (Math.floor((now + fan.flapPhase) / 260) % 2);
      const sprite = getSprite(fan.team, pose, flap);

      ctx.globalAlpha = fan.alpha;
      const drawW = fan.fw, drawH = fan.fh;
      ctx.drawImage(sprite, Math.round(fan.x), Math.round(fan.y - drawH + yOff), Math.round(drawW), Math.round(drawH));
    }
    ctx.globalAlpha = 1;

    renderForeground(ctx);

    if (!reduceMotion) rafId = requestAnimationFrame(frame);
  }

  // ---------- helpers ----------
  function lerp(a, b, t) { return a + (b - a) * t; }

  // ---------- boot ----------
  let rafId = null;
  function start() {
    layout();
    if (rafId) cancelAnimationFrame(rafId);
    if (reduceMotion) { frame(0); }        // single static paint
    else rafId = requestAnimationFrame(frame);
  }

  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(start, 200);
  });

  // Defer first paint until the stands scroll into view (saves CPU; also the
  // parent starts hidden via the reveal animation so width could read 0).
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { start(); io.disconnect(); }
      });
    }, { rootMargin: '200px' });
    io.observe(canvas.parentElement);
  } else {
    start();
  }
})();
