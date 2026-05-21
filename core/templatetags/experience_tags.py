"""Template tags for experience / F1 track data injection."""
from django import template

register = template.Library()


@register.simple_tag
def experiences_data(experiences):
    """Serialize experiences to a list for json_script template tag."""
    return [
        {
            'position': e.f1_position,
            'title': e.title,
            'company': e.company,
            'location': e.location,
            'date_range': e.date_range,
            'description': e.description,
            'track_x': e.track_x_pct,
            'track_y': e.track_y_pct,
            'is_current': e.is_current,
        }
        for e in experiences
    ]
