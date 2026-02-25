from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth import authenticate
from django.contrib.auth.models import User

@api_view(["GET", "PUT"])
@permission_classes([IsAuthenticated])
def profile_view(request):

    user = request.user

    if request.method == "GET":
        return Response({
            "full_name": user.get_full_name(),
            "username": user.username,
            "email": user.email,
        })

    if request.method == "PUT":
        user.first_name = request.data.get("first_name", "")
        user.last_name = request.data.get("last_name", "")
        user.email = request.data.get("email", "")
        user.save()

        return Response({"message": "Profile updated successfully"})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def change_password(request):

    user = request.user

    current_password = request.data.get("current_password")
    new_password = request.data.get("new_password")

    if not user.check_password(current_password):
        return Response({"error": "Current password incorrect"}, status=400)

    user.set_password(new_password)
    user.save()

    return Response({"message": "Password updated successfully"})