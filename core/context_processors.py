"""
Make the Profile singleton available in every template as `profile`.
"""
from .models import Profile


def site_profile(request):
    try:
        profile = Profile.get()
    except Exception:
        profile = None
    return {'profile': profile}
