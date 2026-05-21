"""
Database models for Abdullah's portfolio.

Edit any content from the admin at /admin/.
"""
from django.db import models
from django.utils.text import slugify
from django.urls import reverse


class Profile(models.Model):
    """Singleton model — the site owner's profile info."""
    full_name = models.CharField(max_length=120, default='Syed Abdullah Ahmed')
    short_name = models.CharField(max_length=60, default='Abdullah')
    tagline = models.CharField(max_length=200, default='Software Engineer · Cricketer · Builder')

    bio_short = models.TextField(
        help_text='Used in the hero section. Markdown supported.',
        blank=True,
    )
    bio_long = models.TextField(
        help_text='Used in the About Me section. Markdown supported.',
        blank=True,
    )
    pull_quote = models.CharField(
        max_length=300,
        blank=True,
        help_text='The big italic pull-quote in About Me.',
    )

    headshot = models.ImageField(upload_to='profile/', blank=True, null=True)
    polaroid_photo = models.ImageField(upload_to='profile/', blank=True, null=True, help_text='The polaroid photo on the About page.')
    polaroid_caption = models.CharField(max_length=120, blank=True, default='where it all began ✦')
    resume = models.FileField(upload_to='resume/', blank=True, null=True)

    email = models.EmailField(blank=True)
    linkedin = models.URLField(blank=True)
    github = models.URLField(blank=True)
    location = models.CharField(max_length=120, default='Toronto, Canada')

    # Verse settings (the one in About Me)
    verse_arabic = models.CharField(max_length=300, blank=True)
    verse_translation = models.CharField(max_length=300, blank=True)
    verse_reference = models.CharField(max_length=80, blank=True)

    class Meta:
        verbose_name = 'Profile'
        verbose_name_plural = 'Profile'

    def __str__(self):
        return self.full_name

    def save(self, *args, **kwargs):
        # Singleton — only one row allowed
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def get(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj


class City(models.Model):
    """A city in the Journey section. Stamps on the map."""
    name = models.CharField(max_length=80)
    country_code = models.CharField(max_length=4, help_text='2-letter ISO code (PK, SG, CA)')
    is_homeland = models.BooleanField(default=False, help_text='Pakistan gets the green stamp.')
    order = models.IntegerField(default=0)

    chapter_title = models.CharField(max_length=120, blank=True)
    chapter_body = models.TextField(blank=True, help_text='Markdown supported.')

    map_x_pct = models.FloatField(default=50, help_text='Position % from left on the map.')
    map_y_pct = models.FloatField(default=50, help_text='Position % from top on the map.')

    class Meta:
        ordering = ['order']
        verbose_name_plural = 'Cities (Journey)'

    def __str__(self):
        return f'{self.name}, {self.country_code}'


class Experience(models.Model):
    """Jobs / work — appear as positions on the F1 track."""
    title = models.CharField(max_length=120)
    company = models.CharField(max_length=120)
    location = models.CharField(max_length=120, blank=True)

    start_date = models.DateField()
    end_date = models.DateField(blank=True, null=True, help_text='Leave blank if current.')

    description = models.TextField(help_text='Markdown supported.')

    f1_position = models.PositiveSmallIntegerField(
        unique=True,
        help_text='P1 = current/most recent, P2 = next, etc.',
    )
    track_x_pct = models.FloatField(default=50, help_text='Position on track SVG, % from left.')
    track_y_pct = models.FloatField(default=50, help_text='Position on track SVG, % from top.')

    is_current = models.BooleanField(default=False)

    class Meta:
        ordering = ['f1_position']

    def __str__(self):
        return f'P{self.f1_position} · {self.title} @ {self.company}'

    @property
    def date_range(self):
        start = self.start_date.strftime('%b %Y')
        end = 'Present' if self.is_current or not self.end_date else self.end_date.strftime('%b %Y')
        return f'{start} — {end}'


class Tech(models.Model):
    """A tech / skill — shown on the scoreboard."""
    CATEGORY_CHOICES = [
        ('language', 'Language'),
        ('framework', 'Framework / Library'),
        ('tool', 'Tool / Ops'),
    ]
    name = models.CharField(max_length=60)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    order = models.IntegerField(default=0)
    icon = models.CharField(max_length=40, blank=True, help_text='FontAwesome class (optional)')

    class Meta:
        ordering = ['category', 'order', 'name']
        verbose_name_plural = 'Tech / Skills'

    def __str__(self):
        return self.name


class Project(models.Model):
    """A project in the release log."""
    CATEGORY_CHOICES = [
        ('full-stack', 'Full-Stack'),
        ('backend', 'Backend / API'),
        ('ai', 'AI / Python'),
        ('frontend', 'Frontend'),
        ('mobile', 'Mobile'),
        ('other', 'Other'),
    ]
    STATUS_CHOICES = [
        ('shipped', 'Shipped'),
        ('in_progress', 'In Progress'),
        ('archived', 'Archived'),
    ]

    title = models.CharField(max_length=120)
    slug = models.SlugField(max_length=140, unique=True, blank=True)
    subtitle = models.CharField(max_length=200, blank=True, help_text='Italic tagline')
    description = models.TextField(help_text='Short prose description. Markdown supported.')
    detail = models.TextField(blank=True, help_text='Long-form case study on detail page. Markdown supported.')

    tech_stack = models.ManyToManyField(Tech, blank=True, related_name='projects')

    github_url = models.URLField(blank=True)
    live_url = models.URLField(blank=True)
    demo_url = models.URLField(blank=True, help_text='YouTube / video / live demo URL')

    cover_image = models.ImageField(upload_to='projects/', blank=True, null=True)

    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='full-stack')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='shipped')
    featured = models.BooleanField(default=False)

    shipped_date = models.DateField(help_text='Used for the release log timestamp')
    order = models.IntegerField(default=0, help_text='Lower = higher in the list')

    class Meta:
        ordering = ['order', '-shipped_date']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        return reverse('project_detail', kwargs={'slug': self.slug})

    @property
    def shipped_label(self):
        return self.shipped_date.strftime('%b %Y').upper()


