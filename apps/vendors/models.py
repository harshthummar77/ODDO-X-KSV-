from django.db import models

from apps.core.models import BaseModel
from django.conf import settings


class VendorStatus(models.TextChoices):
    ACTIVE = "ACTIVE", "Active"
    INACTIVE = "INACTIVE", "Inactive"
    SUSPENDED = "SUSPENDED", "Suspended"


class VendorCategory(models.TextChoices):
    HARDWARE = "HARDWARE", "Hardware"
    SOFTWARE = "SOFTWARE", "Software"
    SERVICES = "SERVICES", "Services"
    OTHER = "OTHER", "Other"

class Vendor(BaseModel):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="vendor_profile",
        null=True,
        blank=True
    )
    vendor_name = models.CharField(max_length=255)

    contact_person = models.CharField(
        max_length=255
    )

    email = models.EmailField(
        unique=True
    )

    phone_number = models.CharField(
        max_length=20
    )

    gst_number = models.CharField(
        max_length=50,
        unique=True
    )

    address = models.TextField()

    category = models.CharField(
        max_length=50,
        choices=VendorCategory.choices
    )

    status = models.CharField(
        max_length=20,
        choices=VendorStatus.choices,
        default=VendorStatus.ACTIVE
    )
    def __str__(self):
        return self.vendor_name