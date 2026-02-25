from django.db import models
from django.conf import settings
import uuid


def generate_application_id():
    return "APP" + uuid.uuid4().hex[:8].upper()


class Service(models.Model):

    SERVICE_TYPE = (
        ("AUTOMATED", "Automated"),
        ("MANUAL", "Manual"),
    )

    name = models.CharField(max_length=255)

    slug = models.SlugField(unique=True)

    category = models.CharField(max_length=100)

    service_type = models.CharField(   # 🔥 renamed from type
        max_length=20,
        choices=SERVICE_TYPE
    )

    processing_time = models.CharField(   # 🔥 add this
        max_length=100,
        default="Instant"
    )

    amount = models.DecimalField(max_digits=10, decimal_places=2)

    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class ServiceApplication(models.Model):

    STATUS_CHOICES = (
        ("pending", "Pending"),
        ("processing", "Processing"),
        ("completed", "Completed"),
        ("rejected", "Rejected"),
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="service_applications"
    )

    service = models.ForeignKey(
        Service,
        on_delete=models.PROTECT,
        related_name="applications"
    )

    # 🔥 RENAMED (No conflict now)
    application_id = models.CharField(
        max_length=20,
        unique=True,
        default=generate_application_id
    )

    amount = models.DecimalField(max_digits=10, decimal_places=2)

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="pending"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.application_id} | {self.service.name}"