/* f1-grid.js — F1 starting-grid: a periodic start-lights sequence plus ambient
   top-down pixel-art cars that fly by, overtake near the line, or duck into a
   pit box and launch back out. All canvas-rendered at 60fps over the asphalt;
   cars are pre-baked sprites (one offscreen canvas per livery) blitted each
   frame. Timing is driven off rAF timestamps so nothing drifts, and events fire
   at bursty random intervals (~3–30s) so it never feels metronomic.
*/
(function () {
  // ---------- DOM contract ----------
  const stage  = document.getElementById('f1-grid-stage');
  const canvas = document.getElementById('f1-grid-canvas');
  if (!stage || !canvas || !canvas.getContext) return;
  const ctx = canvas.getContext('2d');
  const asphalt = canvas.parentElement;          // .f1grid-asphalt — our sizing box
  if (!asphalt) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const lightsWrap = document.getElementById('f1-lights');
  const lightEls   = lightsWrap ? Array.from(lightsWrap.querySelectorAll('.f1grid-light')) : [];
  const statusEl   = document.getElementById('f1grid-status');
  const pitEls     = [
    document.getElementById('f1-pit-1'),
    document.getElementById('f1-pit-2'),
    document.getElementById('f1-pit-3'),
  ].filter(Boolean);

  // ---------- liveries ----------
  // Top-down F1 cars on a ~22x12 grid. Colours chosen to sit on a cream/green/
  // gold pixel site: a Pakistan-green car, a gold car, plus classic red/blue/teal.
  // num is a 0–9 nybble stamped on the nose.
  const LIVERIES = [
    { id: 'pak',  body: '#01411c', accent: '#e8e8e8', trim: '#0a6b2e', num: 7 }, // Pakistan green
    { id: 'gold', body: '#e8b923', accent: '#3a2c00', trim: '#c89a10', num: 1 }, // gold
    { id: 'red',  body: '#c8102e', accent: '#ffffff', trim: '#9d0c24', num: 3 }, // classic red
    { id: 'blue', body: '#1d4f91', accent: '#e8b923', trim: '#163e72', num: 5 }, // royal blue
    { id: 'teal', body: '#0f8a8a', accent: '#06343f', trim: '#0b6c6c', num: 9 }, // teal
    { id: 'crm',  body: '#d8c9a8', accent: '#01411c', trim: '#b8a87e', num: 4 }, // cream
  ];

  const TYRE = '#1a1a1a', HUB = '#cfcfcf';

  // ---------- sprite generation ----------
  // Each livery is pre-rendered to an offscreen canvas at U px/cell. Cars only
  // travel horizontally, so one sprite (nose pointing right) is all we need;
  // the lane-shift during overtakes is handled by moving y, not rotating.
  const GW = 22, GH = 12;
  let U = 5;                                  // cell size in px, set in layout()
  const spriteCache = {};                     // key: id|U -> canvas

  // 3x5 pixel digits for the car number nybble.
  const DIGITS = {
    0: ['111', '101', '101', '101', '111'],
    1: ['010', '110', '010', '010', '111'],
    2: ['111', '001', '111', '100', '111'],
    3: ['111', '001', '111', '001', '111'],
    4: ['101', '101', '111', '001', '001'],
    5: ['111', '100', '111', '001', '111'],
    6: ['111', '100', '111', '101', '111'],
    7: ['111', '001', '010', '010', '010'],
    8: ['111', '101', '111', '101', '111'],
    9: ['111', '101', '111', '001', '111'],
  };

  function makeSprite(liv) {
    const c = document.createElement('canvas');
    c.width = GW * U; c.height = GH * U;
    const o = c.getContext('2d');
    o.imageSmoothingEnabled = false;
    const P = (x, y, w, h, col) => { o.fillStyle = col; o.fillRect(x * U, y * U, w * U, h * U); };
    drawCar(P, liv);
    return c;
  }

  // Nose at the right (x≈21), gearbox/rear wing at the left (x≈0).
  function drawCar(P, liv) {
    // ----- tyres (drawn first, behind the body) -----
    // front pair near the nose, rear pair near the gearbox
    const tyres = [[15, 0], [15, 9], [3, 0], [3, 9]];
    tyres.forEach(([tx, ty]) => {
      P(tx, ty, 4, 3, TYRE);
      P(tx + 1, ty + 1, 2, 1, HUB);          // hub cap
    });

    // ----- floor / sidepods (a darker base the body sits on) -----
    P(4, 3, 14, 6, liv.trim);

    // ----- monocoque body -----
    P(6, 4, 11, 4, liv.body);                  // main tub
    P(17, 5, 3, 2, liv.body);                  // nose taper toward the cone
    P(20, 5, 1, 2, liv.accent);                // nose tip
    P(2, 4, 4, 4, liv.body);                   // engine cover / shark fin base

    // ----- cockpit + halo -----
    P(9, 5, 3, 2, '#0c0c0c');                  // cockpit hole
    P(10, 4, 1, 1, liv.trim);                  // halo front hoop
    P(12, 5, 1, 2, '#202020');                 // halo central strut

    // ----- accent stripe down the spine -----
    P(4, 6, 13, 1, liv.accent);

    // ----- front wing (just ahead of the front tyres, full width) -----
    P(18, 0, 2, 2, liv.trim); P(18, 10, 2, 2, liv.trim);
    P(19, 1, 2, 1, liv.accent); P(19, 10, 2, 1, liv.accent);

    // ----- rear wing (behind the gearbox) -----
    P(0, 1, 2, 10, liv.trim);
    P(0, 2, 1, 8, liv.accent);

    // ----- number nybble on the nose -----
    const glyph = DIGITS[liv.num] || DIGITS[0];
    for (let r = 0; r < glyph.length; r++) {
      for (let cI = 0; cI < glyph[r].length; cI++) {
        if (glyph[r][cI] === '1') P(13 + cI, 4 + r, 1, 1, liv.accent);
      }
    }
  }

  function getSprite(liv) {
    const key = `${liv.id}|${U}`;
    if (!spriteCache[key]) spriteCache[key] = makeSprite(liv);
    return spriteCache[key];
  }

  // ---------- layout ----------
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let W = 0, H = 0;
  let carH = 0, carW = 0;                       // sprite draw size in css px
  let laneY = [0, 0];                           // centre-y of the two lanes
  let pitTargets = [];                          // {x,y} of each pit box in canvas px

  function layout() {
    W = asphalt.clientWidth || 900;
    H = asphalt.clientHeight || 200;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = false;

    // car height ~18% of asphalt height; derive the sprite cell size from it.
    carH = Math.max(18, Math.round(H * 0.18));
    U = Math.max(2, Math.round(carH / GH));
    carH = U * GH;
    carW = U * GW;
    for (const k in spriteCache) delete spriteCache[k];   // re-bake at new U

    // two racing lanes (top / bottom thirds), leaving room to shift between them
    laneY = [Math.round(H * 0.33), Math.round(H * 0.66)];

    computePitTargets();
  }

  // Pit-box centres expressed in canvas/asphalt CSS px (recomputed on layout).
  function computePitTargets() {
    pitTargets = [];
    const base = asphalt.getBoundingClientRect();
    pitEls.forEach((el) => {
      const r = el.getBoundingClientRect();
      pitTargets.push({
        x: (r.left - base.left) + r.width / 2,
        y: (r.top - base.top) + r.height / 2,
      });
    });
  }

  // ---------- cars ----------
  // A car carries its own little behaviour script; tick() advances it and
  // returns false once it has left the stage so the loop can drop it.
  let cars = [];
  const MAX_CARS = 4;

  function pickLivery() { return LIVERIES[(Math.random() * LIVERIES.length) | 0]; }

  function makeCar(opts) {
    return Object.assign({
      liv: pickLivery(),
      x: -carW, y: laneY[0],
      vx: 0, dir: 1,
      kind: 'flyby',
      // pit state
      phase: 'run', targetX: 0, targetY: 0, startX: 0, startY: 0, t: 0, dur: 0, waitUntil: 0,
      shimmer: true,
    }, opts);
  }

  // event: a single car blasts across in one lane (occasionally right→left).
  function spawnFlyby() {
    const rev = Math.random() < 0.18;
    const lane = (Math.random() * 2) | 0;
    const speed = lerp(0.34, 0.52, Math.random()) * (W / 60);   // px/frame-ish, scaled to width
    cars.push(makeCar({
      kind: 'flyby',
      dir: rev ? -1 : 1,
      x: rev ? W + carW : -carW,
      y: laneY[lane],
      vx: rev ? -speed : speed,
    }));
  }

  // event: leader + a faster car that lane-shifts to pass near the line.
  function spawnOvertake() {
    const baseSpeed = lerp(0.30, 0.40, Math.random()) * (W / 60);
    const leadLane = (Math.random() * 2) | 0;
    const chaseLane = leadLane ^ 1;
    // leader (slower, slightly ahead)
    cars.push(makeCar({
      kind: 'flyby', dir: 1, x: -carW * 0.2, y: laneY[leadLane], vx: baseSpeed,
    }));
    // overtaker (faster, behind, will slide into the leader's lane mid-stage)
    cars.push(makeCar({
      kind: 'overtake', dir: 1, x: -carW * 2.4, y: laneY[chaseLane],
      vx: baseSpeed * 1.55, targetY: laneY[leadLane], startY: laneY[chaseLane],
    }));
  }

  // event: a car enters, eases off, curves into a pit box, waits, then launches.
  function spawnPit() {
    if (!pitTargets.length) { spawnFlyby(); return; }
    const pit = pitTargets[(Math.random() * pitTargets.length) | 0];
    const lane = pit.y < H / 2 ? 0 : 1;
    cars.push(makeCar({
      kind: 'pit', dir: 1, x: -carW, y: laneY[lane],
      vx: lerp(0.30, 0.42, Math.random()) * (W / 60),
      phase: 'approach', targetX: pit.x, targetY: pit.y,
    }));
  }

  function tickCar(car, now) {
    if (car.kind === 'pit') return tickPit(car, now);

    // overtaker eases laterally into the leader's lane around mid-stage
    if (car.kind === 'overtake' && car.y !== car.targetY) {
      const k = clamp((car.x - W * 0.30) / (W * 0.30), 0, 1);
      car.y = Math.round(lerp(car.startY, car.targetY, ease(k)));
    }
    car.x += car.vx;
    return car.x > -carW * 1.2 && car.x < W + carW * 1.2;
  }

  // Multi-phase pit stop: approach → decelerate/curve in → wait → launch out.
  function tickPit(car, now) {
    switch (car.phase) {
      case 'approach': {
        car.x += car.vx;
        if (car.x >= car.targetX - carW * 2.2) {
          car.phase = 'enter';
          car.startX = car.x; car.startY = car.y;
          car.t = now; car.dur = 900;
          car.shimmer = false;
        }
        break;
      }
      case 'enter': {                          // ease along a curve into the box
        const k = clamp((now - car.t) / car.dur, 0, 1);
        const e = ease(k);
        car.x = Math.round(lerp(car.startX, car.targetX, e));
        car.y = Math.round(lerp(car.startY, car.targetY, e));
        if (k >= 1) { car.phase = 'wait'; car.waitUntil = now + 1000 + Math.random() * 600; }
        break;
      }
      case 'wait': {
        if (now >= car.waitUntil) {
          car.phase = 'launch';
          car.startX = car.x; car.startY = car.y;
          car.t = now; car.dur = 850;
          car.shimmer = true;
        }
        break;
      }
      case 'launch': {                         // accelerate back onto the lane
        const k = clamp((now - car.t) / car.dur, 0, 1);
        car.x = Math.round(lerp(car.startX, car.startX + carW * 2.2, ease(k)));
        car.y = Math.round(lerp(car.startY, laneY[car.startY < H / 2 ? 0 : 1], ease(k)));
        if (k >= 1) { car.phase = 'run'; car.vx = lerp(0.42, 0.58, Math.random()) * (W / 60); }
        break;
      }
      default:                                 // 'run' — blast out to the right
        car.x += car.vx;
    }
    return car.x < W + carW * 1.2;
  }

  function drawCar2D(car) {
    const sprite = getSprite(car.liv);
    const x = Math.round(car.x);
    const y = Math.round(car.y - carH / 2);

    // speed shimmer streaks trailing a fast-moving car
    if (car.shimmer && !reduceMotion && Math.abs(car.vx) > 0.2) {
      ctx.globalAlpha = 0.22;
      ctx.fillStyle = '#ffffff';
      const back = car.dir > 0 ? x - U : x + carW;
      for (let i = 0; i < 3; i++) {
        const sy = y + U + i * Math.round(carH / 3);
        ctx.fillRect(car.dir > 0 ? back - i * U * 2 : back + i * U * 2, sy, U * 2, Math.max(1, Math.round(U / 2)));
      }
      ctx.globalAlpha = 1;
    }

    // flip horizontally for the rare right→left flyby
    if (car.dir < 0) {
      ctx.save();
      ctx.translate(x + carW, y);
      ctx.scale(-1, 1);
      ctx.drawImage(sprite, 0, 0, carW, carH);
      ctx.restore();
    } else {
      ctx.drawImage(sprite, x, y, carW, carH);
    }
  }

  // ---------- start-lights sequence ----------
  // Driven off the rAF clock. A sequence: columns 1→5 light one at a time, hold,
  // then all snap dark on "lights out" (which also launches a couple of cars).
  let seqPhase = 'idle';      // idle | building | hold | out | green
  let seqAt = 0;              // timestamp the current phase/step started
  let litCount = 0;          // columns currently lit during 'building'
  let holdDur = 0;
  let nextSeqAt = 0;         // when the next whole sequence may begin

  const STEP_MS = 950;        // gap between each column lighting

  function setLights(n) {
    lightEls.forEach((el, i) => { el.dataset.lit = i < n ? '1' : '0'; });
  }
  function setStatus(txt) { if (statusEl) statusEl.textContent = txt; }

  function startSequence(now) {
    seqPhase = 'building';
    seqAt = now;
    litCount = 0;
    setLights(0);
    setStatus('FORMATION');
  }

  function tickLights(now) {
    switch (seqPhase) {
      case 'building': {
        const want = Math.min(5, Math.floor((now - seqAt) / STEP_MS) + 1);
        if (want !== litCount) { litCount = want; setLights(litCount); setStatus('LIGHTS'); }
        if (litCount >= 5) {
          seqPhase = 'hold';
          seqAt = now;
          holdDur = 800 + Math.random() * 1700;   // real-F1 suspense
        }
        break;
      }
      case 'hold':
        if (now - seqAt >= holdDur) {
          seqPhase = 'out';
          seqAt = now;
          setLights(0);
          setStatus('LIGHTS OUT');
          launchStart();                          // tie the cars to the lights
        }
        break;
      case 'out':
        if (now - seqAt >= 700) { seqPhase = 'green'; seqAt = now; setStatus('RACING'); }
        break;
      case 'green':
        if (now - seqAt >= 1400) {
          setStatus('GREEN');
          seqPhase = 'idle';
          nextSeqAt = now + 12000 + Math.random() * 6000;   // next sequence in ~12–18s
        }
        break;
      default:                                    // idle — wait for the next window
        if (now >= nextSeqAt) startSequence(now);
    }
  }

  // Lights-out launch: a couple of cars accelerating off the line together.
  function launchStart() {
    const n = Math.random() < 0.5 ? 2 : 1;
    for (let i = 0; i < n && cars.length < MAX_CARS; i++) {
      const speed = lerp(0.40, 0.56, Math.random()) * (W / 60);
      cars.push(makeCar({ kind: 'flyby', dir: 1, x: -carW - i * carW * 1.3, y: laneY[i % 2], vx: speed }));
    }
  }

  // ---------- random event scheduler ----------
  // Independent of the lights; fires bursty (3–30s) flyby/overtake/pit events.
  let nextEventAt = 0;

  function scheduleNext(now) {
    nextEventAt = now + 3000 + Math.random() * 27000;     // ~3–30s, varied
  }

  function fireEvent() {
    if (cars.length >= MAX_CARS) return;
    const r = Math.random();
    if (r < 0.5) spawnFlyby();
    else if (r < 0.8) { if (cars.length <= MAX_CARS - 2) spawnOvertake(); else spawnFlyby(); }
    else spawnPit();
  }

  // ---------- animation loop ----------
  let rafId = null;

  function frame(now) {
    ctx.clearRect(0, 0, W, H);

    tickLights(now);

    if (now >= nextEventAt) { fireEvent(); scheduleNext(now); }

    cars = cars.filter((car) => tickCar(car, now));
    for (const car of cars) drawCar2D(car);

    rafId = requestAnimationFrame(frame);
  }

  // ---------- helpers ----------
  function lerp(a, b, t) { return a + (b - a) * t; }
  function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }
  function ease(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; } // ease-in-out

  // Static paint for reduced-motion: a couple of cars parked on the grid, dark lights.
  function paintStatic() {
    ctx.clearRect(0, 0, W, H);
    setLights(0);
    setStatus('GRID');
    const a = makeCar({ liv: LIVERIES[0], x: Math.round(W * 0.30), y: laneY[0], vx: 0, shimmer: false });
    const b = makeCar({ liv: LIVERIES[1], x: Math.round(W * 0.55), y: laneY[1], vx: 0, shimmer: false });
    drawCar2D(a); drawCar2D(b);
  }

  // ---------- boot ----------
  function start() {
    layout();
    if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
    if (reduceMotion) { paintStatic(); return; }   // no rAF loop, no timers

    const now = performance.now();
    cars = [];
    seqPhase = 'idle';
    nextSeqAt = now + 3500;        // first sequence a few seconds in, so users see it
    scheduleNext(now);
    rafId = requestAnimationFrame(frame);
  }

  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(start, 200);
  });

  // Defer until the grid scrolls into view (saves CPU; parent may read 0 width
  // while hidden behind the reveal animation).
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { start(); io.disconnect(); }
      });
    }, { rootMargin: '200px' });
    io.observe(stage);
  } else {
    start();
  }
})();

/* ---------- grid-slot cards: click / tap / keyboard to pin open ----------
   Hover + :focus-visible reveal is pure CSS; this adds tap-to-open on touch
   and Enter/Space, and keeps one card "pinned" at a time. */
(function () {
  const slots = Array.from(document.querySelectorAll('.f1grid-slot'));
  if (!slots.length) return;

  function toggle(slot) {
    const willOpen = !slot.classList.contains('is-open');
    slots.forEach((s) => s.classList.remove('is-open'));
    if (willOpen) slot.classList.add('is-open');
  }

  slots.forEach((slot) => {
    slot.addEventListener('click', () => toggle(slot));
    slot.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        toggle(slot);
      }
    });
  });

  // click outside any slot closes the pinned card
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.f1grid-slot')) {
      slots.forEach((s) => s.classList.remove('is-open'));
    }
  });
})();
