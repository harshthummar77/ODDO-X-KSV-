from django.urls import path

from .views import (
    dashboard_view,
    admin_dashboard,
    procurement_dashboard,
    manager_dashboard,
    vendor_dashboard,
)

urlpatterns = [
    path("", dashboard_view, name="dashboard"),

    path(
        "admin-dashboard/",
        admin_dashboard,
        name="admin_dashboard"
    ),

    path(
        "procurement-dashboard/",
        procurement_dashboard,
        name="procurement_dashboard"
    ),

    path(
        "manager-dashboard/",
        manager_dashboard,
        name="manager_dashboard"
    ),

    path(
        "vendor-dashboard/",
        vendor_dashboard,
        name="vendor_dashboard"
    ),
]