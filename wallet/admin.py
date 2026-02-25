from django.contrib import admin
from django.db import transaction as db_transaction
from django.utils.html import format_html
from .models import Wallet, Transaction


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):

    list_display = (
        "order_id",
        "user",
        "amount",
        "status",
        "created_at"
    )

    list_filter = ("status", "created_at")
    search_fields = ("order_id", "utr_number", "user__username")

    actions = ["approve_payment", "reject_payment"]

    # =========================================
    # APPROVE PAYMENT (SAFE VERSION)
    # =========================================
    def approve_payment(self, request, queryset):

        approved_count = 0

        for tx in queryset:

            if tx.status != "pending":
                continue  # prevent double approval

            with db_transaction.atomic():

                wallet, _ = Wallet.objects.get_or_create(user=tx.user)

                # store balance before
                tx.balance_before = wallet.balance

                # credit wallet
                wallet.balance += tx.amount
                wallet.save()

                # store balance after
                tx.balance_after = wallet.balance
                tx.status = "approved"
                tx.save()

                approved_count += 1

        self.message_user(
            request,
            f"{approved_count} payment(s) approved successfully."
        )

    approve_payment.short_description = "Approve selected payments"

    # =========================================
    # REJECT PAYMENT
    # =========================================
    def reject_payment(self, request, queryset):

        rejected_count = queryset.filter(status="pending").update(status="rejected")

        self.message_user(
            request,
            f"{rejected_count} payment(s) rejected."
        )

    reject_payment.short_description = "Reject selected payments"


@admin.register(Wallet)
class WalletAdmin(admin.ModelAdmin):
    list_display = ("user", "balance")
    search_fields = ("user__username",)