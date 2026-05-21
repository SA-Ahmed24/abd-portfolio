from django import forms
from .models import ContactMessage


class ContactForm(forms.ModelForm):
    # Honeypot — hidden field that bots will fill but humans won't see.
    # If it has any value when submitted, we drop the submission.
    website = forms.CharField(
        required=False,
        widget=forms.TextInput(attrs={
            'tabindex': '-1',
            'autocomplete': 'off',
            'style': 'position:absolute;left:-9999px;width:1px;height:1px;opacity:0;',
            'aria-hidden': 'true',
        }),
    )

    class Meta:
        model = ContactMessage
        fields = ['name', 'email', 'subject', 'body']
        widgets = {
            'name': forms.TextInput(attrs={'placeholder': 'your name', 'class': 'form-input', 'required': True}),
            'email': forms.EmailInput(attrs={'placeholder': 'your email', 'class': 'form-input', 'required': True}),
            'subject': forms.TextInput(attrs={'placeholder': 'subject (optional)', 'class': 'form-input'}),
            'body': forms.Textarea(attrs={'placeholder': 'your message...', 'class': 'form-input', 'rows': 5, 'required': True}),
        }

    def clean_website(self):
        # Honeypot caught a bot
        val = self.cleaned_data.get('website', '')
        if val:
            raise forms.ValidationError('Bot detected.')
        return val

    def clean_body(self):
        body = (self.cleaned_data.get('body') or '').strip()
        if len(body) < 5:
            raise forms.ValidationError('Message is too short.')
        return body
