from django.db import models
from django.conf import settings

from apps.core.models import BaseModel
from apps.approvals.models import Approval
from apps.vendors.models import Vendor
from apps.quotations.models import QuotationItem

class PurchaseOrderStatus(models.TextChoices):
    DRAFT = "DRAFT", "Draft"
    ISSUED = "ISSUED", "Issued"
    COMPLETED = "COMPLETED", "Completed"
    CANCELLED = "CANCELLED", "Cancelled"


class PurchaseOrder(BaseModel):
    po_number = models.CharField(
        max_length=50,
        unique=True
    )

    approval = models.OneToOneField(
        Approval,
        on_delete=models.CASCADE,
        related_name="purchase_order"
    )

    vendor = models.ForeignKey(
        Vendor,
        on_delete=models.PROTECT,
        related_name="purchase_orders"
    )

    generated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="generated_purchase_orders"
    )

    status = models.CharField(
        max_length=20,
        choices=PurchaseOrderStatus.choices,
        default=PurchaseOrderStatus.DRAFT
    )

    notes = models.TextField(
        blank=True
    )

    def __str__(self):
        return self.po_number

class PurchaseOrderItem(BaseModel):
    purchase_order = models.ForeignKey(
        PurchaseOrder,
        on_delete=models.CASCADE,
        related_name="items"
    )

    quotation_item = models.ForeignKey(
        QuotationItem,
        on_delete=models.PROTECT,
        related_name="purchase_order_items"
    )

    quantity = models.PositiveIntegerField()

    unit_price = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    def __str__(self):
        return f"{self.purchase_order} - {self.quotation_item.rfq_item.item_name}"