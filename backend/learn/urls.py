# backend/learn/urls.py

from django.urls import path
from .views import get_infy_data

urlpatterns = [
    path("infy/", get_infy_data, name="learn-infy"),
]
