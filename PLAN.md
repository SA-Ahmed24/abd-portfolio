# Syed Abdullah Ahmed — Portfolio Website Build Plan

> **Status:** Design phase — V3 mockup awaiting final approval before build begins
> **Owner:** Abdullah
> **Last updated:** May 21, 2026

---

## 1. Vision

A personal portfolio that feels like reading a well-designed magazine about a person — not a templated tech site. Built for recruiters and friends who want to understand who Abdullah is, what he builds, and what he stands for.

**Themes woven throughout (not bolted on):**
- Islamic / Muslim identity — bismillah, alhamdulillah, jazak Allah khair, Quranic verse, all with English translations
- Pakistani heritage — homeland anchor, Urdu phrases, green/gold accents, Lahore as the heart
- Sports — cricket primarily (the scoreboard, the field positions, fans in stands), F1 (career as a race), soccer/tennis/basketball/baseball as supporting interests
- Movies & TV — Nolan, Scorsese, Marvel — shown as a movie shelf
- Tech — clean code aesthetic, monospace accents, terminal moments

**Visual direction:** Editorial magazine + handwritten personal letter. Cream paper background, Pakistan green + gold + saffron + crimson accents. Storytelling prose in italic serif. Custom illustrated elements (real F1 track SVG, pixelated scoreboard, postcards) — not generic card grids.

---

## 2. Sections (final order)

1. **Hero / Letter Opening** — Bismillah, real headshot in polaroid frame, full name "Syed Abdullah Ahmed," storytelling intro paragraph, "— Abdullah" signature, floating code snippet
2. **Journey / Three Cities** — Stylized map with passport-style stamps for Lahore, Singapore, Toronto. Click to expand chapter (no dates shown).
3. **Work / F1 Circuit** — Marina Bay-shaped SVG track. Each role is a position on the track. Two view modes:
   - *Track View*: see all 4 jobs at once
   - *POV*: drive through the track one position at a time
4. **Projects / Release Log** — Editorial release entries (date stamp, big italic title, prose description, tech as inline italic, screenshot/embed on the right). Featured: SquadHub, Agent Twin, Library Management System, Movie Review Site.
5. **Skills / The Scoreboard + The Stands** — Retro pixelated stadium scoreboard with CRT scanlines. Three columns: Languages / Frameworks / Tools. No proficiency rankings. **Below the scoreboard: a full pixelated stadium "stands" section** filled with animated pixel-art fans. Each fan is recognizable by their team merch — caps, jerseys, signs/banners, scarves, flags — not by labels. Fans animate: bouncing, waving signs, raising banners. Teams represented: Pakistan Cricket (green/white flag, crescent), Toronto Blue Jays (blue cap, "JAYS" sign), Toronto Raptors (red jersey, "WE THE NORTH" banner), Liverpool (red scarf, "LFC" banner), Roger Federer (white outfit, tennis racket, "RF" sign).
6. **Awards / Trophy Cabinet** — Dark "museum" section. Scrolling marquee ticker of all wins. Grid of 8 trophy shelves below.
7. **About Me** — Personal story focused on tech + impact + passions (not family-specific). Pull-quote: "if every engineer asked 'who does this actually help?' the world would be a different place." Sidebar: polaroid + sticky-note todo list + illuminated verse card.
8. **Beyond Code** — Retro cricket scorecard (career stats), movie shelf (Nolan/Scorsese/MCU), F1 grid (drivers followed).
9. **Contact** — Personal closing letter. Email / LinkedIn / GitHub / Download CV links. Closing Arabic: Alhamdulillah.
10. **Footer** — Toronto 🇨🇦 Lahore 🇵🇰 Singapore 🇸🇬

---

## 3. Single-page vs. multi-page — my recommendation

**Recommendation: Hybrid.**

- **Main site = single long scrolling page.** Modern portfolio standard. Recruiters skim once, see everything. Easy to share a single URL ("abdullahahmed.dev" lands them at the top). Faster perceived load. Better for storytelling — each section flows into the next.
- **Dedicated pages for project deep-dives.** `/projects/squadhub`, `/projects/agent-twin`, etc. So a recruiter who clicks "Read more" on SquadHub gets a dedicated case-study page with technical detail, screenshots, lessons learned, and a back link.
- **Dedicated "About" page (optional).** For people who want the long version of your story. The single-page version stays concise.
- **Dashboard at `/admin/`.** Django admin, customized — completely separate from the public site.

