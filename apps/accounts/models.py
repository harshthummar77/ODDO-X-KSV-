from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager


class UserRole(models.TextChoices):
    ADMIN = "ADMIN", "Admin"
    PROCUREMENT_OFFICER = "PROCUREMENT_OFFICER", "Procurement Officer"
    MANAGER = "MANAGER", "Manager"
    VENDOR = "VENDOR", "Vendor"


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Email is required")

        email = self.normalize_email(email)

        user = self.model(
            email=email,
            **extra_fields
        )

        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)
        extra_fields.setdefault("role", UserRole.ADMIN)

        return self.create_user(
            email=email,
            password=password,
            **extra_fields
        )

class UserStatus(models.TextChoices):
    ACTIVE = "ACTIVE", "Active"
    INACTIVE = "INACTIVE", "Inactive"

class User(AbstractUser):
    username = None

    email = models.EmailField(unique=True)

    

    role = models.CharField(
        max_length=30,
        choices=UserRole.choices,
        default=UserRole.ADMIN
    )

    status = models.CharField(
        max_length=20,
        choices=UserStatus.choices,
        default=UserStatus.ACTIVE
    )

    USERNAME_FIELD = "email"

    REQUIRED_FIELDS = []

    objects = UserManager()

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.email})"