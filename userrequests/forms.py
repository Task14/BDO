from django.contrib.auth.models import User
from django import forms
from .models import UserRequests



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
    class Meta:
        model = UserRequests
        exclude = ['user', 'views', 'downloads']
