from django import forms
from .models import ContactMessage


class ContactForm(forms.ModelForm):
    class Meta:
        model = ContactMessage
        fields = ['name', 'email', 'subject', 'body']
        widgets = {
            'name': forms.TextInput(attrs={'placeholder': 'your name', 'class': 'form-input'}),
            'email': forms.EmailInput(attrs={'placeholder': 'your email', 'class': 'form-input'}),
            'subject': forms.TextInput(attrs={'placeholder': 'subject (optional)', 'class': 'form-input'}),
            'body': forms.Textarea(attrs={'placeholder': 'your message...', 'class': 'form-input', 'rows': 5}),
        }
