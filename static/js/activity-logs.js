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
    } else if (type === 'danger') {
      icon = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
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
        showToast("Logged system checks cleared. All departments operational.", "success");
        if (notificationBadge) {
          notificationBadge.style.display = 'none';
        }
        hasNotifications = false;
      } else {
        showToast("No new unread notification events.", "info");
      }
    });
  }

  // --- Mock Audit Database ---
  const auditLogs = [
    { user: "Admin", action: "Approved Budget Requisition APR-2026-001", module: "Approvals", date: "2026-06-06", time: "10:30 AM", status: "Success" },
    { user: "Admin", action: "Compiled purchase billing file INV-2026-045", module: "Purchase Orders & Invoices", date: "2026-06-06", time: "10:15 AM", status: "Success" },
    { user: "Admin", action: "Dispatched Purchase Order PO-2026-004 to Acme Corp", module: "Purchase Orders & Invoices", date: "2026-06-05", time: "04:30 PM", status: "Success" },
    { user: "Sarah Jenkins", action: "Submitted proposal quotation bid for Steel Bolts", module: "Quotations", date: "2026-06-05", time: "01:25 PM", status: "Success" },
    { user: "John Carter", action: "Generated RFQ requirements sheet RFQ-2026-089", module: "RFQs", date: "2026-06-04", time: "11:15 AM", status: "Success" },
    { user: "Admin", action: "Registered supplier Stark Manufacturing as verified partner", module: "Vendors", date: "2026-06-04", time: "09:40 AM", status: "Success" },
    { user: "Tony Stark", action: "Submitted quotation bid for Raw Steel Blocks", module: "Quotations", date: "2026-06-03", time: "02:10 PM", status: "Success" },
    { user: "Admin", action: "Authorized change request for RFQ-2026-088 specifications", module: "RFQs", date: "2026-06-03", time: "10:15 AM", status: "Success" },
    { user: "Peter Gibbons", action: "Failed registration check - missing business license", module: "Vendors", date: "2026-06-02", time: "05:12 PM", status: "Error" },
    { user: "John Carter", action: "Canceled redundant draft request RFQ-2026-087", module: "RFQs", date: "2026-06-02", time: "03:45 PM", status: "Warning" },
    { user: "Sarah Jenkins", action: "Submitted quotation bid for Freight Logistics Support", module: "Quotations", date: "2026-06-02", time: "02:18 PM", status: "Success" },
    { user: "Admin", action: "Approved Budget Requisition APR-2026-003", module: "Approvals", date: "2026-06-02", time: "11:05 AM", status: "Success" },
    { user: "Admin", action: "Approved Budget Requisition APR-2026-004", module: "Approvals", date: "2026-06-02", time: "10:55 AM", status: "Success" },
    { user: "Bruce Wayne", action: "Rejected change request comments on APR-2026-005", module: "Approvals", date: "2026-06-01", time: "04:30 PM", status: "Error" },
    { user: "Admin", action: "Sent change request remarks for Requisition APR-2026-005", module: "Approvals", date: "2026-06-01", time: "03:15 PM", status: "Warning" },
    { user: "Admin", action: "Generated draft purchase order PO-2026-003", module: "Purchase Orders & Invoices", date: "2026-06-01", time: "11:20 AM", status: "Pending" },
    { user: "Admin", action: "Generated draft purchase order PO-2026-002", module: "Purchase Orders & Invoices", date: "2026-06-01", time: "11:15 AM", status: "Pending" },
    { user: "John Carter", action: "Registered supplier Acme Industrial Corp as partner", module: "Vendors", date: "2026-05-31", time: "09:30 AM", status: "Success" },
    { user: "Sarah Jenkins", action: "Registered supplier Globex Logistics Ltd as partner", module: "Vendors", date: "2026-05-31", time: "09:15 AM", status: "Success" },
    { user: "Admin", action: "Archived expired vendor profile Wayne Industrial Corp", module: "Vendors", date: "2026-05-30", time: "04:50 PM", status: "Warning" },
    { user: "John Carter", action: "Drafted RFQ specifications sheet RFQ-2026-086", module: "RFQs", date: "2026-05-29", time: "03:20 PM", status: "Success" },
    { user: "Admin", action: "Failed SMTP dispatch - notification system down", module: "RFQs", date: "2026-05-29", time: "11:00 AM", status: "Error" },
    { user: "Admin", action: "Successfully synced vendor compliance registry with external ERP", module: "Vendors", date: "2026-05-28", time: "05:00 PM", status: "Success" },
    { user: "Admin", action: "Approved Budget Requisition APR-2026-000", module: "Approvals", date: "2026-05-28", time: "02:30 PM", status: "Success" }
  ];

  // --- Filter and Search Logic Variables ---
  let filteredLogs = [...auditLogs];
  let currentPage = 1;
  const itemsPerPage = 8;

  // DOM Elements for Filters
  const activityTableBody = document.getElementById('activityTableBody');
  const activitySearchInput = document.getElementById('activitySearchInput');
  const globalSearchInput = document.getElementById('globalSearchInput');
  const moduleFilterSelect = document.getElementById('moduleFilterSelect');
  const dateFilterInput = document.getElementById('dateFilterInput');
  const clearFiltersBtn = document.getElementById('clearFiltersBtn');
  
  // DOM Elements for Pagination
  const paginationInfo = document.getElementById('paginationInfo');
  const prevPageBtn = document.getElementById('prevPageBtn');
  const nextPageBtn = document.getElementById('nextPageBtn');

  // DOM Elements for Notification Cards
  const notificationCards = document.querySelectorAll('.notification-card');

  // --- Render Table Page ---
  function renderTable() {
    if (!activityTableBody) return;
    
    activityTableBody.innerHTML = '';
    
    if (filteredLogs.length === 0) {
      // Render Empty State
      activityTableBody.innerHTML = `
        <tr>
          <td colspan="6">
            <div class="empty-state">
              <div class="empty-state-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </div>
              <h3 class="empty-state-title">No matching logs found</h3>
              <p class="empty-state-desc">Try clearing your filters or checking your search query spelling</p>
            </div>
          </td>
        </tr>
      `;
      
      if (paginationInfo) paginationInfo.textContent = 'Showing 0 to 0 of 0 entries';
      if (prevPageBtn) prevPageBtn.disabled = true;
      if (nextPageBtn) nextPageBtn.disabled = true;
      return;
    }

    // Pagination calculations
    const startIdx = (currentPage - 1) * itemsPerPage;
    const endIdx = Math.min(startIdx + itemsPerPage, filteredLogs.length);
    const pageItems = filteredLogs.slice(startIdx, endIdx);
    
    // Update pagination details
    if (paginationInfo) {
      paginationInfo.textContent = `Showing ${startIdx + 1} to ${endIdx} of ${filteredLogs.length} entries`;
    }
    
    if (prevPageBtn) prevPageBtn.disabled = (currentPage === 1);
    if (nextPageBtn) nextPageBtn.disabled = (endIdx >= filteredLogs.length);

    // Build row fragments
    pageItems.forEach(log => {
      const tr = document.createElement('tr');
      
      // Setup avatar characters based on User
      const avatarChars = log.user.substring(0, 2).toUpperCase();
      
      // Status Badge mapping
      let statusClass = 'success';
      if (log.status === 'Pending') statusClass = 'pending';
      if (log.status === 'Warning') statusClass = 'warning';
      if (log.status === 'Error') statusClass = 'error';
      
      tr.innerHTML = `
        <td>
          <div class="user-cell">
            <div class="user-avatar-sm">${avatarChars}</div>
            <span class="user-name">${log.user}</span>
          </div>
        </td>
        <td><span class="action-text">${log.action}</span></td>
        <td><span class="module-badge">${log.module}</span></td>
        <td>${formatDate(log.date)}</td>
        <td><span class="time-cell">${log.time}</span></td>
        <td><span class="status-badge ${statusClass}">${log.status}</span></td>
      `;
      
      activityTableBody.appendChild(tr);
    });
  }

  // Helper function to format Date (e.g. 2026-06-06 to Jun 06, 2026)
  function formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date)) return dateStr;
    const options = { month: 'short', day: '2-digit', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }

  // --- Filtering Engine ---
  function applyFilters() {
    const searchQuery = activitySearchInput ? activitySearchInput.value.toLowerCase().trim() : '';
    const globalQuery = globalSearchInput ? globalSearchInput.value.toLowerCase().trim() : '';
    const moduleFilter = moduleFilterSelect ? moduleFilterSelect.value : '';
    const dateFilter = dateFilterInput ? dateFilterInput.value : '';
    
    // Combine search values
    const searchVal = searchQuery || globalQuery;

    filteredLogs = auditLogs.filter(log => {
      // Search matching
      const matchesSearch = !searchVal || 
        log.user.toLowerCase().includes(searchVal) || 
        log.action.toLowerCase().includes(searchVal) || 
        log.module.toLowerCase().includes(searchVal) || 
        log.status.toLowerCase().includes(searchVal);
        
      // Module matching
      const matchesModule = !moduleFilter || log.module === moduleFilter;
      
      // Date matching
      const matchesDate = !dateFilter || log.date === dateFilter;
      
      return matchesSearch && matchesModule && matchesDate;
    });

    currentPage = 1; // Reset to page 1
    renderTable();
  }

  // --- Set Listeners ---
  if (activitySearchInput) {
    activitySearchInput.addEventListener('input', applyFilters);
  }

  if (globalSearchInput) {
    globalSearchInput.addEventListener('input', () => {
      // Sync inputs
      if (activitySearchInput) {
        activitySearchInput.value = globalSearchInput.value;
      }
      applyFilters();
    });
  }

  if (moduleFilterSelect) {
    moduleFilterSelect.addEventListener('change', () => {
      // Remove notification active card styles unless matched
      updateCardHighlightState();
      applyFilters();
    });
  }

  if (dateFilterInput) {
    dateFilterInput.addEventListener('change', applyFilters);
  }

  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener('click', () => {
      if (activitySearchInput) activitySearchInput.value = '';
      if (globalSearchInput) globalSearchInput.value = '';
      if (moduleFilterSelect) moduleFilterSelect.value = '';
      if (dateFilterInput) dateFilterInput.value = '';
      
      // Reset card highlights
      notificationCards.forEach(c => c.classList.remove('active-filter'));
      
      applyFilters();
      showToast("Audit logs filters successfully reset.", "success");
    });
  }

  // --- Notification Card Clicks ---
  notificationCards.forEach(card => {
    card.addEventListener('click', () => {
      const module = card.getAttribute('data-module');
      const alreadyActive = card.classList.contains('active-filter');
      
      notificationCards.forEach(c => c.classList.remove('active-filter'));
      
      if (alreadyActive) {
        // Toggle off
        if (moduleFilterSelect) moduleFilterSelect.value = '';
      } else {
        // Toggle on
        card.classList.add('active-filter');
        if (moduleFilterSelect) moduleFilterSelect.value = module;
        showToast(`Filtered audit logs by: ${module}`, 'info');
      }
      
      applyFilters();
    });
  });

  // Helper to maintain card active highlights if selected manually via dropdown
  function updateCardHighlightState() {
    const selectedVal = moduleFilterSelect ? moduleFilterSelect.value : '';
    notificationCards.forEach(card => {
      const module = card.getAttribute('data-module');
      if (selectedVal && module === selectedVal) {
        card.classList.add('active-filter');
      } else {
        card.classList.remove('active-filter');
      }
    });
  }

  // --- Pagination Button Clicks ---
  if (prevPageBtn) {
    prevPageBtn.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        renderTable();
      }
    });
  }

  if (nextPageBtn) {
    nextPageBtn.addEventListener('click', () => {
      const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
      if (currentPage < totalPages) {
        currentPage++;
        renderTable();
      }
    });
  }

  // --- Interactive Workflow Requisition Selector (Timeline) ---
  const workflowTimelineSelect = document.getElementById('workflowTimelineSelect');
  
  // Data for active timelines
  const timelineDatabase = {
    'APR-2026-001': {
      vendor: "Acme Industrial Corp",
      product: "High-Tensile Steel Bolts",
      rfq: "RFQ-2026-089",
      po: "PO-2026-004",
      invoice: "INV-2026-045",
      price: "$7,380.00 base",
      dates: {
        step1: "Jun 01, 2026 - 09:30 AM",
        step2: "Jun 02, 2026 - 11:15 AM",
        step3: "Jun 03, 2026 - 02:40 PM",
        step4: "Jun 04, 2026 - 04:20 PM",
        step5: "Jun 05, 2026 - 10:10 AM",
        step6: "Jun 06, 2026 - 10:30 AM"
      },
      users: {
        step1: "John Carter",
        step2: "John Carter",
        step3: "Sarah Jenkins",
        step4: "Administrator",
        step5: "Administrator",
        step6: "Administrator"
      }
    },
    'APR-2026-003': {
      vendor: "Stark Manufacturing",
      product: "Raw Steel Blocks",
      rfq: "RFQ-2026-091",
      po: "PO-2026-005",
      invoice: "INV-2026-046",
      price: "$8,850.00 base",
      dates: {
        step1: "Jun 02, 2026 - 09:40 AM",
        step2: "Jun 03, 2026 - 10:15 AM",
        step3: "Jun 03, 2026 - 02:10 PM",
        step4: "Jun 04, 2026 - 11:05 AM",
        step5: "Jun 05, 2026 - 09:30 AM",
        step6: "Jun 06, 2026 - 08:15 AM"
      },
      users: {
        step1: "Administrator",
        step2: "John Carter",
        step3: "Tony Stark",
        step4: "Administrator",
        step5: "Administrator",
        step6: "Administrator"
      }
    },
    'APR-2026-004': {
      vendor: "Globex Logistics Ltd",
      product: "Freight Logistics Support",
      rfq: "RFQ-2026-090",
      po: "PO-2026-006",
      invoice: "INV-2026-047",
      price: "$8,378.00 base",
      dates: {
        step1: "May 31, 2026 - 09:15 AM",
        step2: "Jun 01, 2026 - 10:30 AM",
        step3: "Jun 02, 2026 - 02:18 PM",
        step4: "Jun 03, 2026 - 10:55 AM",
        step5: "Jun 04, 2026 - 04:00 PM",
        step6: "Jun 05, 2026 - 03:30 PM"
      },
      users: {
        step1: "Sarah Jenkins",
        step2: "John Carter",
        step3: "Sarah Jenkins",
        step4: "Administrator",
        step5: "Administrator",
        step6: "Administrator"
      }
    }
  };

  if (workflowTimelineSelect) {
    workflowTimelineSelect.addEventListener('change', () => {
      const selectedId = workflowTimelineSelect.value;
      const data = timelineDatabase[selectedId];
      if (!data) return;

      // Update users
      document.getElementById('timelineStep1User').textContent = data.users.step1;
      document.getElementById('timelineStep2User').textContent = data.users.step2;
      document.getElementById('timelineStep3User').textContent = data.users.step3;
      document.getElementById('timelineStep4User').textContent = data.users.step4;
      document.getElementById('timelineStep5User').textContent = data.users.step5;
      document.getElementById('timelineStep6User').textContent = data.users.step6;

      // Update dates
      document.getElementById('timelineStep1Date').textContent = data.dates.step1;
      document.getElementById('timelineStep2Date').textContent = data.dates.step2;
      document.getElementById('timelineStep3Date').textContent = data.dates.step3;
      document.getElementById('timelineStep4Date').textContent = data.dates.step4;
      document.getElementById('timelineStep5Date').textContent = data.dates.step5;
      document.getElementById('timelineStep6Date').textContent = data.dates.step6;

      // Update descriptions
      document.getElementById('timelineStep1Desc').textContent = `${data.vendor} registered & verified by compliance office.`;
      document.getElementById('timelineStep2Desc').textContent = `${data.rfq} for ${data.product} drafted and dispatched.`;
      document.getElementById('timelineStep3Desc').textContent = `${data.vendor} submitted raw bid sheets: ${data.price}.`;
      document.getElementById('timelineStep4Desc').textContent = `CFO authorized requisition budget ${selectedId}.`;
      document.getElementById('timelineStep5Desc').textContent = `${data.po} drafted and sent to supplier.`;
      document.getElementById('timelineStep6Desc').textContent = `${data.invoice} compiled, awaiting standard checkout audit.`;

      showToast(`Timeline trace switched to: ${selectedId}`, 'success');
    });
  }

  // --- Initial Operations Run ---
  renderTable();
});
