from decimal import Decimal
from django.db import transaction as db_transaction
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from wallet.models import Wallet, Transaction
from .models import ServiceApplication, Service
import uuid
from django.http import HttpResponse
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.lib.styles import getSampleStyleSheet
import io


# =========================
# ORDER ID GENERATOR
# =========================

def generate_order(prefix):
    return f"{prefix}-{uuid.uuid4().hex[:8].upper()}"

# =========================
# PDF GENERATOR
# =========================

def generate_service_pdf(user, service, order_id):

    buffer = io.BytesIO()

    doc = SimpleDocTemplate(buffer)
    elements = []

    styles = getSampleStyleSheet()

    title_style = styles["Heading1"]
    normal_style = styles["Normal"]

    elements.append(Paragraph("NATH SEVAONE", title_style))
    elements.append(Spacer(1, 0.3 * inch))

    elements.append(Paragraph(f"Service Name: {service.name}", normal_style))
    elements.append(Paragraph(f"Order ID: {order_id}", normal_style))
    elements.append(Paragraph(f"Customer: {user.username}", normal_style))
    elements.append(Paragraph(f"Amount Paid: ₹{service.amount}", normal_style))

    elements.append(Spacer(1, 0.5 * inch))

    elements.append(Paragraph("Service Processed Successfully.", normal_style))

    doc.build(elements)

    buffer.seek(0)

    return buffer
# =========================================
# AUTOMATED SERVICE (Instant Completed)
# =========================================

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def automated_service(request):

    service_id = request.data.get("service_id")

    if not service_id:
        return Response(
            {"error": "Service ID required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        service = Service.objects.get(
            id=service_id,
            is_active=True
        )
    except Service.DoesNotExist:
        return Response(
            {"error": "Service not available"},
            status=status.HTTP_400_BAD_REQUEST
        )

    wallet, _ = Wallet.objects.get_or_create(user=request.user)

    if wallet.balance < service.amount:
        return Response(
            {"error": "Insufficient balance"},
            status=status.HTTP_400_BAD_REQUEST
        )

    with db_transaction.atomic():

        balance_before = wallet.balance
        wallet.balance -= service.amount
        wallet.save()

        tx = Transaction.objects.create(
            user=request.user,
            amount=service.amount,
            order_id=generate_order("AUTO"),
            status="success",
            utr_number="WALLET",
            balance_before=balance_before,
            balance_after=wallet.balance
        )

        ServiceApplication.objects.create(
            user=request.user,
            service=service,
            amount=service.amount,
            status="completed"
        )

    # 🔥 Generate PDF
    pdf_buffer = generate_service_pdf(
        request.user,
        service,
        tx.order_id
    )

    response = HttpResponse(
        pdf_buffer,
        content_type="application/pdf"
    )

    response["Content-Disposition"] = f'attachment; filename="{service.slug}.pdf"'

    return response

# =========================================
# MANUAL SERVICE (Processing Mode)
# =========================================

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def manual_service(request):

    service_id = request.data.get("service_id")

    if not service_id:
        return Response(
            {"error": "Service ID required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        service = Service.objects.get(
            id=service_id,
            is_active=True
        )
    except Service.DoesNotExist:
        return Response(
            {"error": "Service not available"},
            status=status.HTTP_400_BAD_REQUEST
        )

    wallet, _ = Wallet.objects.get_or_create(user=request.user)

    if wallet.balance < service.amount:
        return Response(
            {"error": "Insufficient wallet balance"},
            status=status.HTTP_400_BAD_REQUEST
        )

    with db_transaction.atomic():

        balance_before = wallet.balance
        wallet.balance -= service.amount
        wallet.save()

        tx = Transaction.objects.create(
            user=request.user,
            amount=service.amount,
            order_id=generate_order("MANUAL"),
            status="success",
            utr_number="WALLET",
            balance_before=balance_before,
            balance_after=wallet.balance
        )

        application = ServiceApplication.objects.create(
            user=request.user,
            service=service,
            amount=service.amount,
            status="processing"
        )

    return Response({
        "message": "Application submitted successfully",
        "order_id": tx.order_id,
        "application_id": application.application_id,
        "remaining_balance": wallet.balance
    }, status=status.HTTP_201_CREATED)


# =========================================
# SERVICE LIST (Dynamic from DB)
# =========================================

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def service_list(request):

    category = request.GET.get("category")

    queryset = Service.objects.filter(is_active=True)

    if category:
        queryset = queryset.filter(category=category)

    data = [
        {
            "id": s.id,
            "name": s.name,
            "slug": s.slug,
            "category": s.category,
            "amount": float(s.amount),
            "service_type": s.service_type,
            "processing_time": s.processing_time
        }
        for s in queryset
    ]

    return Response(data)