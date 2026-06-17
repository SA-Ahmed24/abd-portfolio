"""
Seed initial portfolio content from real Info folder data.

Run: python manage.py seed_content
"""
from datetime import date
from django.core.management.base import BaseCommand
from core.models import (
    Profile, City, Experience, Project, Tech, Award,
    MovieFavorite, F1Driver, Passion,
)


class Command(BaseCommand):
    help = 'Seed the database with Abdullah\'s real portfolio content'

    def add_arguments(self, parser):
        parser.add_argument(
            '--force',
            action='store_true',
            help='WIPE existing content and reseed. Without this, only seeds if tables are empty.',
        )

    def handle(self, *args, **options):
        force = options.get('force', False)

        # Idempotency guard — skip if data already exists, unless --force
        if not force and Project.objects.exists():
            self.stdout.write(self.style.WARNING(
                '⚠️ Content already exists. Re-run with --force to wipe and reseed.\n'
                '   Otherwise, edit content via /admin/ to preserve your changes.'
            ))
            return

        if force:
            self.stdout.write(self.style.WARNING('⚠️ --force: wiping existing content...'))

        self.stdout.write('Seeding profile...')
        profile, _ = Profile.objects.update_or_create(
            pk=1,
            defaults={
                'full_name': 'Syed Abdullah Ahmed',
                'short_name': 'Abdullah',
                'tagline': 'Software Engineer · Cricketer · Builder',
                'bio_short': (
                    "**assalamu alaikum** _[peace be upon you]_, my name is abdullah. "
                    "i'm a 21-year-old **computer science** student at york university, "
                    "born in lahore, raised between **singapore** and pakistan, now building in **toronto**.\n\n"
                    "i write code with the same care i bring to the cricket pitch — patient, precise, stubbornly optimistic. "
                    "backend systems at **alethea ai**, **1M PKR** raised through **rozgari**, "
                    "and currently keeping ontario's transportation data flowing at the **ministry of transportation**.\n\n"
                    "_alhamdulillah_ — none of this without His plan."
                ),
                'bio_long': (
                    "i fell in love with computers in grade one in singapore. a teacher once told my parents she'd be surprised if i didn't end up in tech. she was right.\n\n"
                    "since then it's been a steady cycle: _scratch games_ in primary school, _arduino projects_ in high school, _django backends_ at internships, _ai agents_ in college. each project taught me something the last one couldn't.\n\n"
                    "i build because i believe technology is the most leveraged way to make people's lives better. it's how a 16-year-old in lahore can build a website that gives _daily-wage workers a way to reach clients during a pandemic_. it's how a few hundred lines of code can save someone hours every week.\n\n"
                    "my passions outside of code shape how i write it. _cricket_ taught me patience and team thinking. _islam_ taught me intentionality — to build with purpose. _pakistan_ taught me what hardship can look like and why solutions matter. _singapore_ taught me what good systems feel like. _toronto_ is teaching me what's still ahead.\n\n"
                    "i'm at my best when i'm building something that matters, learning something new, or watching pakistan win a cricket match against india. _inshallah_ — there's a lot more to build."
                ),
                'pull_quote': "if every engineer asked 'who does this actually help?' the world would be a different place.",
                'polaroid_caption': 'where it all began ✦',
                'email': 'abdullah@example.com',
                'linkedin': 'https://www.linkedin.com/in/syed-abdullah-ahmed/',
                'github': 'https://github.com/SA-Ahmed24',
                'location': 'Toronto, Canada',
                'verse_arabic': 'وَمَكَرُوا وَمَكَرَ اللَّهُ ۖ وَاللَّهُ خَيْرُ الْمَاكِرِينَ',
                'verse_translation': 'and they planned, and Allah planned. and Allah is the best of planners.',
                'verse_reference': 'SURAH AL-IMRAN 3:54',
            }
        )

        self.stdout.write('Seeding cities...')
        City.objects.all().delete()
        City.objects.create(
            name='Lahore', country_code='PK', is_homeland=True, order=1,
            chapter_title='lahore — home.',
            chapter_body=(
                "i was born here on a hot august afternoon in 2004. aitchison college from grade 7 through A-levels — "
                "the school that taught me 'perseverance commands success.' captain of the cricket team. general secretary of the cs society. "
                "co-founded **rozgari** during covid to help daily-wage workers find clients. "
                "lahore is the place i still wake up in my dreams."
            ),
            map_x_pct=62, map_y_pct=36,
        )
        City.objects.create(
            name='Singapore', country_code='SG', order=2,
            chapter_title='singapore — the foundation.',
            chapter_body=(
                "moved here at age 7. spent 8 years at overseas family school and tanglin trust school. "
                "learned mandarin (passed YCT grade 5), discovered programming on scratch, "
                "and won 'cricketer of the year' at TTS. "
                "singapore is where i learned what well-built systems feel like."
            ),
            map_x_pct=65, map_y_pct=55,
        )
        City.objects.create(
            name='Toronto', country_code='CA', order=3,
            chapter_title='toronto — the next chapter.',
            chapter_body=(
                "moved here in 2023 for york university — (hons) BSc computer science, lassonde scholar. "
                "events executive at MSA, VP outreach for muslims in STEM. "
                "weekend cricket with the york cricket club. "
                "currently a junior technical analyst at the ontario ministry of transportation. "
                "inshallah — more to come."
            ),
            map_x_pct=14, map_y_pct=40,
        )

        self.stdout.write('Seeding experiences (F1 grid)...')
        Experience.objects.all().delete()
        Experience.objects.create(
            f1_position=1, is_current=True,
            title='Junior Technical Analyst',
            company='Ministry of Transportation — Ontario Gov\'t',
            location='Toronto, CA',
            start_date=date(2025, 9, 1),
            description=(
                "leveraging devops and dataops principles to containerize a python/django app with docker. "
                "designed mysql relational models with persistent docker volumes. "
                "ran weekly sprint meetings, presenting progress and incorporating feedback into iterative development. "
                "streamlining workflows for a 40+ member DMO team."
            ),
            track_x_pct=78, track_y_pct=56,
        )
        Experience.objects.create(
            f1_position=2,
            title='Software Engineer Intern',
            company='Alethea AI',
            location='Singapore',
            start_date=date(2024, 5, 9),
            end_date=date(2024, 8, 2),
            description=(
                "backend team. developed deep understanding of OOP, design patterns, and algorithms. "
                "django CRUD operations, template rendering, database management. "
                "fastapi work with postman and dbeaver for api testing. "
                "code cleanup — removed obsolete variables and APIs. "
                "contributed to blackbox testing on the DevApp, identifying and helping resolve critical bugs."
            ),
            track_x_pct=60, track_y_pct=30,
        )
        Experience.objects.create(
            f1_position=3,
            title='Developer Intern',
            company='Arbisoft',
            location='Lahore, PK',
            start_date=date(2022, 6, 1),
            end_date=date(2022, 7, 31),
            description=(
                "collaborated with 20+ developers. python, object-oriented programming. "
                "built tic-tac-toe with OOP. learned git/gitlab and stack implementations in python. "
                "introduction to how a real software company runs day-to-day."
            ),
            track_x_pct=32, track_y_pct=55,
        )
        Experience.objects.create(
            f1_position=4,
            title='Co-Founder & CEO',
            company='Rozgari',
            location='Lahore, PK',
            start_date=date(2020, 5, 1),
            end_date=date(2023, 2, 28),
            description=(
                "non-profit platform connecting daily-wage workers (barbers, electricians, handymen, plumbers) "
                "to clients during covid-19 lockdowns. raised **1M PKR**. "
                "built the online + SMS booking system from scratch. "
                "onboarded 25+ service providers. lived rozgaripk.org for nearly 3 years."
            ),
            track_x_pct=17, track_y_pct=88,
        )

        self.stdout.write('Seeding tech stack...')
        Tech.objects.all().delete()
        tech_data = [
            ('Python', 'language', 1),
            ('Java', 'language', 2),
            ('JavaScript', 'language', 3),
            ('C', 'language', 4),
            ('SQL', 'language', 5),
            ('HTML / CSS', 'language', 6),
            ('Django', 'framework', 1),
            ('FastAPI', 'framework', 2),
            ('Django REST Framework', 'framework', 3),
            ('Pydantic', 'framework', 4),
            ('SQLAlchemy', 'framework', 5),
            ('HTMX', 'framework', 6),
            ('Docker', 'tool', 1),
            ('Git / GitHub', 'tool', 2),
            ('Azure', 'tool', 3),
            ('Postman', 'tool', 4),
            ('DBeaver', 'tool', 5),
            ('MS Office', 'tool', 6),
        ]
        tech_objs = {}
        for name, cat, order in tech_data:
            t = Tech.objects.create(name=name, category=cat, order=order)
            tech_objs[name] = t

        self.stdout.write('Seeding projects...')
        Project.objects.all().delete()

        agent_twin = Project.objects.create(
            title='Agent Twin',
            slug='agent-twin',
            subtitle='an ai version of me — it learns my voice, remembers my story, and writes as me.',
            description=(
                "an ai \"twin\" that learns how i write and what i've done, then generates content in my voice — "
                "resumes, cover letters, linkedin posts, emails. it runs on django + a rest api, with google gemini "
                "doing the reasoning and a memory layer that extracts and recalls my experiences. it can even clone "
                "my voice, so a recruiter can have a conversation with a version of me."
            ),
            highlights=(
                "django rest framework backend with a structured memory model — writing style, experiences, personal facts, documents\n"
                "google gemini for style analysis + content generation, grounded in retrieved memories (rag-style prompting)\n"
                "writing-style engine that extracts tone, sentence length, vocabulary and signature phrases from my own samples\n"
                "multimodal ingest — parses pdfs, images and audio (pypdf2, pydub) into structured memories with confidence scores\n"
                "voice cloning via elevenlabs + a shareable public voice-agent link for recruiters"
            ),
            detail=(
                "## the idea\n\n"
                "applying to things means writing the same stuff over and over — tailoring a resume, a cover letter, a "
                "linkedin post — and trying to keep it sounding like *you*. i wanted an ai that actually knows me: my "
                "projects, my roles, the way i write, and can draft any of it on demand in my own voice.\n\n"
                "## how it works\n\n"
                "agent twin has three layers:\n\n"
                "- **memory** — a django data model that stores writing-style signals, experiences, personal facts "
                "(each with a confidence score), and whole documents.\n"
                "- **reasoning** — google gemini analyses my uploaded samples to learn my style, then generates new "
                "content grounded in whichever memories are relevant to the request.\n"
                "- **voice** — an elevenlabs voice clone plus a shareable public link, so someone can literally have a "
                "voice conversation with a version of me.\n\n"
                "## what i built\n\n"
                "- a django rest framework api with token auth and a clean serializer layer\n"
                "- a writing-style extractor (average sentence length, formality, vocabulary, signature phrases)\n"
                "- a memory extractor + retriever — new facts get pulled out of conversations and documents "
                "automatically, then recalled when they're relevant\n"
                "- multimodal document ingest: pdf / image / audio → structured memory\n"
                "- a voice agent with an animated waveform and public share tokens\n\n"
                "## why it matters to me\n\n"
                "it's the project i'm most excited about — it sits right where ai, product, and the kind of tool i'd "
                "actually want to build a company around all meet."
            ),
            category='ai',
            status='in_progress',
            featured=True,
            shipped_date=date(2025, 11, 1),
            github_url='https://github.com/SA-Ahmed24/Agent-Twin',
            order=1,
        )
        agent_twin.tech_stack.set([tech_objs['Python'], tech_objs['Django'], tech_objs['Django REST Framework'], tech_objs['JavaScript']])

        rentez = Project.objects.create(
            title='RentEz',
            slug='rentez',
            subtitle='a landlord–tenant review platform — screen tenants before a bad one costs you thousands.',
            description=(
                "a team build i contributed to. rentez lets landlords review and screen tenants so they don't get "
                "burned by a bad one — multi-criteria star ratings backed by credit and bankruptcy data, lease and "
                "evidence uploads, search and filter, and email outreach to tenants in good standing. i built the "
                "tenant-creation flow and fixed bugs across the app."
            ),
            highlights=(
                "full-stack react 18 + node + postgresql (migrated off mongodb), with auth0 / jwt auth\n"
                "my contribution: the tenant-creation flow + bug fixes (≈190 lines across 7 files)\n"
                "multi-criteria tenant reviews — payments, lease completion, communication, property care, disputes\n"
                "file uploads for leases & evidence, instant search/filter, and email outreach campaigns\n"
                "built as a team, aimed at a real problem: evictions + bad tenants cost landlords ~$18b a year"
            ),
            detail=(
                "## the idea\n\n"
                "a single bad tenant costs a landlord ~$5,000 on average — unpaid rent, damage, legal fees — and the "
                "u.s. sees ~3.6 million evictions filed a year. that's an ~$18b annual problem. rentez gives landlords "
                "a way to screen tenants *before* signing, and to surface good tenants for outreach.\n\n"
                "## what it does\n\n"
                "- landlords create tenant profiles and leave **multi-criteria reviews** (on-time payments, lease "
                "completion, communication, property care, legal disputes)\n"
                "- reviews are backed by **credit score + bankruptcy** signals for a fuller picture\n"
                "- **file uploads** for lease agreements and evidence (images, video, pdf)\n"
                "- **search & filter** by name, rating and location\n"
                "- **email outreach** campaigns to tenants in good standing\n\n"
                "## what i built\n\n"
                "- the **tenant-creation flow** — adding tenants with contact info and handling the already-exists case\n"
                "- bug fixes across the app (≈190 lines over 7 files)\n\n"
                "## stack\n\n"
                "react 18 · node · postgresql (migrated from mongodb) · auth0 / jwt · tailwind"
            ),
            category='full-stack',
            status='shipped',
            featured=True,
            shipped_date=date(2025, 2, 1),
            github_url='https://github.com/MiodragMTasic/RentEZ',
            order=2,
        )
        rentez.tech_stack.set([tech_objs['JavaScript'], tech_objs['SQL'], tech_objs['HTML / CSS']])

        squadhub = Project.objects.create(
            title='SquadHub',
            slug='squadhub',
            subtitle='the cricket club management app, built for my weekend team.',
            description=(
                "a full-stack django app that runs an actual cricket club — players, seasons, fixtures, availability "
                "and squad selection, with role-based access for captains vs players. built because every team i've "
                "played for has used a whatsapp group as a database, and that needed to change."
            ),
            highlights=(
                "models the whole season in the django orm — players, seasons, fixtures, availability, squad selections\n"
                "role-based access: captains manage fixtures and pick squads; players sign up and set availability\n"
                "business logic that enforces a single active season, auto-creates per-player stats, and bulk-inserts them\n"
                "monthly availability deadlines with live open / approaching / locked / passed states\n"
                "account-approval flow — new players are reviewed and activated by the captain before they can log in"
            ),
            detail=(
                "## the problem\n\n"
                "every weekend cricket team i've played for has been \"managed\" through a whatsapp group. availability "
                "is 15 scattered messages, the captain loses track of who's in, and you show up with 8 players or 14.\n\n"
                "## the solution\n\n"
                "squadhub is a django app where the club lives in a real database. captains create seasons and fixtures, "
                "players mark their availability before a deadline, and the squad gets picked in a proper ui instead of "
                "scrolling chat history.\n\n"
                "## what i built\n\n"
                "- a full season data model — players, roles, seasons, fixtures, availability, squad selections\n"
                "- role-based auth: captains get a control panel, players get a personal availability view\n"
                "- season management with validation (only one active season at a time) that auto-creates a stats row "
                "for every active player when a season starts\n"
                "- monthly deadlines with live status — open → approaching → locked → deadline passed\n"
                "- a player sign-up + captain-approval workflow before accounts go live\n\n"
                "## stack\n\n"
                "django 5 · the django orm · sqlite / postgres · html / css / vanilla js"
            ),
            category='full-stack',
            status='shipped',
            featured=True,
            shipped_date=date(2025, 11, 1),
            github_url='https://github.com/SA-Ahmed24/York-Cricket-Club-App',
            order=3,
        )
        squadhub.tech_stack.set([tech_objs['Python'], tech_objs['Django'], tech_objs['JavaScript'], tech_objs['HTML / CSS'], tech_objs['SQL']])

        movie_site = Project.objects.create(
            title='Movie Review Site',
            slug='movie-review-site',
            subtitle='a letterboxd-lite, built in django.',
            description=(
                "browse, rate and review movies, with user accounts and profiles. full crud, poster uploads, "
                "tag-based search with pagination, and a voting system on reviews. built for myself, because i kept "
                "losing track of which nolan film i was going to rewatch next."
            ),
            highlights=(
                "custom user profiles created automatically via django signals, on top of django auth\n"
                "movies, reviews and tags modelled with uuid primary keys and many-to-many tagging\n"
                "review voting (up/down) that aggregates into a vote ratio per movie\n"
                "catalogue search with pagination, plus image uploads for posters\n"
                "full crud with ownership checks so users can only edit their own content"
            ),
            detail=(
                "## the idea\n\n"
                "i watch a lot of film — nolan, scorsese, the mcu — and i wanted my own little letterboxd to track "
                "and review what i'd seen.\n\n"
                "## what i built\n\n"
                "- user accounts with profiles created automatically through django signals\n"
                "- a movie catalogue with poster uploads, descriptions, trailer links and tags\n"
                "- reviews with an up/down vote system that rolls up into a per-movie vote ratio\n"
                "- search across the catalogue with pagination\n"
                "- full create / read / update / delete, scoped so people can only edit their own movies and reviews\n\n"
                "## stack\n\n"
                "django · the django orm · uuid keys · html / css / js · sqlite"
            ),
            category='full-stack',
            status='shipped',
            featured=True,
            shipped_date=date(2024, 7, 1),
            github_url='https://github.com/SA-Ahmed24/DjangoProject-MovieReviewSite',
            order=4,
        )
        movie_site.tech_stack.set([tech_objs['Python'], tech_objs['Django'], tech_objs['HTML / CSS'], tech_objs['SQL']])

        nutrisci = Project.objects.create(
            title='NutriSci',
            slug='nutrisci',
            subtitle='a nutrition tracker, built with my team for york’s software design course.',
            description=(
                "a java application for tracking diet and nutrition, built with my project group for eecs3311 "
                "(software design) at york. it was a proper software-engineering exercise — clean architecture and "
                "design patterns, not just features. i built several of the core features and helped shape the design."
            ),
            highlights=(
                "written in java as a team, applying gang-of-four design patterns (including the adapter pattern)\n"
                "built the goal-setting feature and the food-item swap engine\n"
                "implemented nutrition statistics and graph visualisations\n"
                "user-specific sessions and the user homepage\n"
                "contributed across the codebase, with documentation throughout"
            ),
            detail=(
                "## the project\n\n"
                "nutrisci was a group project for eecs3311 (software design) — york's course on building software "
                "*properly*: clean architecture, separation of concerns, and design patterns, not just getting "
                "something to run.\n\n"
                "## what i built\n\n"
                "- the **goal-setting** feature — set and track nutrition goals\n"
                "- a **food-item swap** engine — suggest healthier swaps for items in a meal\n"
                "- **statistics + graphs** to visualise nutrition over time\n"
                "- user-specific **sessions** and the user homepage\n"
                "- applied the **adapter pattern** (among others) to keep the design clean\n\n"
                "## what i took from it\n\n"
                "this is the project that taught me to think about *design* — patterns, structure, and writing code a "
                "team can actually work in — not just shipping features.\n\n"
                "## stack\n\n"
                "java · object-oriented design · gof design patterns"
            ),
            category='other',
            status='shipped',
            featured=False,
            shipped_date=date(2025, 7, 1),
            github_url='https://github.com/KevinDang12/NutriSci-Project',
            order=5,
        )
        nutrisci.tech_stack.set([tech_objs['Java']])

        # Wire up the AD-style promo videos (rendered with Remotion → media/projects/videos/<slug>.mp4)
        import os
        from django.conf import settings as _settings
        for _p in Project.objects.all():
            _vid = f'projects/videos/{_p.slug}.mp4'
            if os.path.exists(os.path.join(_settings.MEDIA_ROOT, _vid)):
                _p.promo_video = _vid
                _p.save(update_fields=['promo_video'])

        self.stdout.write('Seeding awards...')
        Award.objects.all().delete()
        awards_data = [
            ('UNHack 2024', '1st Place — Team Hack', 2024, 'international', '🏆', 1),
            ('Kangaroo CS — Silver', '1st Lahore, 4th in Pakistan', 2021, 'national', '🥈', 2),
            ('Duke of Edinburgh', 'Bronze — International', 2021, 'international', '🎖', 3),
            ('Lassonde Scholarship', 'York University Entrance', 2023, 'school', '🎓', 4),
            ('Academic Blazer', 'IGCSE Merit — Aitchison College', 2021, 'school', '🎯', 5),
            ('MUN Outstanding Diplomacy', 'Millennium Int\'l — WHO Committee', 2021, 'international', '🗣', 6),
            ('Sigma LUMS', '1st — Geometry & Math Proofs', 2021, 'national', '∑', 7),
            ('Cricketer of the Year', 'Tanglin Trust — Singapore', 2016, 'school', '🏏', 8),
            ('Care Foundation', 'Outstanding Performance Award', 2019, 'school', '🤝', 9),
        ]
        for name, desc, year, level, icon, order in awards_data:
            Award.objects.create(name=name, description=desc, year=year, level=level, icon=icon, order=order)

        self.stdout.write('Seeding movies & F1 drivers...')
        MovieFavorite.objects.all().delete()
        movies_data = [
            ('The Dark Knight', 'Christopher Nolan', 'tdk', 1),
            ('Interstellar', 'Christopher Nolan', 'intst', 2),
            ('The Departed', 'Martin Scorsese', 'dep', 3),
            ('Inception', 'Christopher Nolan', 'incep', 4),
        ]
        for title, director, grad, order in movies_data:
            MovieFavorite.objects.create(title=title, director=director, poster_gradient=grad, order=order)

        F1Driver.objects.all().delete()
        f1_data = [
            ('Leclerc', 16, 'ferrari', 1),
            ('Norris', 4, 'mclaren', 2),
            ('Hamilton', 44, 'mercedes', 3),
            ('Verstappen', 1, 'redbull', 4),
            ('Alonso', 14, 'aston', 5),
        ]
        for name, num, team, order in f1_data:
            F1Driver.objects.create(name=name, number=num, team=team, order=order)

        Passion.objects.all().delete()
        passions_data = [
            ('Cricket', '🏏', 'all-rounder. RHB / RA-offspin. 8+ years playing.', 1),
            ('Soccer', '⚽', 'liverpool fan.', 2),
            ('Tennis', '🎾', 'roger federer forever.', 3),
            ('F1', '🏎️', 'sunday race days.', 4),
            ('Basketball', '🏀', 'toronto raptors.', 5),
            ('Baseball', '⚾', 'blue jays summer.', 6),
        ]
        for name, emoji, note, order in passions_data:
            Passion.objects.create(name=name, emoji=emoji, note=note, order=order)

        self.stdout.write(self.style.SUCCESS('✅ All content seeded successfully.'))
