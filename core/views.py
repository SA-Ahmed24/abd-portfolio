"""
Views for the portfolio.
"""
from django.shortcuts import render, get_object_or_404, redirect
from django.contrib import messages
from django.core.mail import send_mail
from django.conf import settings
from django.http import HttpResponse
from django.views.decorators.http import require_POST
from django.utils.html import escape

import markdown as md

from .models import (
    Profile, City, Experience, Project, Tech, Award,
    MovieFavorite, F1Driver, Passion, ContactMessage,
)
from .forms import ContactForm


def _markdown(text):
    return md.markdown(text or '', extensions=['extra', 'nl2br'])


def home(request):
    profile = Profile.get()
    cities = City.objects.all()
    experiences = Experience.objects.all()
    projects = Project.objects.exclude(status='archived')
    tech_languages = Tech.objects.filter(category='language')
    tech_frameworks = Tech.objects.filter(category='framework')
    tech_tools = Tech.objects.filter(category='tool')
    awards = Award.objects.filter(featured=True)
    movies = MovieFavorite.objects.all()
    drivers = F1Driver.objects.all()
    passions = Passion.objects.all()

    context = {
        'profile': profile,
        'bio_short_html': _markdown(profile.bio_short),
        'bio_long_html': _markdown(profile.bio_long),
        'cities': cities,
        'experiences': experiences,
        'current_experience': experiences.filter(is_current=True).first(),
        'projects': projects,
        'tech_languages': tech_languages,
        'tech_frameworks': tech_frameworks,
        'tech_tools': tech_tools,
        'awards': awards,
        'movies': movies,
        'drivers': drivers,
        'passions': passions,
        'contact_form': ContactForm(),
    }
    return render(request, 'index.html', context)


def project_detail(request, slug):
    project = get_object_or_404(Project, slug=slug)
    context = {
        'project': project,
        'description_html': _markdown(project.description),
        'detail_html': _markdown(project.detail),
    }
    return render(request, 'project_detail.html', context)


def city_chapter(request, city_id):
    """HTMX endpoint — returns the chapter HTML for a city."""
    city = get_object_or_404(City, pk=city_id)
    context = {
        'city': city,
        'body_html': _markdown(city.chapter_body),
    }
    return render(request, 'partials/city_chapter.html', context)


@require_POST
def contact_submit(request):
    form = ContactForm(request.POST)
    if form.is_valid():
        msg = form.save()
        # Try to email — fails gracefully in dev
        try:
            send_mail(
                subject=f'[Portfolio] {msg.subject or "New message"} — from {msg.name}',
                message=f'From: {msg.name} <{msg.email}>\n\n{msg.body}',
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[settings.CONTACT_EMAIL],
                fail_silently=True,
            )
        except Exception:
            pass

        if request.htmx:
            return HttpResponse(
                '<div class="contact-success">'
                '<strong>jazak Allah khair</strong> — your message landed. i\'ll get back to you soon.'
                '</div>'
            )
        messages.success(request, 'Your message landed. I\'ll get back to you soon.')
        return redirect('home')

    if request.htmx:
        # Re-render the form with errors
        return render(request, 'partials/contact_form.html', {'contact_form': form})
    messages.error(request, 'Please check the form and try again.')
    return redirect('home')
