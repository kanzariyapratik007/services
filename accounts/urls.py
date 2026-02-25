from django.urls import path
from .views import LoginView, DashboardView, RegisterView

urlpatterns = [
    path('login/', LoginView.as_view()),
    path('dashboard/', DashboardView.as_view()),
    path("register/", RegisterView.as_view()),
]
