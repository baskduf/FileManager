from django.shortcuts import render
import os
from google.cloud import storage
from django.shortcuts import redirect

os.environ["GOOGLE_APPLICATION_CREDENTIALS"]="C:/Users/my/Desktop/FileManager/key.json"

def upload(request):
    #process
    return redirect("/")

def download(request):
    #process
    return redirect("/")


# Create your views here.
