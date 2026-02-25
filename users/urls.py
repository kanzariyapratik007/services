from django.urls import path
from .views import profile_view, change_password

urlpatterns = [
    path("profile/", profile_view),
    path("change-password/", change_password),
]