from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):

    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15, unique=True)

    wallet_balance = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0.00
    )

    REQUIRED_FIELDS = ["email", "phone"]

    def __str__(self):
        return self.username