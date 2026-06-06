from django.urls import path

from .views import vendor_list

urlpatterns = [
    path(
        "",
        vendor_list,
        name="vendor_list"
    ),
]