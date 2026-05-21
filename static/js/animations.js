/* animations.js — GSAP scroll-triggered animations */
(function() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.warn('GSAP not loaded — skipping animations');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  /* Reveal animations for any element with data-reveal */
  document.querySelectorAll('[data-reveal]').forEach((el) => {
    gsap.fromTo(el,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      }
    );
  });

  /* Hero name — letter-by-letter (only if we haven't already) */
  const heroName = document.querySelector('.hero-name');
  if (heroName && !heroName.dataset.animated) {
    heroName.dataset.animated = '1';
    // Splitting text is heavy — instead, do a clean slide-in-from-left
    gsap.fromTo(heroName,
      { x: -40, opacity: 0 },
      { x: 0, opacity: 1, duration: 1.2, delay: 0.2, ease: 'power3.out' }
    );
  }

  /* Bismillah subtle fade */
  const bism = document.querySelector('.bismillah-line');
  if (bism) {
    gsap.fromTo(bism,
      { opacity: 0, y: -10 },
      { opacity: 1, y: 0, duration: 1.4, ease: 'power2.out' }
    );
  }

  /* Floating code snippet — gentle continuous float */
  const code = document.querySelector('.floating-code');
  if (code) {
    gsap.to(code, {
      y: -10,
      duration: 2.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
  }

  /* Pull quote — text reveal on scroll */
  const pq = document.querySelector('.pull-quote');
  if (pq) {
    gsap.fromTo(pq,
      { scale: 0.95, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: pq, start: 'top 80%' },
      }
    );
  }
})();
