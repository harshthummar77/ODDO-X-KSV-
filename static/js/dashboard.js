document.addEventListener('DOMContentLoaded', () => {
  // --- Dynamic Current Date ---
  const dateEl = document.getElementById('currentDate');
  if (dateEl) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const today = new Date();
    dateEl.textContent = today.toLocaleDateString('en-US', options);
  }

  // --- Profile Dropdown Toggle ---
  const profileTrigger = document.getElementById('profileTrigger');
  const profileDropdown = document.getElementById('profileDropdown');

  profileTrigger.addEventListener('click', (e) => {
    e.stopPropagation();
    const isVisible = profileDropdown.style.display === 'flex';
    profileDropdown.style.display = isVisible ? 'none' : 'flex';
  });

  // --- Notification Bell Toggle ---
  const notificationBtn = document.getElementById('notificationBtn');
  const notificationBadge = document.getElementById('notificationBadge');
  let hasNotifications = true;

  // Initial state: show unread badge
  if (notificationBadge) {
    notificationBadge.style.display = 'block';
  }

  notificationBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (hasNotifications) {
      alert("ERP Notifications:\n1. RFQ-089 has been sent to 5 suppliers.\n2. Invoice INV-042 requires approval.\n3. Stark Ind updated their quote.");
      if (notificationBadge) {
        notificationBadge.style.display = 'none'; // Clear notifications
      }
      hasNotifications = false;
    } else {
      alert("No new ERP notifications.");
    }
  });

  // --- Mobile Sidebar Toggle ---
  const menuToggle = document.getElementById('menuToggle');
  const sidebar = document.getElementById('sidebar');

  menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    sidebar.classList.toggle('open');
  });

  // Close dropdowns and sidebar on outside clicks
  document.addEventListener('click', (e) => {
    if (profileDropdown && profileDropdown.style.display === 'flex') {
      if (!profileTrigger.contains(e.target) && !profileDropdown.contains(e.target)) {
        profileDropdown.style.display = 'none';
      }
    }

    if (sidebar && sidebar.classList.contains('open')) {
      if (!menuToggle.contains(e.target) && !sidebar.contains(e.target)) {
        sidebar.classList.remove('open');
      }
    }
  });

  // --- Interactive Chart Tooltips (SVG Hover) ---
  
  // Spend Overview Line Graph
  const spendPoints = document.querySelectorAll('#spendOverviewChart .chart-point');
  const spendTooltip = document.getElementById('spendTooltip');

  spendPoints.forEach(point => {
    point.addEventListener('mouseenter', (e) => {
      const val = point.getAttribute('data-val');
      const label = point.getAttribute('data-label');
      
      spendTooltip.innerHTML = `<strong>${label}:</strong> ${val}`;
      spendTooltip.style.display = 'block';
      
      // Position tooltip relative to container coordinates
      positionTooltip(e, spendTooltip, point.closest('.chart-container'));
    });

    point.addEventListener('mouseleave', () => {
      spendTooltip.style.display = 'none';
    });
  });

  // Vendor Performance Bar Chart
  const vendorBars = document.querySelectorAll('#vendorPerformanceChart .chart-bar');
  const performanceTooltip = document.getElementById('performanceTooltip');

  vendorBars.forEach(bar => {
    bar.addEventListener('mouseenter', (e) => {
      const val = bar.getAttribute('data-val');
      const label = bar.getAttribute('data-label');
      
      performanceTooltip.innerHTML = `<strong>${label}:</strong> ${val} Rating`;
      performanceTooltip.style.display = 'block';
      
      positionTooltip(e, performanceTooltip, bar.closest('.chart-container'));
    });

    bar.addEventListener('mouseleave', () => {
      performanceTooltip.style.display = 'none';
    });
  });

  // Helper function to position tooltip neatly
  function positionTooltip(event, tooltipEl, containerEl) {
    const containerRect = containerEl.getBoundingClientRect();
    const x = event.clientX - containerRect.left;
    const y = event.clientY - containerRect.top;
    
    tooltipEl.style.left = `${x}px`;
    tooltipEl.style.top = `${y}px`;
  }

  // --- Quick Actions Action Banners ---
  const actionAddVendor = document.getElementById('actionAddVendor');
  const actionCreateRfq = document.getElementById('actionCreateRfq');
  const actionCompareQuotes = document.getElementById('actionCompareQuotes');
  const actionGenInvoice = document.getElementById('actionGenInvoice');

  if (actionAddVendor) {
    actionAddVendor.addEventListener('click', () => {
      window.location.href = 'vendors.html';
    });
  }

  if (actionCreateRfq) {
    actionCreateRfq.addEventListener('click', () => {
      window.location.href = 'rfq.html';
    });
  }

  if (actionCompareQuotes) {
    actionCompareQuotes.addEventListener('click', () => {
      window.location.href = 'comparison.html';
    });
  }

  if (actionGenInvoice) {
    actionGenInvoice.addEventListener('click', () => {
      alert("Triggered Module: 'Generate PO Billing Invoice'. Compiling pending receipts metadata...");
    });
  }
});
