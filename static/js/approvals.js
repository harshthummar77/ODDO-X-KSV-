document.addEventListener('DOMContentLoaded', () => {
  // --- Approvals Database Dataset ---
  const requestsData = {
    "APR-2026-001": {
      id: "APR-2026-001",
      rfqTitle: "Purchase of High-Tensile Steel Bolts",
      vendorName: "Acme Industrial Corp",
      submittedBy: "John Carter",
      delivery: "12 Days",
      warranty: "24 Months",
      amount: "$7,380.00",
      status: "pending",
      timelineDates: {
        step1: "Jun 01, 2026",
        step2: "Jun 03, 2026",
        step3: "Jun 05, 2026",
        step4: "Jun 06, 2026",
        step5: "-"
      },
      remarks: "",
      quotationDoc: "acme_steel_bolts_quotation_v2.pdf",
      specsDoc: "rfq_specifications_steel_blocks.pdf"
    },
    "APR-2026-002": {
      id: "APR-2026-002",
      rfqTitle: "IT Services Onboarding & Software",
      vendorName: "Initech Software",
      submittedBy: "Peter Gibbons",
      delivery: "18 Days",
      warranty: "36 Months",
      amount: "$9,184.00",
      status: "pending",
      timelineDates: {
        step1: "Jun 01, 2026",
        step2: "Jun 02, 2026",
        step3: "Jun 04, 2026",
        step4: "Jun 05, 2026",
        step5: "-"
      },
      remarks: "",
      quotationDoc: "initech_hardware_catalog_quotes.pdf",
      specsDoc: "rfq_it_software_onboard_specs.pdf"
    },
    "APR-2026-003": {
      id: "APR-2026-003",
      rfqTitle: "Raw Steel Blocks & Hardware",
      vendorName: "Stark Manufacturing",
      submittedBy: "Tony Stark",
      delivery: "10 Days",
      warranty: "18 Months",
      amount: "$8,850.00",
      status: "approved",
      timelineDates: {
        step1: "Jun 01, 2026",
        step2: "Jun 02, 2026",
        step3: "Jun 03, 2026",
        step4: "Jun 04, 2026",
        step5: "Jun 04, 2026"
      },
      remarks: "Verified with metallurgical quality report. Supplier is trusted. Requisition authorized.",
      quotationDoc: "stark_m12_bolts_pricing_v1.pdf",
      specsDoc: "rfq_raw_materials_steel_spec.pdf"
    },
    "APR-2026-004": {
      id: "APR-2026-004",
      rfqTitle: "Logistics & Supply Chain Support",
      vendorName: "Globex Logistics Ltd",
      submittedBy: "Sarah Jenkins",
      delivery: "14 Days",
      warranty: "12 Months",
      amount: "$8,378.00",
      status: "approved",
      timelineDates: {
        step1: "Jun 01, 2026",
        step2: "Jun 02, 2026",
        step3: "Jun 03, 2026",
        step4: "Jun 03, 2026",
        step5: "Jun 04, 2026"
      },
      remarks: "Lowest bidding logistics operator meeting the SLA. Approved.",
      quotationDoc: "globex_freight_quote_bolts.pdf",
      specsDoc: "rfq_supply_chain_logistics_v1.pdf"
    },
    "APR-2026-005": {
      id: "APR-2026-005",
      rfqTitle: "Security Systems Hardware",
      vendorName: "Wayne Industrial",
      submittedBy: "Bruce Wayne",
      delivery: "12 Days",
      warranty: "48 Months",
      amount: "$9,428.20",
      status: "rejected",
      timelineDates: {
        step1: "Jun 01, 2026",
        step2: "Jun 02, 2026",
        step3: "Jun 02, 2026",
        step4: "Jun 02, 2026",
        step5: "Jun 03, 2026"
      },
      remarks: "Exceeds authorized hardware budget limits. Rejected.",
      quotationDoc: "wayne_defense_specifications_quote.pdf",
      specsDoc: "rfq_security_systems_design.pdf"
    }
  };

  let currentlySelectedId = "APR-2026-001";

  // --- DOM Elements ---
  const tableRows = document.querySelectorAll('#approvalsTable tbody tr');
  const panelRequestTitle = document.getElementById('panelRequestTitle');
  const panelStatusBadge = document.getElementById('panelStatusBadge');
  const panelRfqTitle = document.getElementById('panelRfqTitle');
  const panelVendorName = document.getElementById('panelVendorName');
  const panelSubmittedBy = document.getElementById('panelSubmittedBy');
  const panelDelivery = document.getElementById('panelDelivery');
  const panelWarranty = document.getElementById('panelWarranty');
  const panelAmount = document.getElementById('panelAmount');
  const remarksInput = document.getElementById('remarksInput');

  // Timeline nodes
  const timelineStep1Date = document.getElementById('timelineStep1Date');
  const timelineStep2Date = document.getElementById('timelineStep2Date');
  const timelineStep3Date = document.getElementById('timelineStep3Date');
  const timelineStep4Date = document.getElementById('timelineStep4Date');
  const timelineStep5Date = document.getElementById('timelineStep5Date');
  const timelineStep5 = document.getElementById('timelineStep5');
  const timelineStep5Title = document.getElementById('timelineStep5Title');
  const timelineStep5Desc = document.getElementById('timelineStep5Desc');

  // KPI elements
  const kpiPending = document.getElementById('kpiPending');
  const kpiApproved = document.getElementById('kpiApproved');
  const kpiRejected = document.getElementById('kpiRejected');
  const kpiRate = document.getElementById('kpiRate');

  // Actions
  const approveBtn = document.getElementById('approveBtn');
  const rejectBtn = document.getElementById('rejectBtn');
  const changesBtn = document.getElementById('changesBtn');

  // --- Header Toggle Integrations ---
  const menuToggle = document.getElementById('menuToggle');
  const sidebar = document.getElementById('sidebar');
  const profileTrigger = document.getElementById('profileTrigger');
  const profileDropdown = document.getElementById('profileDropdown');
  const notificationBtn = document.getElementById('notificationBtn');
  const notificationBadge = document.getElementById('notificationBadge');

  if (menuToggle && sidebar) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      sidebar.classList.toggle('open');
    });
  }

  if (profileTrigger && profileDropdown) {
    profileTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isVisible = profileDropdown.style.display === 'flex';
      profileDropdown.style.display = isVisible ? 'none' : 'flex';
    });
  }

  // Clear unread bell notifications
  let unreadCount = 2;
  if (notificationBadge) {
    notificationBadge.textContent = unreadCount;
    notificationBadge.style.display = 'block';
  }

  if (notificationBtn) {
    notificationBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (unreadCount > 0) {
        showToast('ERP Dispatch: Requisitions APR-001 and APR-002 require CFO budget approvals.', 'success');
        if (notificationBadge) notificationBadge.style.display = 'none';
        unreadCount = 0;
      } else {
        showToast('No new notifications.', 'success');
      }
    });
  }

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

  // --- Update Right Details Panel ---
  function updateDetailsPanel(id) {
    const data = requestsData[id];
    if (!data) return;

    currentlySelectedId = id;

    // Highlight row in table
    tableRows.forEach(row => {
      if (row.getAttribute('data-request-id') === id) {
        row.classList.add('row-selected');
      } else {
        row.classList.remove('row-selected');
      }
    });

    // Reset remarks validation highlights
    remarksInput.classList.remove('error');

    // Update text fields
    panelRequestTitle.textContent = `${data.id} Details`;
    panelRfqTitle.textContent = data.rfqTitle;
    panelVendorName.textContent = data.vendorName;
    panelSubmittedBy.textContent = data.submittedBy;
    panelDelivery.textContent = data.delivery;
    panelWarranty.textContent = data.warranty;
    panelAmount.textContent = data.amount;
    remarksInput.value = data.remarks;

    // Update Details status badge
    updateStatusBadge(panelStatusBadge, data.status);

    // Update Timeline Step Dates
    timelineStep1Date.textContent = data.timelineDates.step1;
    timelineStep2Date.textContent = data.timelineDates.step2;
    timelineStep3Date.textContent = data.timelineDates.step3;
    timelineStep4Date.textContent = data.timelineDates.step4;
    timelineStep5Date.textContent = data.timelineDates.step5;

    // Update Final Timeline Step based on status
    timelineStep5.className = 'timeline-item';
    
    if (data.status === 'approved') {
      timelineStep5.classList.add('completed');
      timelineStep5Title.textContent = 'Approval Completed';
      timelineStep5Desc.textContent = 'PO requisition authorized & approved by CFO.';
    } else if (data.status === 'rejected') {
      timelineStep5.classList.add('rejected');
      timelineStep5Title.textContent = 'Approval Rejected';
      timelineStep5Desc.textContent = 'Procurement request rejected & closed.';
    } else if (data.status === 'changes') {
      timelineStep5.classList.add('active');
      timelineStep5Title.textContent = 'Changes Requested';
      timelineStep5Desc.textContent = 'Awaiting vendor details clarification.';
    } else {
      // Pending
      timelineStep5Title.textContent = 'Approval Completed';
      timelineStep5Desc.textContent = 'Pending final budget authorization decision.';
    }

    // Enable / Disable Action Buttons based on status (Disable if already decided)
    if (data.status !== 'pending') {
      approveBtn.disabled = true;
      rejectBtn.disabled = true;
      changesBtn.disabled = true;
      remarksInput.disabled = true;
      
      // Styling disabled states
      approveBtn.style.opacity = 0.5;
      rejectBtn.style.opacity = 0.5;
      changesBtn.style.opacity = 0.5;
    } else {
      approveBtn.disabled = false;
      rejectBtn.disabled = false;
      changesBtn.disabled = false;
      remarksInput.disabled = false;

      approveBtn.style.opacity = 1;
      rejectBtn.style.opacity = 1;
      changesBtn.style.opacity = 1;
    }
  }

  function updateStatusBadge(badgeEl, status) {
    badgeEl.className = 'status-badge';
    if (status === 'approved') {
      badgeEl.classList.add('approved');
      badgeEl.textContent = 'Approved';
    } else if (status === 'rejected') {
      badgeEl.classList.add('rejected');
      badgeEl.textContent = 'Rejected';
    } else if (status === 'changes') {
      badgeEl.classList.add('changes');
      badgeEl.textContent = 'Changes Req';
    } else {
      badgeEl.classList.add('pending');
      badgeEl.textContent = 'Pending';
    }
  }

  // Bind Table Row Listeners
  tableRows.forEach(row => {
    row.addEventListener('click', () => {
      const reqId = row.getAttribute('data-request-id');
      updateDetailsPanel(reqId);
    });
  });

  // Load default panel on startup
  updateDetailsPanel("APR-2026-001");

  // --- Dynamic KPI Recalculator ---
  function recalculateKpis() {
    let pending = 0;
    let approved = 0;
    let rejected = 0;

    Object.keys(requestsData).forEach(key => {
      const s = requestsData[key].status;
      if (s === 'pending') pending++;
      else if (s === 'approved') approved++;
      else if (s === 'rejected') rejected++;
    });

    const totalResolved = approved + rejected;
    const rate = totalResolved > 0 ? ((approved / totalResolved) * 100).toFixed(1) : "100";

    kpiPending.textContent = `${pending} Request${pending !== 1 ? 's' : ''}`;
    kpiApproved.textContent = `${approved} Request${approved !== 1 ? 's' : ''}`;
    kpiRejected.textContent = `${rejected} Request${rejected !== 1 ? 's' : ''}`;
    kpiRate.textContent = `${rate}%`;
  }

  // --- Setup Actions Click Handlers ---

  // Action: Approve
  approveBtn.addEventListener('click', () => {
    const data = requestsData[currentlySelectedId];
    if (!data || data.status !== 'pending') return;

    approveBtn.classList.add('loading');
    approveBtn.disabled = true;
    rejectBtn.disabled = true;
    changesBtn.disabled = true;
    remarksInput.disabled = true;

    setTimeout(() => {
      approveBtn.classList.remove('loading');
      
      // Update data state
      data.status = 'approved';
      data.remarks = remarksInput.value.trim() || 'Approved by Administrator.';
      
      // Current date
      const today = new Date();
      const options = { month: 'short', day: '2-digit', year: 'numeric' };
      data.timelineDates.step5 = today.toLocaleDateString('en-US', options);

      // Refresh Panel UI
      updateDetailsPanel(currentlySelectedId);

      // Update Table row badge
      const targetRow = document.querySelector(`tr[data-request-id="${currentlySelectedId}"]`);
      if (targetRow) {
        const rowBadge = targetRow.querySelector('.status-badge');
        updateStatusBadge(rowBadge, 'approved');
      }

      recalculateKpis();
      showToast(`Request ${currentlySelectedId} approved. Purchase Order generated successfully!`, 'success');
    }, 1200);
  });

  // Action: Reject
  rejectBtn.addEventListener('click', () => {
    const data = requestsData[currentlySelectedId];
    if (!data || data.status !== 'pending') return;

    const remarksVal = remarksInput.value.trim();
    if (!remarksVal) {
      remarksInput.classList.add('error');
      showToast('Please enter comments outlining the rejection reason.', 'danger');
      remarksInput.focus();
      return;
    }

    // Set status to rejected
    data.status = 'rejected';
    data.remarks = remarksVal;
    
    const today = new Date();
    const options = { month: 'short', day: '2-digit', year: 'numeric' };
    data.timelineDates.step5 = today.toLocaleDateString('en-US', options);

    updateDetailsPanel(currentlySelectedId);

    const targetRow = document.querySelector(`tr[data-request-id="${currentlySelectedId}"]`);
    if (targetRow) {
      const rowBadge = targetRow.querySelector('.status-badge');
      updateStatusBadge(rowBadge, 'rejected');
    }

    recalculateKpis();
    showToast(`Request ${currentlySelectedId} has been rejected.`, 'danger');
  });

  // Action: Request Changes
  changesBtn.addEventListener('click', () => {
    const data = requestsData[currentlySelectedId];
    if (!data || data.status !== 'pending') return;

    const remarksVal = remarksInput.value.trim();
    if (!remarksVal) {
      remarksInput.classList.add('error');
      showToast('Please enter comments detailing the changes required.', 'warning');
      remarksInput.focus();
      return;
    }

    // Set status to changes
    data.status = 'changes';
    data.remarks = remarksVal;
    
    const today = new Date();
    const options = { month: 'short', day: '2-digit', year: 'numeric' };
    data.timelineDates.step5 = today.toLocaleDateString('en-US', options);

    updateDetailsPanel(currentlySelectedId);

    const targetRow = document.querySelector(`tr[data-request-id="${currentlySelectedId}"]`);
    if (targetRow) {
      const rowBadge = targetRow.querySelector('.status-badge');
      updateStatusBadge(rowBadge, 'changes');
    }

    recalculateKpis();
    showToast(`Clarification requested for requisition ${currentlySelectedId}.`, 'warning');
  });

  // Remove error boundary highlight on typing
  remarksInput.addEventListener('input', () => {
    remarksInput.classList.remove('error');
  });

  // --- Document Viewer Modal Interactions ---
  const docModal = document.getElementById('docModal');
  const viewDocsBtn = document.getElementById('viewDocsBtn');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalCloseFooterBtn = document.getElementById('modalCloseFooterBtn');
  const docQuotationName = document.getElementById('docQuotationName');

  function openDocModal() {
    const data = requestsData[currentlySelectedId];
    if (!data) return;

    docQuotationName.textContent = data.quotationDoc;
    docModal.style.display = 'flex';
  }

  if (viewDocsBtn) viewDocsBtn.addEventListener('click', openDocModal);

  function closeDocModal() {
    docModal.style.display = 'none';
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeDocModal);
  if (modalCloseFooterBtn) modalCloseFooterBtn.addEventListener('click', closeDocModal);

  if (docModal) {
    docModal.addEventListener('click', (e) => {
      if (e.target === docModal) closeDocModal();
    });
  }

  // --- Toast Notifications helper ---
  const toastContainer = document.getElementById('toastContainer');
  function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="16"></line>
        <line x1="8" y1="12" x2="16" y2="12"></line>
      </svg>
      <span>${message}</span>
    `;
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
      toast.style.animation = 'slideInRight 0.3s reverse forwards';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }
});
