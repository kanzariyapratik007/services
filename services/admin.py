from django.contrib import admin
from .models import Service, ServiceApplication


# ===============================
# SERVICE MASTER ADMIN
# ===============================

@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "name",
        "category",
        "service_type",
        "amount",
        "is_active",
        "created_at"
    )

    list_filter = ("service_type", "category", "is_active")
    search_fields = ("name", "slug")
    list_editable = ("amount", "is_active")


# ===============================
# SERVICE APPLICATION ADMIN
# ===============================

@admin.register(ServiceApplication)
class ServiceApplicationAdmin(admin.ModelAdmin):

    list_display = (
        "service_id",
        "user",
        "service",        # 🔥 FIXED
        "amount",
        "status",
        "created_at"
    )

    list_filter = ("status", "service")
    search_fields = ("service_id", "user__username", "service__name")

    actions = ["mark_completed"]

    def mark_completed(self, request, queryset):
        queryset.update(status="completed")
        self.message_user(request, "Selected services marked as completed")