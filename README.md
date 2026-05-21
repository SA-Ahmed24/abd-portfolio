# Abdullah Ahmed — Portfolio Website

Personal portfolio site for **Syed Abdullah Ahmed**. Built with Django, faith, and patience.

🌍 Toronto 🇨🇦 · Lahore 🇵🇰 · Singapore 🇸🇬

---

## Status

**✅ Built and running locally.** Deploy step pending.

- See [`PLAN.md`](./PLAN.md) for the architecture
- See [`ADMIN_GUIDE.md`](./ADMIN_GUIDE.md) for how to edit content

---

## Run locally

```bash
# 1. Activate the virtualenv
source venv/bin/activate

# 2. Install deps (if not already)
pip install -r requirements.txt

# 3. Run migrations
python manage.py migrate

# 4. Seed initial content (resumes/projects/etc from your Info folder)
python manage.py seed_content

# 5. Start the server
python manage.py runserver
```

Then open:
- **Site:** http://localhost:8000
- **Admin:** http://localhost:8000/admin/ (login: `abdullah` / `changeme123` — change this immediately)

---

## Deploy to Render (free tier)

1. Connect your GitHub to https://render.com
2. New → Blueprint → select this repo
3. Render auto-detects `render.yaml`, builds, deploys.
4. After first deploy, run `python manage.py createsuperuser` via the Render shell to set a real admin password.

---

## Stack

- **Backend:** Django 5.x + Django REST Framework
- **Frontend:** Django templates + HTMX + GSAP for animations
- **Database:** SQLite (dev) → PostgreSQL (prod)
- **Admin/CMS:** Django Admin + Jazzmin theme
- **Fonts:** Fraunces, Instrument Serif, Inter, JetBrains Mono, Caveat, Amiri, Press Start 2P

---

## Folder structure

```
abd-portfolio/
├── PLAN.md                   # Build plan
├── README.md                 # You are here
├── wireframes/               # Approved design mockups
│   ├── v1-initial.html
│   ├── v2-storytelling.html
│   └── v3-approved.html      # ← This is the final design direction
├── Info/                     # Private — resumes, certificates, source content
├── portfolio/                # Django project (coming)
├── core/                     # Main app (coming)
├── manage.py                 # (coming)
└── requirements.txt          # (coming)
```

---

## Quick links

- 🎨 **Approved design:** [`wireframes/v3-approved.html`](./wireframes/v3-approved.html)
- 📋 **Build plan:** [`PLAN.md`](./PLAN.md)
- 🐙 **GitHub:** [@SA-Ahmed24](https://github.com/SA-Ahmed24)

---

*Alhamdulillah ✦*
