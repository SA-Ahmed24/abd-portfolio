# Admin / CMS Guide

How to use your portfolio dashboard to edit content.

---

## Logging in

1. Go to `https://your-site.com/admin/` (or `http://localhost:8000/admin/` locally)
2. Username: `abdullah`
3. Password: `changeme123` *(change this immediately — see "Change password" below)*

---

## Change your admin password

In the admin sidebar, find **Users** → click your user → **Change password** button (top right).

Pick something strong. This is the only thing standing between the public and your CMS.

---

## What you can edit (and where)

### 1. Your profile
**Profile** (singleton — one row only)
- Name, tagline, location
- Bio short (used in hero) and bio long (used in About Me)
- Headshot photo upload
- Polaroid photo for About Me
- Resume PDF
- Email, LinkedIn, GitHub URLs
- The Quranic verse on the About page

### 2. Cities (Journey section)
**Cities (Journey)**
- Lahore, Singapore, Toronto entries
- Each city has a "chapter" you can write (markdown supported)
- Position on map (x_pct / y_pct) if you want to move stamps

### 3. Work experience (F1 track)
**Experiences**
- Each role is a position (P1-P4) on the F1 track
- P1 is current/most recent
- `is_current` flag marks the current job
- Position on track (track_x_pct / track_y_pct) if you want to move markers
- Description supports markdown

### 4. Projects (Release log)
**Projects**
- Title, slug, subtitle, description, detail (long-form case study)
- Tech stack (multi-select)
- GitHub URL, live URL, demo URL
- Cover image upload
- `featured` flag controls home page visibility
- Status: shipped / in_progress / archived

### 5. Tech / Skills
**Tech / Skills**
- Each tech has a category: language / framework / tool
- Shows on the scoreboard in the right column
- `order` controls display order

### 6. Awards
**Awards & Achievements**
- Name, description, year, level
- Emoji icon (the trophy graphic)
- `featured` flag shows on home page

### 7. Movies (Beyond Code shelf)
**Movies (Beyond Code)**
- Title, director, rating (out of 5)
- Poster gradient: `tdk` / `intst` / `dep` / `incep` (visual style)

### 8. F1 Drivers (Beyond Code grid)
**F1 Drivers (Beyond Code)**
- Name, number, team
- Team determines border color

### 9. Other Passions
**Other Passions**
- Misc interests with emoji and notes

### 10. Contact messages
**Contact Messages (Inbox)**
- Read-only — submissions from your contact form
- Mark as read once you've replied

---

## Common tasks

### Adding a new project
1. **Projects** → **Add Project**
2. Fill in title, subtitle, description (short prose)
3. Add **detail** for long-form case study (markdown supported, used on the dedicated project page)
4. Select tech stack
5. Set `shipped_date`, category, status
6. Toggle `featured` if you want it on the home page
7. Upload a cover image
8. Save

### Updating your resume
1. **Profile** → click the row
2. Scroll to **Resume** field
3. Upload new PDF (replaces old)
4. Save

### Adding a new award
1. **Awards & Achievements** → **Add Award**
2. Name, description (short caption)
3. Pick an emoji icon
4. Set order (lower = first)
5. Save

### Hiding a project from home but keeping the detail page
1. Project → **Featured** = unchecked
2. Status = `archived` removes it entirely

### Writing markdown
Description / detail / bio fields support markdown:
- `**bold**` → **bold**
- `*italic*` → *italic*
- `## Heading` → big heading on project detail pages
- `- item` → bulleted list

---

## Production checklist before going live

- [ ] Change admin password
- [ ] Update Profile email/LinkedIn/GitHub to real values
- [ ] Upload final headshot + polaroid photo + resume PDF
- [ ] Review all experience descriptions
- [ ] Review all project descriptions
- [ ] Add at least one detailed project case study
- [ ] Verify city chapters say what you want
- [ ] Test the contact form (send yourself a message)

---

*Built by Abdullah. Updated as new features ship.*
