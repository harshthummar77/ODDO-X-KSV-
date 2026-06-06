from django.contrib import admin

from .models import Vendor


@admin.register(Vendor)
class VendorAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "vendor_name",
        "user",
        "contact_person",
        "email",
        "category",
        "status",
        "created_at",
    )

    search_fields = (
        "vendor_name",
        "email",
        "gst_number",
    )

    list_filter = (
        "status",
        "category",
    )