from django.urls import path
from .views import automated_service, manual_service, service_list

urlpatterns = [
    path("automated/", automated_service, name="automated_service"),
    path("manual/", manual_service, name="manual_service"),
    path("list/",service_list)
]