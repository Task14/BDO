# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import get_object_or_404
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.renderers import TemplateHTMLRenderer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.http import Http404
from .models import UserRequests
from .forms import UserForm, UserLoginForm, RequestForm
from .serializers import UserRequestsSerializer
from django.contrib.auth import authenticate, login, logout
from django.views import generic
from django.shortcuts import redirect
from django.shortcuts import render


# Create your views here.

#requests/
class IndexList(APIView):
    template_name = "userrequests/index.html"
    renderer_classes = (TemplateHTMLRenderer,)

    def get(self, request):
        user = self.request.user
        if user.is_authenticated:
            all_requests = UserRequests.objects.filter(user=user)
            serializer = UserRequestsSerializer(all_requests, many=True)
            open = UserRequests.objects.filter(user=user, closed=False)
            openser = UserRequestsSerializer(open, many=True)
            closed = UserRequests.objects.filter(user=user, closed=True)
            closedser = UserRequestsSerializer(closed, many=True)
            return Response({'all_requests': serializer.data, 'open': openser.data, 'closed': closedser.data},
                            template_name="index.html")
            #return render(request, self.template_name, {'all_requests': serializer.data, 'open': openser.data, 'closed': closedser.data})
        else:
            return Response(None, template_name="index.html")
            #return render(request, self.template_name, {'all_requests': None})


    def post(self, request):
        serializer = UserRequestsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class Detail(APIView):
    template_name = "userrequests/detail.html"
    renderer_classes = (TemplateHTMLRenderer,)
    entry = UserRequests

    def get_object(self, pk):
        try:
            return UserRequests.objects.get(pk=pk)
        except UserRequests.DoesNotExist:
            raise Http404

    def get_keywords(self, keywords):
        keys_list = []
        try:
            keys_list = keywords.split(',')
            return keys_list
        except UserRequests.DoesNotExist:
            raise Http404


    def get(self, request, pk):
        entry = self.get_object(pk)
        user = self.request.user
        serializer = UserRequestsSerializer(entry)
        prev = UserRequests.objects.filter(user=user)
        prevser = UserRequestsSerializer(prev, many=True)
        list = self.get_keywords(entry.keywords)
        related = []
        for key in list:
            current_results = UserRequests.objects.filter(keywords__icontains=key).exclude(pk=entry.pk)
            relatedser = UserRequestsSerializer(current_results, many=True)
            related += relatedser.data

        #related = UserRequests.objects.filter(keywords__icontains=entry.keywords).exclude(pk=entry.pk)

        return Response({'index': serializer.data, 'prev': prevser.data, 'related': related},
                        template_name="detail.html")
        #return render(request, self.template_name,
         #             {'index': serializer.data, 'prev': prevser.data, 'related': relatedser.data})

    def put(self, request, pk):
        snippet = self.get_object(pk)
        serializer = UserRequestsSerializer(snippet, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        snippet = self.get_object(pk)
        snippet.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class Create(APIView):
    template_name = "userrequests/userrequests_form.html"
    renderer_classes = (TemplateHTMLRenderer,)
    parser_classes = (FormParser, MultiPartParser)
    form_class = RequestForm

    def get_object(self, pk):
        try:
            return UserRequests.objects.get(pk=pk)
        except UserRequests.DoesNotExist:
            raise Http404

    def get(self, request):
        form = self.form_class(None)
        return Response({'form': form}, template_name="userrequests_form.html")
        #return render(request, self.template_name, {'form': form})

    def post(self, request, format=None):
        form = self.form_class(request.POST, request.FILES)

        if form.is_valid():
            entry = form.save(commit=False)
            serializer = UserRequestsSerializer(data=request.data)
            serializer.user = self.request.user  # use your own profile here
            serializer.file = self.request.FILES
            if serializer.is_valid():
                entry = serializer.save(user=request.user)
                return redirect('userrequests:detail', entry.id)
            error_message = serializer.errors
            #return render(request, self.template_name, {'form': form, 'error_message': error_message, 'entry': request.data})
            return Response({'form': form, 'error_message': error_message, 'entry': request.data},
                                          template_name="userrequests_form.html")
        error_message = "Form Not Valid. Please Retry"
        return Response({'form': form, 'error_message': error_message, 'entry': request.data},
                        template_name="userrequests_form.html")
        #return render(request, self.template_name, {'form': form, 'error_message': error_message, 'entry': request.data})

class Update(APIView):

    template_name = "userrequests/userrequests_form.html"
    renderer_classes = (TemplateHTMLRenderer,)
    parser_classes = (FormParser, MultiPartParser)
    form_class = RequestForm

    def get_object(self, pk):
        try:
            return UserRequests.objects.get(pk=pk)
        except UserRequests.DoesNotExist:
            raise Http404

    def get(self, request, pk):
        entry = self.get_object(pk)
        form = self.form_class(instance=entry)
        return Response({'form': form, 'request': entry}, template_name="userrequests_form.html")

    def post(self, request, pk, format=None):
        entry = self.get_object(pk=pk)
        form = self.form_class(request.POST, request.FILES, instance=entry)

        if form.is_valid():
            serializer = UserRequestsSerializer(entry, data=request.data)
            serializer.user = self.request.user  # use your own profile here
            serializer.file = entry.file

            if serializer.is_valid():
                entry = serializer.save(user=request.user)
                return redirect('userrequests:detail', entry.id)
            error_message = serializer.errors
            #return render(request, self.template_name, {'form': form, 'error_message': error_message, 'entry': request.data})
            return Response({'form': form, 'error_message': error_message, 'entry': request.data},
                                          template_name="userrequests_form.html")
            error_message = "Form Not Valid. Please Retry"
        return Response({'form': form, 'error_message': error_message, 'entry': request.data},
                        template_name="userrequests_form.html")
        #return render(request, self.template_name, {'form': form, 'error_message': error_message, 'entry': request.data})


class UserLogin(generic.View):
    form_class = UserLoginForm
    template_name = 'userrequests/login_form.html'

    # display blank form
    def get(self, request):
        form = self.form_class(None)
        return render(request, self.template_name, {'form': form})

    def post(self, request):
        form = self.form_class(request.POST)

        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']

            user = authenticate(username=username, password=password)

            if user is not None:
                login(request, user)
                return redirect('userrequests:index')
            error_message = 'Wrong Username or Password! Try Again!'

        return render(request, self.template_name, {'form': form, 'error_message': error_message})



class UserFormView(generic.View):
    form_class = UserForm
    template_name = 'userrequests/registration_form.html'

    # display blank form
    def get(self, request):
        form = self.form_class(None)
        return render(request, self.template_name, {'form': form})

    # register user to DB
    def post(self, request):
        form = self.form_class(request.POST)

        if form.is_valid():

            user = form.save(commit=False)

            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            user.set_password(password)
            user.save()

            # return user object if credentials are correct
            user = authenticate(username=username, password=password)

            if user is not None:
                if user.is_active:
                    login(request, user)
                    return redirect('userrequests:index')

        return render(request, self.template_name, {'form': form})

def UserLogout(request):
    logout(request)
    return redirect('userrequests:index')