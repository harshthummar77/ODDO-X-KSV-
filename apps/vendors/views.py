from django.shortcuts import render
from django.contrib.auth.decorators import login_required

from .models import Vendor


@login_required
def vendor_list(request):

    vendors = Vendor.objects.all().order_by("-created_at")

    return render(
        request,
        "vendors/vendor_list.html",
        {
            "vendors": vendors,
            "role": request.user.role,
        }
    )