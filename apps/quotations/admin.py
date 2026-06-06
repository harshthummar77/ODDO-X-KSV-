from django.contrib import admin

from .models import Quotation, QuotationItem


@admin.register(Quotation)
class QuotationAdmin(admin.ModelAdmin):
    list_display = (
        "quotation_number",
        "rfq",
        "vendor",
        "submitted_by",
        "status",
        "created_at",
    )

    list_filter = (
        "status",
    )

    search_fields = (
        "quotation_number",
        "vendor__vendor_name",
    )


@admin.register(QuotationItem)
class QuotationItemAdmin(admin.ModelAdmin):
    list_display = (
        "quotation",
        "rfq_item",
        "unit_price",
        "delivery_days",
    )

    search_fields = (
        "quotation__quotation_number",
        "rfq_item__item_name",
    )