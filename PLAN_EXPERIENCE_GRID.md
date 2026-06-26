# PLAN — Experience section → pixelated F1 starting grid

**Goal:** Replace the Marina Bay SVG track (`#work` in `templates/index.html`, lines ~102–187) with a **pixel-art F1 starting grid**: a start-lights gantry, staggered grid slots holding the experiences, a **pit lane on the right**, and an ambient **animation of F1 cars** passing/overtaking/pitting at random intervals.

## Visual design
- **Frame:** keep section `#work`. Heading e.g. `the grid.` / `career — lights out.` (racing voice). Cream/green/gold + pixel aesthetic (match the stadium in `pixel-fans.js`). Asphalt = dark; kerbs red/white; checkered start/finish; lights red; labels in `Press Start 2P`.
- **Start-lights gantry** (top, centered): 5 red lights. JS runs the F1 "lights sequence" periodically — 5 light up one-by-one (~1s apart) then ALL OUT (= GO), which can trigger a car launch.
- **The grid (asphalt):** staggered 2-wide F1 grid. Each **grid slot** = one Experience card:
  - P1 = pole = `is_current` (MTO, Ontario Gov't). Then P2 Alethea AI, P3 Arbisoft, P4 Rozgari (order by `f1_position`).
  - Slot shows: `P{n}` box number, role (`title`), `company`, `location`, dates (derive from start/end or show "current" for pole). Hover/click → reveal `description` (a "race card").
  - Stagger slots like a real grid (P1 front, P2 back-right, P3 front-left further down, etc.).
- **Pit lane (right side):** a vertical pit lane with 2–3 garage boxes + pit wall. Cars sometimes pull in, "stop," then accelerate out.
- **Kerbs / start-finish line / "GRID" + "LIGHTS OUT" pixel labels** for flavor.

## The car animation (the fun part)
- New `static/js/f1-grid.js`. Use a `<canvas>` layer over the asphalt (pixel sprites, `imageSmoothingEnabled=false`) — same approach as `pixel-fans.js`.
- Pixel-art F1 cars (a few liveries/colors). Behaviours, chosen at random each event:
  - 1 car zooms past the start/finish line.
  - 2 cars racing — one **overtakes** the other near the line.
  - A car pulls into a **pit box**, pauses ~1–2s, then accelerates out.
- **Random scheduling:** after each event, wait a random delay (≈3–30s, varied: 10→5→20→3→30…) then fire the next. Not constant — bursts + quiet.
- 60fps via `requestAnimationFrame`; respect `prefers-reduced-motion` (static or no cars). Lazy-start when section scrolls into view (IntersectionObserver).

## Implementation
- **HTML/CSS** for the static grid + lights + pits + experience slot cards (crisp text + hover + responsive) — in `#work`. New CSS in **`static/css/f1-grid.css`** (already linked in `base.html`; do NOT edit `main.css`).
- **Canvas + JS** for the moving cars + lights sequence in **`static/js/f1-grid.js`** (already linked in `base.html`).
- Use the existing `experiences` template context (Experience objects). Remove the old SVG track, `track-toggle`, `#f1-car`, and the `experiences-data` json_script if unused. (`f1-track.js` include is already removed from `base.html`.)
- Data ref — Experience fields: `title, company, location, start_date, end_date, description, f1_position (P1=current), is_current`.

## Verify (must do before finishing)
- Run the Django app (`python manage.py runserver 8000` in the worktree venv) and load `/#work`.
- Confirm: grid + 5-light gantry + pit lane render; all experiences appear on grid slots with hover → description; cars animate at random intervals (no console errors); works in light + dark mode and on mobile (resize).
- Keep it on-brand (cream/green/gold, pixel, `Press Start 2P` accents).

## Commit
Commit inside your worktree, message in Abdullah's voice, lowercase, no AI co-author line. e.g.:
`reworked the experience section into an f1 starting grid — lights, pits, and cars ripping past`