**Why not full multi-page tabs?** They fragment the story. A recruiter spending 30 seconds on your site wants to scroll, not click 7 tabs and lose context. The hybrid keeps it skimmable while still giving you depth where it matters.

---

## 4. Technical architecture

### Stack
| Layer | Choice | Why |
|---|---|---|
| Backend | **Django 5.x** + Django REST Framework | What you know best, batteries-included, easy admin |
| Database | **SQLite** (dev) → **PostgreSQL** (prod) | Django default → production-ready |
| Frontend templates | **Django templates** with HTMX for the few interactive pieces | One codebase, server-rendered = great SEO for recruiters Googling you |
| Animations | **GSAP + ScrollTrigger** + a sprinkle of vanilla JS | Industry-standard, smooth, easy to control |
| Styling | **Plain CSS** with CSS variables for theming + dark mode toggle | No build tooling overhead |
| Forms | Django + email backend | Contact form sends to your inbox |
| Admin / CMS | **Django Admin** + Jazzmin theme | Free, secure, every model editable |
| Hosting (recommended) | **Render** free tier or **PythonAnywhere** free tier | Free, supports Django |
| Domain | TBD — recommend `abdullahahmed.dev` (~$12/yr) when ready |

### Why not React/Next.js?
- Two codebases to maintain
- Worse SEO out of the box
- Overkill for a portfolio site
- Django templates + HTMX gives you 95% of the interactivity with 30% of the complexity

### Project structure (final)

```
abd-portfolio/
├── manage.py
├── portfolio/                  # Django project config
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── core/                       # Main app — content
│   ├── models.py               # Profile, Experience, Project, Skill, Award, Passion, ContactMessage
│   ├── admin.py                # Customized admin
│   ├── views.py
│   ├── urls.py
│   ├── forms.py                # Contact form
│   ├── templates/
│   │   ├── base.html
│   │   ├── index.html          # Single-page main site
│   │   ├── projects/detail.html
│   │   └── about.html
│   └── static/
│       ├── css/main.css
│       ├── js/
│       │   ├── main.js         # GSAP scroll triggers, theme toggle
│       │   ├── pixel-fans.js   # Pixel-art fan rendering
│       │   └── f1-track.js     # POV car animation
│       ├── images/
│       └── fonts/
├── media/                      # User-uploaded images (project screenshots, etc.)
├── requirements.txt
├── .env.example
└── README.md
```

### Database models

```python
# core/models.py (sketch)

class Profile(SingletonModel):
    name = "Syed Abdullah Ahmed"
    tagline
    bio_long
    headshot ImageField
    resume FileField
    email, linkedin, github, location

class City(Model):
    name, country_code
    arrival_year
    chapter_text (markdown)
    is_homeland Boolean

class Experience(Model):
    title, company, location
    start_date, end_date
    description
    f1_position (P1/P2/P3/P4 ordering)
    is_current

class Project(Model):
    title, slug, subtitle
    description, detail (markdown)
    tech_stack (M2M to Tech)
    github_url, live_url, video_url
    cover_image
    featured Boolean
    shipped_date
    category (full-stack / backend / ai / etc.)

class Tech(Model):
    name, category (language / framework / tool)
    icon optional

class Award(Model):
    name, description
    year, level (school / national / international)
    icon
    featured Boolean

class Passion(Model):
    name, category (sport / movie / etc.)
    notes

class ContactMessage(Model):
    name, email, subject, body
    created_at, read Boolean
```

### Customized Django Admin (the CMS)

Using Jazzmin theme to make the admin beautiful. You log in to `/admin/` and get a dashboard where you can:

- Edit your profile, tagline, bio
- Upload a new resume (auto-replaces the download)
- Add/edit/delete experiences, with drag-to-reorder
- Add/edit/delete projects with image upload
- Add awards
- Manage city chapters
- Read contact messages
- Toggle sections on/off
- Site settings (theme accent colors etc.)

---

## 5. Build phases

| Phase | Goal | Deliverable |
|---|---|---|
| **0. Setup** | Django scaffold, repo, virtualenv, settings | Empty Django site running locally |
| **1. Models + Admin** | All models, customized Jazzmin admin, fixture data with real content | Working `/admin/` you can use |
| **2. Hero + Journey + About** | First three sections rendered with real content | Hero/Journey/About pages styled and live |
| **3. Work + Projects** | F1 track SVG + POV animation + project release log + project detail pages | Working track + clickable projects |
| **4. Skills + Awards** | Pixelated scoreboard + pixel fans + trophy cabinet + ticker | Both sections complete |
| **5. Beyond + Contact** | Cricket scorecard, movie shelf, F1 standings, contact form | Site is feature-complete |
| **6. Animations + Polish** | GSAP scroll animations, dark mode toggle, smooth scroll, responsive | All animations live |
| **7. Mobile + Responsive** | All sections work great on phone/tablet | Site usable on mobile |
| **8. SEO + Meta** | Open Graph tags, sitemap, robots.txt, fast page load | Recruiter-Googleable |
| **9. Deploy** | Render or PythonAnywhere setup, PostgreSQL, env vars, custom domain | Live at your URL |

