from django.contrib.auth.models import User
from django import forms
from django.forms import Textarea
from .models import UserRequests, Messages
from django.conf import settings



class UserForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput)

    class Meta:
        model = User
        fields = ['username', 'password', 'email']

class UserLoginForm(forms.Form):
    username = forms.CharField(max_length=20)
    password = forms.CharField(widget=forms.PasswordInput)



class RequestForm(forms.ModelForm):
    file = forms.FileField(required=False)
    deadline = forms.DateField(widget=forms.widgets.DateInput(attrs={'type': 'date'}))

    class Meta:
        model = UserRequests
        exclude = ['user', 'views', 'downloads', 'closed']
        widgets = {
            'keywords': Textarea(attrs={'cols': 50, 'rows': 3, 'style': 'resize:none;'}),
            'service_description': Textarea(attrs={'cols': 50, 'rows': 5, 'style': 'resize:none;'}),
        }


class MessageForm(forms.ModelForm):

    class Meta:
        model = Messages
        fields = ['message']
