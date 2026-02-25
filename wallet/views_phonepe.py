import requests
from decimal import Decimal
from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Wallet, Transaction
from .phonepe_utils import generate_x_verify


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_phonepe_order(request):

    amount = Decimal(request.data.get("amount"))

    if amount < 100:
        return Response({"error": "Minimum ₹100"}, status=400)

    transaction = Transaction.objects.create(
        user=request.user,
        amount=amount
    )

    payload = {
        "merchantId": settings.PHONEPE_MERCHANT_ID,
        "merchantTransactionId": transaction.merchant_transaction_id,
        "merchantUserId": str(request.user.id),
        "amount": int(amount * 100),
        "redirectUrl": settings.SITE_BASE_URL + "/wallet",
        "redirectMode": "POST",
        "callbackUrl": settings.SITE_BASE_URL + "/api/wallet/phonepe-webhook/",
        "mobileNumber": "9999999999",
        "paymentInstrument": {
            "type": "UPI_QR"
        }
    }

    endpoint = "/pg/v1/pay"

    base64_payload, x_verify = generate_x_verify(payload, endpoint)

    response = requests.post(
        settings.PHONEPE_BASE_URL + endpoint,
        json={"request": base64_payload},
        headers={
            "X-VERIFY": x_verify,
            "Content-Type": "application/json"
        }
    )

    data = response.json()

    return Response({
        "qr_url": data["data"]["instrumentResponse"]["intentUrl"]
    })

@api_view(["POST"])
def phonepe_webhook(request):

    merchant_txn_id = request.data.get("merchantTransactionId")
    status = request.data.get("code")

    try:
        transaction = Transaction.objects.get(
            merchant_transaction_id=merchant_txn_id
        )
    except Transaction.DoesNotExist:
        return Response({"error": "Transaction not found"}, status=404)

    if transaction.status == "success":
        return Response({"message": "Already credited"})

    if status == "PAYMENT_SUCCESS":

        wallet, _ = Wallet.objects.get_or_create(user=transaction.user)

        wallet.balance += transaction.amount
        wallet.save()

        transaction.status = "success"
        transaction.save()

    else:
        transaction.status = "failed"
        transaction.save()

    return Response({"message": "Webhook processed"})