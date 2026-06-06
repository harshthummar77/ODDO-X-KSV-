from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required


@login_required
def dashboard_view(request):

    role = request.user.role

    print("ROLE =", role)

    if role == "ADMIN":
        return redirect("admin_dashboard")

    elif role == "PROCUREMENT_OFFICER":
        return redirect("procurement_dashboard")

    elif role == "MANAGER":
        return redirect("manager_dashboard")

    elif role == "VENDOR":
        return redirect("vendor_dashboard")

    return redirect("login")


@login_required
def admin_dashboard(request):

    return render(
        request,
        "dashboard/dashboard.html",
        {
            "dashboard_title": "Admin Dashboard",
            "role": request.user.role
        }
    )


@login_required
def procurement_dashboard(request):

    return render(
        request,
        "dashboard/dashboard.html",
        {
            "dashboard_title": "Procurement Officer Dashboard",
            "role": request.user.role
        }
    )


@login_required
def manager_dashboard(request):

    return render(
        request,
        "dashboard/dashboard.html",
        {
            "dashboard_title": "Manager Dashboard",
            "role": request.user.role
        }
    )


@login_required
def vendor_dashboard(request):

    return render(
        request,
        "dashboard/dashboard.html",
        {
            "dashboard_title": "Vendor Dashboard",
            "role": request.user.role
        }
    )