class Award(models.Model):
    """Trophy cabinet."""
    LEVEL_CHOICES = [
        ('international', 'International'),
        ('national', 'National'),
        ('school', 'School'),
        ('regional', 'Regional'),
    ]
    name = models.CharField(max_length=120)
    description = models.CharField(max_length=200, blank=True, help_text='Short caption')
    year = models.IntegerField(blank=True, null=True)
    level = models.CharField(max_length=20, choices=LEVEL_CHOICES, default='national')
    icon = models.CharField(max_length=10, default='🏆', help_text='Emoji icon')
    featured = models.BooleanField(default=True, help_text='Show on main page grid')
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order', '-year']
        verbose_name_plural = 'Awards & Achievements'

    def __str__(self):
        return self.name


class MovieFavorite(models.Model):
    """Movies on the Beyond Code shelf."""
    title = models.CharField(max_length=120)
    director = models.CharField(max_length=120, blank=True)
    rating = models.PositiveSmallIntegerField(default=5, help_text='Out of 5')
    order = models.IntegerField(default=0)
    poster_gradient = models.CharField(
        max_length=20,
        default='tdk',
        help_text='CSS gradient key: tdk, intst, dep, incep',
    )

    class Meta:
        ordering = ['order']
        verbose_name_plural = 'Movies (Beyond Code)'

    def __str__(self):
        return self.title


class F1Driver(models.Model):
    """F1 drivers in the Beyond Code grid."""
    TEAM_CHOICES = [
        ('ferrari', 'Ferrari'),
        ('mercedes', 'Mercedes'),
        ('redbull', 'Red Bull'),
        ('mclaren', 'McLaren'),
        ('aston', 'Aston Martin'),
        ('williams', 'Williams'),
        ('alpine', 'Alpine'),
        ('sauber', 'Sauber'),
        ('haas', 'Haas'),
        ('rb', 'RB'),
    ]
    name = models.CharField(max_length=60)
    number = models.PositiveSmallIntegerField()
    team = models.CharField(max_length=20, choices=TEAM_CHOICES)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order']
        verbose_name_plural = 'F1 Drivers (Beyond Code)'

    def __str__(self):
        return f'#{self.number} {self.name}'


class Passion(models.Model):
    """Misc personal interests for the Beyond Code / About sections."""
    name = models.CharField(max_length=60)
    emoji = models.CharField(max_length=10, blank=True)
    note = models.CharField(max_length=200, blank=True)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order']
        verbose_name_plural = 'Other Passions'

    def __str__(self):
        return self.name


class ContactMessage(models.Model):
    """Submissions from the Contact form."""
    name = models.CharField(max_length=120)
    email = models.EmailField()
    subject = models.CharField(max_length=200, blank=True)
    body = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = 'Contact Messages (Inbox)'

    def __str__(self):
        return f'{self.name} — {self.created_at.strftime("%b %d")}'
