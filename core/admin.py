"""
Django admin — the CMS for editing all site content.
"""
from django.contrib import admin
from .models import (
    Profile, City, Experience, Project, Tech, Award,
    MovieFavorite, F1Driver, Passion, ContactMessage,
)


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    fieldsets = (
        ('Identity', {'fields': ('full_name', 'short_name', 'tagline', 'location')}),
        ('Bios', {'fields': ('bio_short', 'bio_long', 'pull_quote')}),
        ('Photos & Resume', {'fields': ('headshot', 'polaroid_photo', 'polaroid_caption', 'resume')}),
        ('Contact', {'fields': ('email', 'linkedin', 'github')}),
        ('Verse on About Page', {'fields': ('verse_arabic', 'verse_translation', 'verse_reference')}),
    )

    def has_add_permission(self, request):
        # Singleton — only one profile row
        return not Profile.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(City)
class CityAdmin(admin.ModelAdmin):
    list_display = ('name', 'country_code', 'is_homeland', 'order')
    list_editable = ('order', 'is_homeland')
    list_filter = ('is_homeland',)
    fields = ('name', 'country_code', 'is_homeland', 'order', 'chapter_title', 'chapter_body', 'map_x_pct', 'map_y_pct')


@admin.register(Experience)
class ExperienceAdmin(admin.ModelAdmin):
    list_display = ('f1_position', 'title', 'company', 'start_date', 'end_date', 'is_current')
    list_editable = ('is_current',)
    list_filter = ('is_current',)
    ordering = ('f1_position',)


@admin.register(Tech)
class TechAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'order')
    list_editable = ('category', 'order')
    list_filter = ('category',)
    search_fields = ('name',)


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'status', 'featured', 'shipped_date', 'order')
    list_editable = ('featured', 'order', 'status')
    list_filter = ('category', 'status', 'featured')
    search_fields = ('title', 'description')
    prepopulated_fields = {'slug': ('title',)}
    filter_horizontal = ('tech_stack',)
    fieldsets = (
        ('Core', {'fields': ('title', 'slug', 'subtitle', 'category', 'status', 'featured', 'shipped_date', 'order')}),
        ('Content', {'fields': ('description', 'detail', 'cover_image', 'tech_stack')}),
        ('Links', {'fields': ('github_url', 'live_url', 'demo_url')}),
    )


@admin.register(Award)
class AwardAdmin(admin.ModelAdmin):
    list_display = ('name', 'level', 'year', 'featured', 'order')
    list_editable = ('featured', 'order', 'level')
    list_filter = ('level', 'featured')
    search_fields = ('name', 'description')


@admin.register(MovieFavorite)
class MovieFavoriteAdmin(admin.ModelAdmin):
    list_display = ('title', 'director', 'rating', 'order')
    list_editable = ('order',)


@admin.register(F1Driver)
class F1DriverAdmin(admin.ModelAdmin):
    list_display = ('number', 'name', 'team', 'order')
    list_editable = ('order',)
    list_filter = ('team',)


@admin.register(Passion)
class PassionAdmin(admin.ModelAdmin):
    list_display = ('name', 'emoji', 'order')
    list_editable = ('order',)


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'subject', 'created_at', 'is_read')
    list_editable = ('is_read',)
    list_filter = ('is_read', 'created_at')
    search_fields = ('name', 'email', 'subject', 'body')
    readonly_fields = ('name', 'email', 'subject', 'body', 'created_at')
