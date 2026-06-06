from django.db import models
from django.conf import settings

from apps.core.models import BaseModel
from apps.rfq.models import RFQ,RFQItem
from apps.vendors.models import Vendor


class QuotationStatus(models.TextChoices):
    DRAFT = "DRAFT", "Draft"
    SUBMITTED = "SUBMITTED", "Submitted"
    SELECTED = "SELECTED", "Selected"
    REJECTED = "REJECTED", "Rejected"


class Quotation(BaseModel):
    quotation_number = models.CharField(
        max_length=50,
        unique=True
    )

    rfq = models.ForeignKey(
        RFQ,
        on_delete=models.CASCADE,
        related_name="quotations"
    )

    vendor = models.ForeignKey(
        Vendor,
        on_delete=models.CASCADE,
        related_name="quotations"
    )

    submitted_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="submitted_quotations"
    )

    notes = models.TextField(
        blank=True
    )

    status = models.CharField(
        max_length=20,
        choices=QuotationStatus.choices,
        default=QuotationStatus.DRAFT
    )

    def __str__(self):
        return self.quotation_number


class QuotationItem(BaseModel):
    quotation = models.ForeignKey(
        Quotation,
        on_delete=models.CASCADE,
        related_name="items"
    )

    rfq_item = models.ForeignKey(
        RFQItem,
        on_delete=models.CASCADE,
        related_name="quotation_items"
    )

    unit_price = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    delivery_days = models.PositiveIntegerField()

    notes = models.TextField(
        blank=True
    )

    def __str__(self):
        return f"{self.quotation} - {self.rfq_item}"        