Each phase will end with a working version you can review before moving on.

---

## 6. Color & typography reference

```
COLORS:
  --paper        #faf6ec   warm cream background
  --paper-2      #f2ebd8   slightly darker
  --paper-3      #e9e0c6   even darker
  --white        #ffffff   pure white sections
  --ink          #1a1714   near-black text
  --ink-soft     #555048   secondary text
  --pak-green    #01411c   Pakistan green
  --pak-green-light #2d6a3e
  --gold         #e8b923   bright gold
  --gold-dark    #c19510   muted gold
  --saffron      #d97706   warm orange
  --crimson      #8b1a1a   accent red
  --line         #c9bea7   border/divider

TYPOGRAPHY:
  Headings: Fraunces (serif, distinct, has personality)
  Editorial body: Instrument Serif (italic for storytelling)
  UI body / nav: Inter (clean sans)
  Code / meta: JetBrains Mono
  Handwritten accents: Caveat
  Arabic: Amiri
  Retro / scoreboard: Press Start 2P
```

---

## 7. Content checklist (what to gather before build)

- [ ] Professional headshot (you mentioned you have one)
- [ ] Photo of something meaningful for the polaroid (cricket pitch / Makkah / Lahore / family / wherever)
- [ ] Latest resume PDF
- [ ] Project screenshots (where you have them):
  - [ ] SquadHub dashboard
  - [ ] Library Management System / Swagger UI
  - [ ] Movie Review Site
  - [ ] Agent Twin (terminal output is fine)
  - [ ] GuessTheNum (if including)
- [ ] Confirm chapter text for each city (Lahore / Singapore / Toronto) — can be 1 paragraph each
- [ ] Verify experience descriptions (I drafted from your resume)
- [ ] Domain name decision (or default to free subdomain)
- [ ] Social links (LinkedIn, GitHub, email) confirmed
- [ ] Any specific Quranic verses you want featured beyond Surah Al-Imran 3:54

I can also generate placeholder demos / mock screenshots for any project where you don't have one — small video clips, mock UI, etc. We can fill those in later in the dashboard.

---

## 8. Open questions

1. **Hosting:** Render vs. PythonAnywhere — happy to pick when we get there. Both are free, both work.
2. **Domain:** abdullahahmed.dev / syedabdullah.com / something else? (Decide before deploy phase.)
3. **Blog:** Currently no blog section in the plan. You can write project case-studies as project detail pages instead. Want a separate blog? Easy to add.
4. **Analytics:** Want Plausible/Google Analytics so you can see who's visiting (especially after sharing with recruiters)?

---

## 9. Notes from v3 design feedback (May 21)

- ✅ Removed dates from city stamps (Toronto, Lahore, Singapore) — too personal
- ✅ Replaced pixelated portrait with real-photo polaroid frame
- ✅ Pixelated cricket field → pixelated stadium scoreboard with pixel-art fans
- ✅ Roots → About Me (focus on tech, passions, impact — not family lore)
- ✅ Full name = Syed Abdullah Ahmed (signature remains "— Abdullah")
- ✅ More white + green + gold; less navy
- ✅ More original feel — added floating code snippet, sticky-note todo, illuminated verse card, pull-quote, polaroid

## 10. Final feedback round (V3 → build) — May 21

- ✅ **Animated fan stadium** replaces the simple fan row. Skills scoreboard stays the same, but underneath it: a full "stands" section with multiple pixelated fans animating (bouncing, waving signs, raising banners). Fans recognizable by team merch (caps, jerseys, banners, scarves, flags) — **no labels**.
- ✅ Removed "the crowd in the stands" caption text.
- ✅ Fans get re-drawn: not just colored blobs — actual signs / banners / caps / merch. Team identity comes from props, not text.
- ✅ User approved everything else. Proceeding to build.

## 11. Build started — May 21

Building in phases (see TodoList in conversation). Mobile access via GitHub push so user can monitor from phone Claude Code app.

---

*This document is the source of truth for the build. Updated as decisions are made.*
