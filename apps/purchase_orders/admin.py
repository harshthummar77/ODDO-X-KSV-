from django.contrib import admin

from .models import PurchaseOrder, PurchaseOrderItem


@admin.register(PurchaseOrder)
class PurchaseOrderAdmin(admin.ModelAdmin):
    list_display = (
        "po_number",
        "vendor",
        "generated_by",
        "status",
        "created_at",
    )

    list_filter = (
        "status",
    )

    search_fields = (
        "po_number",
    )


@admin.register(PurchaseOrderItem)
class PurchaseOrderItemAdmin(admin.ModelAdmin):
    list_display = (
        "purchase_order",
        "quotation_item",
        "quantity",
        "unit_price",
    )