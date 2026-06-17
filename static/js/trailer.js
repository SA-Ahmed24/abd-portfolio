/* trailer.js — a clickable "movie trailer" player for project promo videos.
   Click to play/pause, scrub bar, mute/unmute, and an expand-to-cinema modal
   (~3/4 of the screen, backdrop still partly visible). Controls are injected
   so the template markup stays minimal. */
(function () {
  const ICON = {
    play: '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>',
    pause: '<svg viewBox="0 0 24 24"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>',
    volOn: '<svg viewBox="0 0 24 24"><path d="M3 10v4h4l5 4V6L7 10H3z"/><path d="M16 8.5a4 4 0 010 7" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
    volOff: '<svg viewBox="0 0 24 24"><path d="M3 10v4h4l5 4V6L7 10H3z"/><path d="M16 9l5 6m0-6l-5 6" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
    expand: '<svg viewBox="0 0 24 24"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" fill="none" stroke="currentColor" stroke-width="2.2"/></svg>',
  };

  function fmt(t) {
    if (!isFinite(t)) return '0:00';
    const m = Math.floor(t / 60), s = Math.floor(t % 60);
    return m + ':' + String(s).padStart(2, '0');
  }

  // single shared modal
  let modal, modalInner, placeholder = null, activeTrailer = null;
  function buildModal() {
    modal = document.createElement('div');
    modal.className = 'trailer-modal';
    modalInner = document.createElement('div');
    modalInner.className = 'trailer-modal__inner';
    const close = document.createElement('button');
    close.className = 'trailer-modal__close';
    close.setAttribute('aria-label', 'Close');
    close.innerHTML = '&times;';
    close.addEventListener('click', closeModal);
    modal.appendChild(modalInner);
    modal.appendChild(close);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    document.body.appendChild(modal);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal(); });
  }
  function openModal(trailer) {
    if (!modal) buildModal();
    placeholder = document.createComment('trailer-slot');
    trailer.parentNode.insertBefore(placeholder, trailer);
    modalInner.appendChild(trailer);
    modal.classList.add('is-open');
    document.body.classList.add('trailer-open');
    activeTrailer = trailer;
    const v = trailer.querySelector('.trailer__video');
    if (v && v.paused) v.play().catch(() => {});
  }
  function closeModal() {
    if (!activeTrailer) return;
    if (placeholder && placeholder.parentNode) {
      placeholder.parentNode.insertBefore(activeTrailer, placeholder);
      placeholder.remove();
    }
    modal.classList.remove('is-open');
    document.body.classList.remove('trailer-open');
    activeTrailer = null;
  }

  function setup(trailer) {
    const video = trailer.querySelector('.trailer__video');
    const screen = trailer.querySelector('.trailer__screen');
    if (!video || !screen) return;

    // overlays
    const vig = document.createElement('div'); vig.className = 'trailer__vignette'; screen.appendChild(vig);
    const big = document.createElement('button'); big.className = 'trailer__big'; big.setAttribute('aria-label', 'Play'); big.innerHTML = ICON.play; screen.appendChild(big);

    // controls
    const controls = document.createElement('div'); controls.className = 'trailer__controls';
    const pp = document.createElement('button'); pp.className = 'trailer__btn t-pp'; pp.innerHTML = ICON.play; pp.setAttribute('aria-label', 'Play / pause');
    const scrub = document.createElement('div'); scrub.className = 'trailer__scrub';
    const fill = document.createElement('div'); fill.className = 'trailer__fill'; scrub.appendChild(fill);
    const time = document.createElement('span'); time.className = 'trailer__time'; time.textContent = '0:00 / 0:00';
    const mute = document.createElement('button'); mute.className = 'trailer__btn t-mute'; mute.innerHTML = video.muted ? ICON.volOff : ICON.volOn; mute.setAttribute('aria-label', 'Mute / unmute');
    const expand = document.createElement('button'); expand.className = 'trailer__btn t-expand'; expand.innerHTML = ICON.expand; expand.setAttribute('aria-label', 'Expand');
    controls.append(pp, scrub, time, mute, expand);
    trailer.appendChild(controls);

    const toggle = () => { if (video.paused) video.play().catch(() => {}); else video.pause(); };
    screen.addEventListener('click', toggle);
    big.addEventListener('click', (e) => { e.stopPropagation(); toggle(); });
    pp.addEventListener('click', toggle);

    video.addEventListener('play', () => { trailer.classList.add('is-playing'); pp.innerHTML = ICON.pause; big.innerHTML = ICON.pause; });
    video.addEventListener('pause', () => { trailer.classList.remove('is-playing'); pp.innerHTML = ICON.play; big.innerHTML = ICON.play; });
    const updTime = () => {
      const d = video.duration || 0;
      fill.style.width = (d ? (video.currentTime / d) * 100 : 0) + '%';
      time.textContent = fmt(video.currentTime) + ' / ' + fmt(d);
    };
    video.addEventListener('timeupdate', updTime);
    video.addEventListener('loadedmetadata', updTime);

    const seek = (clientX) => {
      const r = scrub.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
      if (video.duration) video.currentTime = p * video.duration;
    };
    scrub.addEventListener('click', (e) => { e.stopPropagation(); seek(e.clientX); });
    let dragging = false;
    scrub.addEventListener('pointerdown', (e) => { dragging = true; seek(e.clientX); });
    window.addEventListener('pointermove', (e) => { if (dragging) seek(e.clientX); });
    window.addEventListener('pointerup', () => { dragging = false; });

    mute.addEventListener('click', (e) => {
      e.stopPropagation();
      video.muted = !video.muted;
      mute.innerHTML = video.muted ? ICON.volOff : ICON.volOn;
    });
    expand.addEventListener('click', (e) => { e.stopPropagation(); openModal(trailer); });

    if (video.readyState >= 1) updTime();
  }

  function init() {
    document.querySelectorAll('[data-trailer]').forEach(setup);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
