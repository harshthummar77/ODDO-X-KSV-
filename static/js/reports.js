document.addEventListener('DOMContentLoaded', () => {
  
  // --- Profile Dropdown Toggle ---
  const profileTrigger = document.getElementById('profileTrigger');
  const profileDropdown = document.getElementById('profileDropdown');

  if (profileTrigger && profileDropdown) {
    profileTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isVisible = profileDropdown.style.display === 'flex';
      profileDropdown.style.display = isVisible ? 'none' : 'flex';
    });
  }

  // --- Mobile Sidebar Toggle ---
  const menuToggle = document.getElementById('menuToggle');
  const sidebar = document.getElementById('sidebar');

  if (menuToggle && sidebar) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      sidebar.classList.toggle('open');
    });
  }

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

  // --- Toast Alert Dispatcher ---
  const toastContainer = document.getElementById('toastContainer');
  function showToast(message, type = 'info') {
    if (!toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    // Icon selection
    let icon = '';
    if (type === 'success') {
      icon = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
    } else if (type === 'warning') {
      icon = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>';
    } else {
      icon = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';
    }
    
    toast.innerHTML = `${icon}<span>${message}</span>`;
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // --- Notification Bell Icon Alert ---
  const notificationBtn = document.getElementById('notificationBtn');
  const notificationBadge = document.getElementById('notificationBadge');
  let hasNotifications = true;

  if (notificationBadge) {
    notificationBadge.style.display = 'block';
  }

  if (notificationBtn) {
    notificationBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (hasNotifications) {
        showToast("System reports compiler checks cleared. Data feeds synced.", "success");
        if (notificationBadge) {
          notificationBadge.style.display = 'none';
        }
        hasNotifications = false;
      } else {
        showToast("No new notification warnings logged.", "info");
      }
    });
  }

  // --- SVG Charts Tooltip Listeners ---
  setupChartTooltip('trendsChartContainer', 'trendsTooltip');
  setupChartTooltip('spendChartContainer', 'spendTooltip');
  setupChartTooltip('vendorChartContainer', 'vendorTooltip');
  setupChartTooltip('approvalChartContainer', 'approvalTooltip');

  function setupChartTooltip(containerId, tooltipId) {
    const container = document.getElementById(containerId);
    const tooltip = document.getElementById(tooltipId);
    if (!container || !tooltip) return;

    // Listen to hover events on elements with data attributes
    const hoverables = container.querySelectorAll('.chart-point, .chart-bar, .chart-horizontal-bar, .chart-donut-segment');
    
    hoverables.forEach(item => {
      item.addEventListener('mouseenter', (e) => {
        const val = item.getAttribute('data-val');
        const label = item.getAttribute('data-label');
        
        tooltip.innerHTML = `<strong>${label}:</strong> ${val}`;
        tooltip.style.display = 'block';
        
        positionTooltip(e, tooltip, container);
      });

      item.addEventListener('mousemove', (e) => {
        positionTooltip(e, tooltip, container);
      });

      item.addEventListener('mouseleave', () => {
        tooltip.style.display = 'none';
      });
    });
  }

  function positionTooltip(event, tooltipEl, containerEl) {
    const containerRect = containerEl.getBoundingClientRect();
    const x = event.clientX - containerRect.left;
    const y = event.clientY - containerRect.top;
    
    tooltipEl.style.left = `${x}px`;
    tooltipEl.style.top = `${y}px`;
  }

  // --- Reports Database Array ---
  const reportsData = [
    {
      id: "REP-2026-001",
      name: "Q2 Spend Summary Report",
      date: "2026-06-06",
      category: "Revenues & Spends",
      status: "active",
      vendor: "Acme Industrial Corp",
      items: [
        { ref: "INV-2026-045", vendor: "Acme Industrial Corp", category: "Raw Hardware", amount: "$7,380.00" },
        { ref: "INV-2026-046", vendor: "Stark Manufacturing", category: "Precision blocks", amount: "$8,850.00" },
        { ref: "INV-2026-047", vendor: "Globex Logistics Ltd", category: "Freight Services", amount: "$8,378.00" }
      ]
    },
    {
      id: "REP-2026-002",
      name: "Supplier Response Compliance Audit",
      date: "2026-06-04",
      category: "Compliance SLA",
      status: "completed",
      vendor: "Stark Manufacturing",
      items: [
        { ref: "APR-2026-003", vendor: "Stark Manufacturing", category: "SLA Response", amount: "1.8 Days response" },
        { ref: "APR-2026-001", vendor: "Acme Industrial Corp", category: "SLA Response", amount: "2.2 Days response" },
        { ref: "APR-2026-004", vendor: "Globex Logistics Ltd", category: "SLA Response", amount: "3.1 Days response" }
      ]
    },
    {
      id: "REP-2026-003",
      name: "Monthly Procurement Savings Report",
      date: "2026-05-28",
      category: "Revenues & Spends",
      status: "completed",
      vendor: "Globex Logistics Ltd",
      items: [
        { ref: "SAV-2026-102", vendor: "Acme Industrial Corp", category: "Bulk discount saving", amount: "$1,250.00" },
        { ref: "SAV-2026-103", vendor: "Globex Logistics Ltd", category: "Optimized shipping save", amount: "$820.00" }
      ]
    },
    {
      id: "REP-2026-004",
      name: "Active RFQs Metrics Analysis",
      date: "2026-05-15",
      category: "Requisitions",
      status: "completed",
      vendor: "Initech Software",
      items: [
        { ref: "RFQ-2026-089", vendor: "Multiple suppliers", category: "Steel Bolts Bid", amount: "3 Quotations" },
        { ref: "RFQ-2026-091", vendor: "Multiple suppliers", category: "Steel Blocks Bid", amount: "2 Quotations" }
      ]
    },
    {
      id: "REP-2026-005",
      name: "Vendor Quality Ratings Report",
      date: "2026-05-02",
      category: "Vendor Performance",
      status: "draft",
      vendor: "Initech Software",
      items: [
        { ref: "RAT-2026-09", vendor: "Acme Industrial Corp", category: "Quality check score", amount: "4.9/5 Rating" },
        { ref: "RAT-2026-10", vendor: "Stark Manufacturing", category: "Quality check score", amount: "4.8/5 Rating" }
      ]
    }
  ];

  // DOM Elements for Report List rendering
  const reportsTableBody = document.getElementById('reportsTableBody');
  const dateStartInput = document.getElementById('dateStartInput');
  const dateEndInput = document.getElementById('dateEndInput');
  const vendorFilterSelect = document.getElementById('vendorFilterSelect');
  const categoryFilterSelect = document.getElementById('categoryFilterSelect');
  const clearFiltersBtn = document.getElementById('clearFiltersBtn');
  
  // Filter variables
  let filteredReports = [...reportsData];

  // --- Render Reports Table ---
  function renderTable() {
    if (!reportsTableBody) return;
    reportsTableBody.innerHTML = '';
    
    if (filteredReports.length === 0) {
      reportsTableBody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align: center; padding: 32px; color: var(--text-light);">No reports matches found</td>
        </tr>
      `;
      return;
    }

    filteredReports.forEach(rep => {
      const tr = document.createElement('tr');
      
      let badgeClass = 'completed';
      if (rep.status === 'active') badgeClass = 'active';
      if (rep.status === 'draft') badgeClass = 'draft';

      tr.innerHTML = `
        <td class="report-name-cell">${rep.name}</td>
        <td>${formatDate(rep.date)}</td>
        <td><span class="category-tag">${rep.category}</span></td>
        <td><span class="status-badge ${badgeClass}">${rep.status}</span></td>
        <td style="text-align: right;">
          <div class="action-buttons-group" style="justify-content: flex-end;">
            <button class="btn-report btn-report-primary btn-view" data-id="${rep.id}">View</button>
            <button class="btn-report btn-download" data-name="${rep.name}">Download</button>
            <button class="btn-report btn-pdf" data-name="${rep.name}">PDF</button>
            <button class="btn-report btn-excel" data-name="${rep.name}">Excel</button>
          </div>
        </td>
      `;

      reportsTableBody.appendChild(tr);
    });

    bindRowActions();
  }

  // Format date label helper
  function formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date)) return dateStr;
    const options = { month: 'short', day: '2-digit', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }

  // --- Filtering Logic ---
  function applyFilters() {
    const dateStart = dateStartInput ? dateStartInput.value : '';
    const dateEnd = dateEndInput ? dateEndInput.value : '';
    const vendorVal = vendorFilterSelect ? vendorFilterSelect.value : '';
    const categoryVal = categoryFilterSelect ? categoryFilterSelect.value : '';

    filteredReports = reportsData.filter(rep => {
      // Date range checks
      let matchesDate = true;
      if (dateStart && rep.date < dateStart) matchesDate = false;
      if (dateEnd && rep.date > dateEnd) matchesDate = false;

      // Vendor matches
      const matchesVendor = !vendorVal || rep.vendor === vendorVal;

      // Category matches
      const matchesCategory = !categoryVal || rep.category === categoryVal;

      return matchesDate && matchesVendor && matchesCategory;
    });

    renderTable();
  }

  // Set Listeners
  if (dateStartInput) dateStartInput.addEventListener('change', applyFilters);
  if (dateEndInput) dateEndInput.addEventListener('change', applyFilters);
  if (vendorFilterSelect) vendorFilterSelect.addEventListener('change', applyFilters);
  if (categoryFilterSelect) categoryFilterSelect.addEventListener('change', applyFilters);
  
  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener('click', () => {
      if (dateStartInput) dateStartInput.value = '';
      if (dateEndInput) dateEndInput.value = '';
      if (vendorFilterSelect) vendorFilterSelect.value = '';
      if (categoryFilterSelect) categoryFilterSelect.value = '';
      filteredReports = [...reportsData];
      renderTable();
      showToast("Reports search filters cleared.", "success");
    });
  }

  // --- Modal Viewer Controls ---
  const reportDetailsModal = document.getElementById('reportDetailsModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalCloseFooterBtn = document.getElementById('modalCloseFooterBtn');
  const modalExportPdfBtn = document.getElementById('modalExportPdfBtn');

  const modalReportTitle = document.getElementById('modalReportTitle');
  const modalReportDate = document.getElementById('modalReportDate');
  const modalReportCategory = document.getElementById('modalReportCategory');
  const modalDataTableBody = document.getElementById('modalDataTableBody');

  function openModal(reportId) {
    const report = reportsData.find(r => r.id === reportId);
    if (!report) return;

    modalReportTitle.textContent = report.name;
    modalReportDate.textContent = formatDate(report.date);
    modalReportCategory.textContent = report.category;
    
    modalDataTableBody.innerHTML = '';
    report.items.forEach(item => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${item.ref}</strong></td>
        <td>${item.vendor}</td>
        <td>${item.category}</td>
        <td style="text-align: right; font-weight: 600;">${item.amount}</td>
      `;
      modalDataTableBody.appendChild(tr);
    });

    if (reportDetailsModal) {
      reportDetailsModal.style.display = 'flex';
    }
  }

  function closeModal() {
    if (reportDetailsModal) {
      reportDetailsModal.style.display = 'none';
    }
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modalCloseFooterBtn) modalCloseFooterBtn.addEventListener('click', closeModal);
  
  // Close modal on background backdrop clicks
  if (reportDetailsModal) {
    reportDetailsModal.addEventListener('click', (e) => {
      if (e.target === reportDetailsModal) closeModal();
    });
  }

  if (modalExportPdfBtn) {
    modalExportPdfBtn.addEventListener('click', () => {
      modalExportPdfBtn.textContent = 'Processing PDF...';
      modalExportPdfBtn.disabled = true;
      setTimeout(() => {
        closeModal();
        showToast("PDF report successfully downloaded.", "success");
        modalExportPdfBtn.textContent = 'Export PDF';
        modalExportPdfBtn.disabled = false;
      }, 1500);
    });
  }

  // --- Row Action Button Triggers ---
  function bindRowActions() {
    const viewButtons = document.querySelectorAll('.btn-view');
    viewButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const repId = btn.getAttribute('data-id');
        openModal(repId);
      });
    });

    const downloadButtons = document.querySelectorAll('.btn-download');
    downloadButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const name = btn.getAttribute('data-name');
        showToast(`Initiating file download for: ${name}`, 'info');
        setTimeout(() => {
          showToast(`File download completed: ${name}.csv`, 'success');
        }, 1200);
      });
    });

    const pdfButtons = document.querySelectorAll('.btn-pdf');
    pdfButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const name = btn.getAttribute('data-name');
        btn.textContent = 'PDF...';
        btn.disabled = true;
        setTimeout(() => {
          showToast(`PDF document generated for: ${name}`, 'success');
          btn.textContent = 'PDF';
          btn.disabled = false;
        }, 1200);
      });
    });

    const excelButtons = document.querySelectorAll('.btn-excel');
    excelButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const name = btn.getAttribute('data-name');
        btn.textContent = 'XLS...';
        btn.disabled = true;
        setTimeout(() => {
          showToast(`Excel spreadsheet generated for: ${name}`, 'success');
          btn.textContent = 'Excel';
          btn.disabled = false;
        }, 1200);
      });
    });
  }

  // --- Initial Render ---
  renderTable();
});
