from decimal import Decimal, InvalidOperation
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction as db_transaction
from .models import Wallet, Transaction
from rest_framework.pagination import PageNumberPagination
from django.utils.dateparse import parse_date


# =========================================
# PAGINATION CLASS (CORRECT)
# =========================================

class TransactionPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = "page_size"
    max_page_size = 100


# =========================================
# SUBMIT MANUAL QR PAYMENT
# =========================================

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def submit_manual_payment(request):

    amount = request.data.get("amount")
    utr = request.data.get("utr_number")
    screenshot = request.FILES.get("screenshot")

    if not amount or not utr or not screenshot:
        return Response(
            {"error": "All fields are required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        amount = Decimal(amount)
    except (InvalidOperation, TypeError):
        return Response(
            {"error": "Invalid amount format"},
            status=status.HTTP_400_BAD_REQUEST
        )

    if amount < 100:
        return Response(
            {"error": "Minimum recharge is ₹100"},
            status=status.HTTP_400_BAD_REQUEST
        )

    if Transaction.objects.filter(utr_number=utr).exists():
        return Response(
            {"error": "This UTR number already exists"},
            status=status.HTTP_400_BAD_REQUEST
        )

    with db_transaction.atomic():

        tx = Transaction.objects.create(
            user=request.user,
            amount=amount,
            utr_number=utr,
            screenshot=screenshot,
            status="pending"
        )

    return Response({
        "message": "Payment submitted successfully",
        "order_id": tx.order_id,
        "status": tx.status
    }, status=status.HTTP_201_CREATED)


# =========================================
# WALLET BALANCE
# =========================================

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def wallet_balance(request):

    wallet, _ = Wallet.objects.get_or_create(user=request.user)

    return Response({
        "wallet_balance": wallet.balance,
        "name": request.user.username,
        "user_id": request.user.id
    })


# =========================================
# USER TRANSACTION LIST
# =========================================

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def transaction_list(request):

    queryset = Transaction.objects.filter(
        user=request.user
    ).order_by("-created_at")

    # ===== STATUS FILTER =====
    status_param = request.GET.get("status")
    if status_param and status_param != "all":
        queryset = queryset.filter(status=status_param)

    # ===== DATE FILTER =====
    start_date = request.GET.get("start_date")
    end_date = request.GET.get("end_date")

    if start_date:
        parsed_start = parse_date(start_date)
        if parsed_start:
            queryset = queryset.filter(created_at__date__gte=parsed_start)

    if end_date:
        parsed_end = parse_date(end_date)
        if parsed_end:
            queryset = queryset.filter(created_at__date__lte=parsed_end)

    # ===== SEARCH =====
    search = request.GET.get("search")
    if search:
        queryset = queryset.filter(order_id__icontains=search)

    # ===== PAGINATION =====
    paginator = TransactionPagination()
    page = paginator.paginate_queryset(queryset, request)

    data = [
        {
            "order_id": tx.order_id,
            "amount": tx.amount,
            "status": tx.status,
            "utr_number": tx.utr_number,
            "balance_before": tx.balance_before,
            "balance_after": tx.balance_after,
            "created_at": tx.created_at,
        }
        for tx in page
    ]

    return paginator.get_paginated_response(data)


# =========================================
# SINGLE TRANSACTION DETAIL
# =========================================

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def transaction_detail(request, order_id):

    try:
        tx = Transaction.objects.get(
            order_id=order_id,
            user=request.user
        )
    except Transaction.DoesNotExist:
        return Response(
            {"error": "Transaction not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    return Response({
        "order_id": tx.order_id,
        "amount": tx.amount,
        "utr_number": tx.utr_number,
        "status": tx.status,
        "created_at": tx.created_at,
        "balance_before": tx.balance_before,
        "balance_after": tx.balance_after,
    })