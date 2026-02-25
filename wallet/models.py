from django.db import models
from django.conf import settings
import uuid


def generate_order_id():
    return "ORD" + uuid.uuid4().hex[:10].upper()


class Wallet(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )
    balance = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    def __str__(self):
        return f"{self.user.username} Wallet"


class Transaction(models.Model):

    STATUS_CHOICES = (
        ("pending", "Pending"),
        ("approved", "Approved"),
        ("rejected", "Rejected"),
    )

    PAYMENT_METHODS = (
        ("upi", "UPI"),
        ("bank", "Bank Transfer"),
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="transactions"
    )

    amount = models.DecimalField(max_digits=12, decimal_places=2)

    order_id = models.CharField(
        max_length=20,
        unique=True,
        default=generate_order_id,
        editable=False
    )

    utr_number = models.CharField(
        max_length=100,
        unique=True,  # 🔥 prevent duplicate credit
        db_index=True
    )

    screenshot = models.ImageField(upload_to="payment_proofs/")

    payment_method = models.CharField(
        max_length=20,
        choices=PAYMENT_METHODS,
        default="upi"
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="pending",
        db_index=True
    )

    admin_remark = models.TextField(blank=True, null=True)

    balance_before = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0
    )

    balance_after = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.order_id} | {self.user.username} | ₹{self.amount} | {self.status}"