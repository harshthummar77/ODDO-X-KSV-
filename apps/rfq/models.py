from django.db import models
from django.conf import settings

from apps.core.models import BaseModel
from apps.vendors.models import Vendor


class RFQStatus(models.TextChoices):
    DRAFT = "DRAFT", "Draft"
    PUBLISHED = "PUBLISHED", "Published"
    CLOSED = "CLOSED", "Closed"
    CANCELLED = "CANCELLED", "Cancelled"

class UnitChoices(models.TextChoices):
    PIECE = "PIECE", "Piece"
    BOX = "BOX", "Box"
    LICENSE = "LICENSE", "License"
    SERVICE = "SERVICE", "Service"






class RFQ(BaseModel):
    rfq_number = models.CharField(
        max_length=50,
        unique=True
    )

    title = models.CharField(
        max_length=255
    )

    description = models.TextField()

    deadline = models.DateTimeField()   

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="rfqs"
    ) 
    status = models.CharField(
        max_length=20,
        choices=RFQStatus.choices,
        default=RFQStatus.DRAFT
    )
    def __str__(self):
        return self.rfq_number

class AssignmentStatus(models.TextChoices):
    INVITED = "INVITED", "Invited"
    VIEWED = "VIEWED", "Viewed"
    RESPONDED = "RESPONDED", "Responded"

class RFQItem(BaseModel):
    rfq = models.ForeignKey(
        RFQ,
        on_delete=models.CASCADE,
        related_name="items"
    )

    item_name = models.CharField(
        max_length=255
    )

    description = models.TextField(
        blank=True
    )

    quantity = models.PositiveIntegerField()

    unit = models.CharField(
        max_length=20,
        choices=UnitChoices.choices
    )

    def __str__(self):
        return self.item_name



class RFQVendorAssignment(BaseModel):
    rfq = models.ForeignKey(
        RFQ,
        on_delete=models.CASCADE,
        related_name="vendor_assignments"
    )

    vendor = models.ForeignKey(
        Vendor,
        on_delete=models.CASCADE,
        related_name="assigned_rfqs"
    )

    assigned_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="assigned_rfq_vendors"
    )

    status = models.CharField(
        max_length=20,
        choices=AssignmentStatus.choices,
        default=AssignmentStatus.INVITED
    )

    def __str__(self):
        return f"{self.rfq.rfq_number} - {self.vendor.vendor_name}"        