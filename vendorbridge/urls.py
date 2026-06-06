from django.contrib import admin
from django.urls import include
from django.urls import path

urlpatterns = [

    path(
        "admin/",
        admin.site.urls
    ),

    path(
        "accounts/",
        include("apps.accounts.urls")
    ),

    path(
        "",
        include("apps.dashboard.urls")
    ),
    path(
        "vendors/",
        include("apps.vendors.urls")
    ),
]