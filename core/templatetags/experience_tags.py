"""Template tags for experience / F1 track data injection."""
import json
from django import template
from django.utils.safestring import mark_safe

register = template.Library()


@register.simple_tag
def experiences_json(experiences):
    """Serialize experiences to JSON for the F1 POV JS."""
    data = []
    for e in experiences:
        data.append({
            'position': e.f1_position,
            'title': e.title,
            'company': e.company,
            'location': e.location,
            'date_range': e.date_range,
            'description': e.description,
            'track_x': e.track_x_pct,
            'track_y': e.track_y_pct,
            'is_current': e.is_current,
        })
    return mark_safe(json.dumps(data))
