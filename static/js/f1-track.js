/* f1-track.js — Track View + POV mode + animated car */
(function() {
  const track = document.getElementById('f1-track');
  const car = document.getElementById('f1-car');
  const povCard = document.getElementById('pov-card');
  const povControls = document.getElementById('pov-controls');
  const toggleButtons = document.querySelectorAll('.track-toggle button');
  const dataEl = document.getElementById('experiences-data');

  if (!track || !car || !dataEl) return;

  let experiences = [];
  try {
    experiences = JSON.parse(dataEl.textContent);
  } catch (e) {
    console.error('Could not parse experiences data', e);
    return;
  }

  if (!experiences.length) return;

  // Sort by f1_position ascending (P1 first)
  experiences.sort((a, b) => a.position - b.position);

  let currentIndex = 0; // index in experiences[] — start at P1
  let mode = 'track';   // 'track' or 'pov'

  // Initial car position — at P1 (current)
  positionCar(experiences[0]);

  function positionCar(exp) {
    car.style.top = exp.track_y + '%';
    car.style.left = exp.track_x + '%';
  }

  function highlightMarker(position) {
    document.querySelectorAll('.track-marker').forEach((m) => {
      m.classList.toggle('active', parseInt(m.dataset.position) === position);
    });
  }

  function updatePovCard(exp) {
    if (!povCard) return;
    povCard.innerHTML = `
      <div class="pov-position">
        <div class="pov-position-num">P${exp.position}</div>
        <div class="pov-position-label">${exp.is_current ? 'CURRENT' : 'PAST'}</div>
      </div>
      <div>
        <div class="pov-role">${escapeHtml(exp.title)}</div>
        <div class="pov-company">${escapeHtml(exp.company)}</div>
        <div class="pov-date">${escapeHtml(exp.date_range).toUpperCase()}${exp.location ? ' // ' + escapeHtml(exp.location).toUpperCase() : ''}</div>
        <div class="pov-text">${escapeHtml(exp.description)}</div>
      </div>
    `;
  }

  function escapeHtml(s) {
    return String(s || '').replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  function setMode(newMode) {
    mode = newMode;
    toggleButtons.forEach((b) => {
      b.classList.toggle('active', b.dataset.mode === mode);
    });
    if (mode === 'pov') {
      povControls.style.display = 'flex';
      goToExperience(currentIndex);
    } else {
      povControls.style.display = 'none';
      currentIndex = 0;
      positionCar(experiences[0]);
      highlightMarker(experiences[0].position);
      updatePovCard(experiences[0]);
    }
  }

  function goToExperience(index) {
    if (index < 0 || index >= experiences.length) return;
    currentIndex = index;
    const exp = experiences[index];
    positionCar(exp);
    highlightMarker(exp.position);
    updatePovCard(exp);
  }

  // Toggle button bindings
  toggleButtons.forEach((b) => {
    b.addEventListener('click', () => setMode(b.dataset.mode));
  });

  // POV control bindings
  document.querySelectorAll('.pov-btn').forEach((b) => {
    b.addEventListener('click', () => {
      const action = b.dataset.pov;
      if (action === 'prev') goToExperience(currentIndex - 1);
      else if (action === 'next') goToExperience(currentIndex + 1);
      else if (action === 'drive') {
        // Auto-drive through all experiences
        let i = 0;
        const drive = () => {
          if (i >= experiences.length) return;
          goToExperience(i);
          i++;
          setTimeout(drive, 1800);
        };
        drive();
      }
    });
  });

  // Click any marker to focus that job
  document.querySelectorAll('.track-marker').forEach((m) => {
    m.addEventListener('click', () => {
      const pos = parseInt(m.dataset.position);
      const idx = experiences.findIndex((e) => e.position === pos);
      if (idx !== -1) {
        if (mode !== 'pov') setMode('pov');
        else goToExperience(idx);
      }
    });
  });
})();
