document.addEventListener('DOMContentLoaded', () => {
  // --- Approved Requisitions Dataset ---
  const requisitionsDb = {
    "APR-2026-001": {
      vendorName: "Acme Industrial Corp",
      companyType: "Raw Materials Supplier",
      repName: "John Carter",
      rfqRef: "RFQ-2026-089",
      productName: "Steel Bolts M12",
      qty: "5,000 Units",
      unitPrice: "$1.25",
      baseAmount: "$6,254.24",
      gstAmount: "$1,125.76",
      grandTotal: "$7,380.00",
      poNumber: "PO-2026-004",
      invNumber: "INV-2026-045"
    },
    "APR-2026-003": {
      vendorName: "Stark Manufacturing",
      companyType: "Heavy Hardware & Forging",
      repName: "Tony Stark",
      rfqRef: "RFQ-2026-088",
      productName: "Raw Steel Blocks Grade A",
      qty: "250 Blocks",
      unitPrice: "$30.00",
      baseAmount: "$7,500.00",
      gstAmount: "$1,350.00",
      grandTotal: "$8,850.00",
      poNumber: "PO-2026-005",
      invNumber: "INV-2026-046"
    },
    "APR-2026-004": {
      vendorName: "Globex Logistics Ltd",
      companyType: "Supply Chain & Freight",
      repName: "Sarah Jenkins",
      rfqRef: "RFQ-2026-087",
      productName: "Freight Logistics Routing",
      qty: "1 Job",
      unitPrice: "$7,100.00",
      baseAmount: "$7,100.00",
      gstAmount: "$1,278.00",
      grandTotal: "$8,378.00",
      poNumber: "PO-2026-006",
      invNumber: "INV-2026-047"
    }
  };

  let currentlySelectedRequisition = null;

  // --- Sidebar & Navbar Controllers ---
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
  let hasNotifications = true;
  if (notificationBadge) {
    notificationBadge.style.display = 'block';
  }

  if (notificationBtn) {
    notificationBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (hasNotifications) {
        showToast('ERP Dispatch: Requisitions APR-001 and APR-003 approved. Generate Purchase Orders.', 'success');
        if (notificationBadge) notificationBadge.style.display = 'none';
        hasNotifications = false;
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

  // --- UI Elements Bindings ---
  const requisitionSelect = document.getElementById('requisitionSelect');
  const kpiSubtotal = document.getElementById('kpiSubtotal');
  const kpiGst = document.getElementById('kpiGst');
  const kpiGrandTotal = document.getElementById('kpiGrandTotal');
  const kpiPaymentStatus = document.getElementById('kpiPaymentStatus');

  // PO fields
  const lblPoNumber = document.getElementById('lblPoNumber');
  const lblPoVendor = document.getElementById('lblPoVendor');
  const lblPoRfq = document.getElementById('lblPoRfq');
  const lblPoProduct = document.getElementById('lblPoProduct');
  const lblPoQty = document.getElementById('lblPoQty');
  const lblPoUnitPrice = document.getElementById('lblPoUnitPrice');
  const lblPoSubtotal = document.getElementById('lblPoSubtotal');
  const poStatusBadge = document.getElementById('poStatusBadge');

  // Invoice fields
  const lblInvNumber = document.getElementById('lblInvNumber');
  const lblInvVendor = document.getElementById('lblInvVendor');
  const lblInvPoNumber = document.getElementById('lblInvPoNumber');
  const lblInvSubtotal = document.getElementById('lblInvSubtotal');
  const lblInvGst = document.getElementById('lblInvGst');
  const lblInvTotal = document.getElementById('lblInvTotal');
  const invStatusBadge = document.getElementById('invStatusBadge');

  // Action Buttons
  const generatePoBtn = document.getElementById('generatePoBtn');
  const downloadPoBtn = document.getElementById('downloadPoBtn');
  const generateInvBtn = document.getElementById('generateInvBtn');
  const printInvBtn = document.getElementById('printInvBtn');
  const sendEmailBtn = document.getElementById('sendEmailBtn');

  // Receipt Preview
  const invoicePreviewCard = document.getElementById('invoicePreviewCard');
  const receiptInvoiceNum = document.getElementById('receiptInvoiceNum');
  const receiptVendorName = document.getElementById('receiptVendorName');
  const receiptVendorType = document.getElementById('receiptVendorType');
  const receiptVendorRep = document.getElementById('receiptVendorRep');
  const receiptItemName = document.getElementById('receiptItemName');
  const receiptPoRef = document.getElementById('receiptPoRef');
  const receiptQty = document.getElementById('receiptQty');
  const receiptUnitPrice = document.getElementById('receiptUnitPrice');
  const receiptBaseAmount = document.getElementById('receiptBaseAmount');
  const receiptSubtotal = document.getElementById('receiptSubtotal');
  const receiptGst = document.getElementById('receiptGst');
  const receiptGrandTotal = document.getElementById('receiptGrandTotal');
  const markPaidBtn = document.getElementById('markPaidBtn');

  // --- Change Selector Listener ---
  requisitionSelect.addEventListener('change', () => {
    const val = requisitionSelect.value;
    if (!val) {
      clearAllFields();
      return;
    }

    const data = requisitionsDb[val];
    currentlySelectedRequisition = data;

    // Populate Top KPI Cards (immediate preview)
    kpiSubtotal.textContent = data.baseAmount;
    kpiGst.textContent = data.gstAmount;
    kpiGrandTotal.textContent = data.grandTotal;
    
    kpiPaymentStatus.className = 'status-badge draft';
    kpiPaymentStatus.textContent = 'Draft';

    // Populate Purchase Order Details
    lblPoNumber.textContent = data.poNumber;
    lblPoVendor.textContent = data.vendorName;
    lblPoRfq.textContent = data.rfqRef;
    lblPoProduct.textContent = data.productName;
    lblPoQty.textContent = data.qty;
    lblPoUnitPrice.textContent = data.unitPrice;
    lblPoSubtotal.textContent = data.baseAmount;

    poStatusBadge.className = 'status-badge draft';
    poStatusBadge.textContent = 'Draft';

    // Populate Invoice details
    lblInvNumber.textContent = data.invNumber;
    lblInvVendor.textContent = `${data.vendorName} Billing`;
    lblInvPoNumber.textContent = data.poNumber;
    lblInvSubtotal.textContent = data.baseAmount;
    lblInvGst.textContent = data.gstAmount;
    lblInvTotal.textContent = data.grandTotal;

    invStatusBadge.className = 'status-badge draft';
    invStatusBadge.textContent = 'Draft';

    // Enable/Disable Action Buttons
    generatePoBtn.disabled = false;
    downloadPoBtn.disabled = true;
    generateInvBtn.disabled = true;
    printInvBtn.disabled = true;
    sendEmailBtn.disabled = true;

    // Hide invoice mock card preview
    invoicePreviewCard.style.display = 'none';
  });

  function clearAllFields() {
    currentlySelectedRequisition = null;

    kpiSubtotal.textContent = "$0.00";
    kpiGst.textContent = "$0.00";
    kpiGrandTotal.textContent = "$0.00";
    
    kpiPaymentStatus.className = 'status-badge draft';
    kpiPaymentStatus.textContent = 'Draft';

    // Reset text labels
    const resetFields = [
      lblPoNumber, lblPoVendor, lblPoRfq, lblPoProduct, lblPoQty, lblPoUnitPrice, lblPoSubtotal,
      lblInvNumber, lblInvVendor, lblInvPoNumber, lblInvSubtotal, lblInvGst, lblInvTotal
    ];
    resetFields.forEach(f => f.textContent = '-');

    poStatusBadge.className = 'status-badge draft';
    poStatusBadge.textContent = 'Draft';
    
    invStatusBadge.className = 'status-badge draft';
    invStatusBadge.textContent = 'Draft';

    // Disable all action buttons
    generatePoBtn.disabled = true;
    downloadPoBtn.disabled = true;
    generateInvBtn.disabled = true;
    printInvBtn.disabled = true;
    sendEmailBtn.disabled = true;

    // Hide invoice preview card
    invoicePreviewCard.style.display = 'none';
  }

  // --- Purchase Order Actions ---
  generatePoBtn.addEventListener('click', () => {
    if (!currentlySelectedRequisition) return;

    generatePoBtn.classList.add('loading');
    generatePoBtn.disabled = true;

    setTimeout(() => {
      generatePoBtn.classList.remove('loading');
      
      poStatusBadge.className = 'status-badge generated';
      poStatusBadge.textContent = 'Generated';

      kpiPaymentStatus.className = 'status-badge generated';
      kpiPaymentStatus.textContent = 'PO Generated';

      // Enable download and generate invoice
      downloadPoBtn.disabled = false;
      generateInvBtn.disabled = false;

      showToast(`Purchase Order ${currentlySelectedRequisition.poNumber} generated successfully.`, 'success');
    }, 1200);
  });

  // Mock PO PDF download
  downloadPoBtn.addEventListener('click', () => {
    if (!currentlySelectedRequisition) return;
    showToast(`Downloading Purchase Order ${currentlySelectedRequisition.poNumber} as PDF...`, 'success');
  });

  // --- Invoice Actions ---
  generateInvBtn.addEventListener('click', () => {
    if (!currentlySelectedRequisition) return;

    generateInvBtn.disabled = true;

    invStatusBadge.className = 'status-badge pending';
    invStatusBadge.textContent = 'Pending';

    kpiPaymentStatus.className = 'status-badge pending';
    kpiPaymentStatus.textContent = 'Inv Pending';

    // Populate mock receipt elements
    receiptInvoiceNum.textContent = currentlySelectedRequisition.invNumber;
    receiptVendorName.textContent = currentlySelectedRequisition.vendorName;
    receiptVendorType.textContent = currentlySelectedRequisition.companyType;
    receiptVendorRep.textContent = currentlySelectedRequisition.repName;
    receiptItemName.textContent = currentlySelectedRequisition.productName;
    receiptPoRef.textContent = `Linked Purchase Order: ${currentlySelectedRequisition.poNumber}`;
    receiptQty.textContent = currentlySelectedRequisition.qty;
    receiptUnitPrice.textContent = currentlySelectedRequisition.unitPrice;
    receiptBaseAmount.textContent = currentlySelectedRequisition.baseAmount;
    receiptSubtotal.textContent = currentlySelectedRequisition.baseAmount;
    receiptGst.textContent = currentlySelectedRequisition.gstAmount;
    receiptGrandTotal.textContent = currentlySelectedRequisition.grandTotal;

    // Show preview card
    invoicePreviewCard.style.display = 'block';
    
    // Enable print, send email and mark paid
    printInvBtn.disabled = false;
    sendEmailBtn.disabled = false;
    markPaidBtn.disabled = false;
    markPaidBtn.style.opacity = 1;

    // Scroll preview card into view
    invoicePreviewCard.scrollIntoView({ behavior: 'smooth' });

    showToast(`Invoice ${currentlySelectedRequisition.invNumber} generated. Review preview below.`, 'success');
  });

  // Mock Send Email action
  sendEmailBtn.addEventListener('click', () => {
    if (!currentlySelectedRequisition) return;

    sendEmailBtn.classList.add('loading');
    sendEmailBtn.disabled = true;

    setTimeout(() => {
      sendEmailBtn.classList.remove('loading');
      sendEmailBtn.disabled = false;

      invStatusBadge.className = 'status-badge sent';
      invStatusBadge.textContent = 'Sent';

      kpiPaymentStatus.className = 'status-badge sent';
      kpiPaymentStatus.textContent = 'Inv Sent';

      showToast(`Invoice ${currentlySelectedRequisition.invNumber} dispatched to ${currentlySelectedRequisition.vendorName} accounting.`, 'success');
    }, 1500);
  });

  // Mock Print Invoice
  printInvBtn.addEventListener('click', () => {
    if (!currentlySelectedRequisition) return;
    window.print();
  });

  // Mark as Paid
  markPaidBtn.addEventListener('click', () => {
    if (!currentlySelectedRequisition) return;

    invStatusBadge.className = 'status-badge paid';
    invStatusBadge.textContent = 'Paid';

    kpiPaymentStatus.className = 'status-badge paid';
    kpiPaymentStatus.textContent = 'Paid';

    // Disable all actions
    sendEmailBtn.disabled = true;
    printInvBtn.disabled = true;
    markPaidBtn.disabled = true;
    markPaidBtn.style.opacity = 0.5;

    showToast(`Billing invoice ${currentlySelectedRequisition.invNumber} marked as PAID. Requisition closed.`, 'success');
  });

  // --- Toast notifications manager ---
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
