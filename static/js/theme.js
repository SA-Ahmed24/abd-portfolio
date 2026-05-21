/* theme.js — dark / light mode toggle */
(function() {
  const root = document.body;
  const toggle = document.getElementById('theme-toggle');

  // Load saved theme or use system preference
  const saved = localStorage.getItem('theme');
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initial = saved || (systemDark ? 'dark' : 'light');
  root.setAttribute('data-theme', initial);
  updateIcon(initial);

  if (toggle) {
    toggle.addEventListener('click', () => {
      const current = root.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      updateIcon(next);
    });
  }

  function updateIcon(theme) {
    if (!toggle) return;
    toggle.textContent = theme === 'dark' ? '☾' : '☼';
  }
})();
