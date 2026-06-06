from django.contrib import admin


from .models import RFQ, RFQItem, RFQVendorAssignment

@admin.register(RFQ)
class RFQAdmin(admin.ModelAdmin):
    list_display = (
        "rfq_number",
        "title",
        "created_by",
        "deadline",
        "status",
        "created_at",
    )

    search_fields = (
        "rfq_number",
        "title",
    )

    list_filter = (
        "status",
    )


@admin.register(RFQItem)
class RFQItemAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "rfq",
        "item_name",
        "quantity",
        "unit",
    )

    search_fields = (
        "item_name",
    )



@admin.register(RFQVendorAssignment)
class RFQVendorAssignmentAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "rfq",
        "vendor",
        "assigned_by",
        "status",
        "created_at",
    )

    list_filter = (
        "status",
    )

    search_fields = (
        "rfq__rfq_number",
        "vendor__vendor_name",
    )    