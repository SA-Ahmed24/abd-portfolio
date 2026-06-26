# PLAN — Awards section → three real trophy cabinets

**Goal:** Rework the `#awards` section (`templates/index.html`, lines ~297–324). Rename the heading from "trophy cabinet" to **"awards."**, but make it *look* like **three real trophy cabinets** — High School, University, and Beyond — with trophy/medal **figures** on shelves, **hover tooltips** with details, and a **subtle Alhamdulillah calligraphy painting** on a back wall.

## Visual design
- Keep section `#awards` (dark "museum" background works well). Heading: **`awards.`** (drop "trophy cabinet" wording per the user).
- **Three cabinets** side-by-side (responsive → stack on mobile), each a believable **trophy cabinet**: wooden frame, **glass front** (subtle sheen/reflection), 2–3 **shelves**, warm interior light.
  1. **High School** — pre-2023 (Aitchison / Singapore era): Kangaroo CS Silver, Duke of Edinburgh Bronze, Academic Blazer (High Achievers), MUN Outstanding Diplomacy, Sigma LUMS, Cricketer of the Year, Care Foundation.
  2. **University** — 2023+ (York): UNHack 2024 — 1st, Lassonde Entrance Scholarship, UmmahHacks 2026 — 2nd.
  3. **Beyond** — after uni: aspirational. Mostly **empty shelves** with one elegant placeholder plaque, e.g. *"the next chapter — inshaAllah"*. (Honest + classy; he hasn't graduated yet.)
- **Figures on shelves:** crafted **SVG/CSS** trophy/medal/figure shapes (not just raw emoji) that correlate to the achievement — gold trophy, silver medal, a little cricket figure (Cricketer of the Year), a code/hack trophy, a grad cap (scholarship), a globe/gavel (MUN), a star, etc. Each sits on a small **plinth/label plate**.
- **Hover** a figure → a tooltip/card with: award **name**, **placement** (e.g. 1st), **year/dates**, short **description**. (CSS hover tooltip, or tiny JS — keep accessible.)
- **Subtle Alhamdulillah:** on the **back wall** of a cabinet (behind the shelves), a small **framed calligraphy painting**: Arabic **الحمد لله** (use the `Amiri` font, gold, tasteful) with a small English line under it — *"all praise is due to God"* / *"thank God"*. Keep it **subtle** (low-contrast wall decor, not loud). Put it in the middle (University) or Beyond cabinet's back wall.
- On-brand: cream/green/gold accents, the site's fonts (`Fraunces`, `Instrument Serif`, `JetBrains Mono`, `Amiri` for Arabic).

## Data / backend
- **Model:** add a `period` field to `Award` in `core/models.py`:
  `period = models.CharField(max_length=20, choices=[('highschool','High School'),('university','University'),('beyond','Beyond')], default='university')`
  (Optionally a `figure`/shape hint field if useful; otherwise reuse `icon` + a CSS plinth.) Run `makemigrations` + `migrate`.
- **Seed:** update `core/management/commands/seed_content.py` to set `period` on each award (by year: pre-2023 → `highschool`; 2023+ → `university`; none are `beyond` yet). Add UmmahHacks 2026 — 2nd Place (university) if not present. Re-seed with `--force`.
- **View:** in `core/views.py` home view, pass awards grouped by period (e.g. `awards_highschool`, `awards_university`, `awards_beyond`) so the template renders three cabinets cleanly.
- **Admin:** add `period` to `AwardAdmin` list/fields in `core/admin.py`.

## Implementation
- Rewrite the `#awards` markup in `templates/index.html` (three `.cabinet` blocks). New CSS in **`static/css/awards.css`** (already linked in `base.html`; do NOT edit `main.css`). Optional tiny JS for tooltips, or pure CSS `:hover`.
- Award fields available: `name, description, year, level, icon, period`.

## Verify (must do before finishing)
- Run the Django app in the worktree (`migrate`, `seed_content --force`, `runserver 8000`), load `/#awards`.
- Confirm: 3 cabinets render with the right awards in each; figures sit on shelves; hover shows name/placement/year/description; the Alhamdulillah calligraphy (الحمد لله) is present, correct, and subtle; works in light + dark and on mobile; no console errors.

## Commit
Commit inside your worktree, message in Abdullah's voice, lowercase, no AI co-author line. e.g.:
`reworked awards into three real trophy cabinets (school / uni / beyond) with a quiet alhamdulillah on the wall`
