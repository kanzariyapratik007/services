from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils import timezone
from django.db.models import Sum
from wallet.models import Wallet, Transaction

User = get_user_model()


# =========================
# LOGIN
# =========================
class LoginView(TokenObtainPairView):
    pass


# =========================
# DASHBOARD
# =========================
class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        wallet, _ = Wallet.objects.get_or_create(user=request.user)
        transactions = Transaction.objects.filter(user=request.user)

        today = timezone.now().date()

        return Response({
            "wallet_balance": wallet.balance,
            "total_transactions": transactions.count(),
            "today_transactions": transactions.filter(
                created_at__date=today
            ).count(),
            "total_spent": transactions.aggregate(
                total=Sum("amount")
            )["total"] or 0
        })


# =========================
# REGISTER
# =========================
# =========================
# REGISTER (FIXED)
# =========================
class RegisterView(APIView):

    def post(self, request):

        username = request.data.get("username")
        password = request.data.get("password")
        email = request.data.get("email")
        phone = request.data.get("phone")

        # ================= VALIDATION =================
        if not username or not password or not email or not phone:
            return Response(
                {"error": "All fields are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if len(password) < 6:
            return Response(
                {"error": "Password must be at least 6 characters"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if User.objects.filter(username=username).exists():
            return Response(
                {"error": "Username already exists"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if User.objects.filter(email=email).exists():
            return Response(
                {"error": "Email already exists"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if User.objects.filter(phone=phone).exists():
            return Response(
                {"error": "Phone already exists"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # ================= CREATE USER SAFELY =================
        user = User.objects.create_user(
            username=username,
            password=password,
            email=email
        )

        user.phone = phone
        user.save()

        # ================= FIXED: CREATE WALLET SAFELY =================
        wallet, created = Wallet.objects.get_or_create(user=user)

        return Response(
            {
                "message": "User created successfully",
                "wallet_created": created,
                "wallet_id": wallet.id
            },
            status=status.HTTP_201_CREATED
        )