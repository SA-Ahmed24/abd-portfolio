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

    def handle(self, *args, **options):
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
        squadhub = Project.objects.create(
            title='SquadHub',
            slug='squadhub',
            subtitle='the cricket club management app, built for my weekend team.',
            description=(
                "a full-stack django app for managing my weekend cricket team. "
                "role-based auth for captains and players. ajax-enabled dashboards "
                "for fixture scheduling, player availability, and squad selection. "
                "built because every cricket team i've played for has used a whatsapp group as a database — "
                "and that needed to change."
            ),
            detail=(
                "## the problem\n\n"
                "every weekend cricket team i've played for has been managed via a whatsapp group. "
                "you'd get 15 random messages about availability, the captain would lose track of who confirmed, "
                "and we'd show up with 8 players or 14.\n\n"
                "## the solution\n\n"
                "squadhub is a django app where captains create matches, players RSVP, and the squad is "
                "selected with a clean UI instead of scrolling through chat history.\n\n"
                "## what i built\n\n"
                "- role-based auth (captains vs players)\n"
                "- match/fixture creation with date, opponent, venue\n"
                "- player availability dashboard with ajax check-ins\n"
                "- squad selection tool — drag the available players into the playing XI\n"
                "- season stats aggregation\n\n"
                "## stack\n\n"
                "django · postgresql · htmx · vanilla js · css custom properties"
            ),
            category='full-stack',
            status='in_progress',
            featured=True,
            shipped_date=date(2025, 11, 1),
            github_url='https://github.com/SA-Ahmed24/York-Cricket-Club-App',
            order=1,
        )
        squadhub.tech_stack.set([tech_objs['Python'], tech_objs['Django'], tech_objs['JavaScript'], tech_objs['HTMX'], tech_objs['HTML / CSS'], tech_objs['SQL']])

        agent_twin = Project.objects.create(
            title='Agent Twin',
            slug='agent-twin',
            subtitle='an autonomous ai agent project.',
            description="an exploration into agent-based ai systems. built in python. (more detail coming as this matures.)",
            category='ai',
            status='in_progress',
            featured=True,
            shipped_date=date(2025, 11, 15),
            github_url='https://github.com/SA-Ahmed24/Agent-Twin',
            order=2,
        )
        agent_twin.tech_stack.set([tech_objs['Python']])

        library = Project.objects.create(
            title='Library Management System',
            slug='library-management-system',
            subtitle='a clean, restful book-management api.',
            description=(
                "crud operations for books. designed with fastapi for high-performance routing and pydantic "
                "for type-safe data validation. used RealDictCursor for optimized sql query performance. "
                "search-by-id and search-by-title endpoints."
            ),
            category='backend',
            featured=True,
            shipped_date=date(2024, 6, 1),
            github_url='https://github.com/SA-Ahmed24/Library-Management-System',
            order=3,
        )
        library.tech_stack.set([tech_objs['Python'], tech_objs['FastAPI'], tech_objs['Pydantic'], tech_objs['SQL']])

        movie_site = Project.objects.create(
            title='Movie Review Site',
            slug='movie-review-site',
            subtitle='a letterboxd-lite, built in django.',
            description=(
                "browse, rate, and review movies. user accounts, comment threads, watchlists. "
                "built for myself, because i kept losing track of what nolan film i was going to rewatch next."
            ),
            category='full-stack',
            featured=True,
            shipped_date=date(2024, 4, 1),
            github_url='https://github.com/SA-Ahmed24/DjangoProject-MovieReviewSite',
            order=4,
        )
        movie_site.tech_stack.set([tech_objs['Python'], tech_objs['Django'], tech_objs['HTML / CSS'], tech_objs['SQL']])

        todo = Project.objects.create(
            title='ToDo Reminders',
            slug='todo-reminders',
            subtitle='high-performance task management api.',
            description='task management API with fastapi and SQLAlchemy. pydantic validation.',
            category='backend',
            featured=False,
            shipped_date=date(2024, 5, 1),
            github_url='https://github.com/SA-Ahmed24/ToDo-Reminders-Project',
            order=5,
        )
        todo.tech_stack.set([tech_objs['Python'], tech_objs['FastAPI'], tech_objs['SQLAlchemy'], tech_objs['Pydantic']])

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
