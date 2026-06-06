from django.db import models
from django.conf import settings

from apps.core.models import BaseModel
from apps.quotations.models import Quotation


class ApprovalStatus(models.TextChoices):
    PENDING = "PENDING", "Pending"
    APPROVED = "APPROVED", "Approved"
    REJECTED = "REJECTED", "Rejected"


class Approval(BaseModel):
    quotation = models.OneToOneField(
        Quotation,
        on_delete=models.CASCADE,
        related_name="approval"
    )

    approver = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="approvals"
    )

    status = models.CharField(
        max_length=20,
        choices=ApprovalStatus.choices,
        default=ApprovalStatus.PENDING
    )

    remarks = models.TextField(
        blank=True
    )

    approved_at = models.DateTimeField(
        null=True,
        blank=True
    )

    def __str__(self):
        return f"{self.quotation} - {self.status}"