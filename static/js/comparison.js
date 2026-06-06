document.addEventListener('DOMContentLoaded', () => {
  // --- Vendor Details Dataset ---
  const vendorsData = {
    "Acme Corp": {
      name: "Acme Industrial Corp",
      companyType: "Raw Materials Supplier",
      score: 94,
      priceAdv: "Save 12.5% vs avg",
      deliveryAdv: "12 days lead-time",
      reason: "Acme Corp offers the lowest base bid with a robust 24-month replacement warranty and a highly consistent 4.8 supplier rating. Highly recommended for this procurement cycle.",
      priceScore: 98,
      deliveryScore: 85,
      warrantyScore: 90,
      ratingScore: 96,
      repName: "John Carter",
      brand: "Acme High-Tensile Series",
      paymentTerms: "Net 30",
      tax: "18% GST ($1,125.76)",
      notes: "Offers fully tested high-tensile steel bolts meeting ISO 898-1 specifications. Delivery carried out by Acme Logistics. Price includes freight charges up to delivery dock. Minimum replacement warranty of 24 months.",
      attachment: "acme_steel_bolts_quotation_v2.pdf",
      totalCost: "$7,380.00"
    },
    "Globex Ltd": {
      name: "Globex Logistics Ltd",
      companyType: "Supply Chain & Freight",
      score: 82,
      priceAdv: "0.5% below avg",
      deliveryAdv: "14 days lead-time",
      reason: "Globex Logistics Ltd offers moderate pricing and a standard 12-month warranty. Sourcing is reliable but lead times are standard. Average supplier rating.",
      priceScore: 80,
      deliveryScore: 78,
      warrantyScore: 75,
      ratingScore: 84,
      repName: "Sarah Jenkins",
      brand: "Globex Industrial Standard",
      paymentTerms: "Net 45",
      tax: "18% GST ($1,278.00)",
      notes: "Offers steel parts compliant with ASTM standards. Price includes standard shipping. Expedited shipping is available at extra costs.",
      attachment: "globex_freight_quote_bolts.pdf",
      totalCost: "$8,378.00"
    },
    "Stark Ind": {
      name: "Stark Manufacturing",
      companyType: "Heavy Hardware & Forging",
      score: 91,
      priceAdv: "5.2% below avg",
      deliveryAdv: "10 days lead-time",
      reason: "Stark Manufacturing offers the fastest delivery time of 10 days, paired with excellent manufacturing quality. Ideal for high priority or time-critical shipments.",
      priceScore: 88,
      deliveryScore: 98,
      warrantyScore: 80,
      ratingScore: 92,
      repName: "Tony Stark",
      brand: "Stark Premium Alloys",
      paymentTerms: "Net 15",
      tax: "18% GST ($1,350.00)",
      notes: "Premium high-grade alloy bolts manufactured in our automated forging units. Fast delivery guaranteed by direct air shipping. Strict ISO compliance.",
      attachment: "stark_m12_bolts_pricing_v1.pdf",
      totalCost: "$8,850.00"
    },
    "Initech LLC": {
      name: "Initech Software",
      companyType: "Digital Procurement & Tools",
      score: 72,
      priceAdv: "9.2% above avg",
      deliveryAdv: "18 days lead-time",
      reason: "Initech Software provides long-term 36-month warranties, but is limited by slower delivery schedules and higher base prices.",
      priceScore: 65,
      deliveryScore: 60,
      warrantyScore: 95,
      ratingScore: 76,
      repName: "Peter Gibbons",
      brand: "Initech Custom Specs",
      paymentTerms: "Net 60",
      tax: "12% GST ($984.00)",
      notes: "Custom specifications steel items sourced from partner networks. Extra warranty period included in base pricing.",
      attachment: "initech_hardware_catalog_quotes.pdf",
      totalCost: "$9,184.00"
    },
    "Wayne Ent": {
      name: "Wayne Industrial",
      companyType: "Defense Hardware Contractor",
      score: 93,
      priceAdv: "11.9% above avg",
      deliveryAdv: "12 days lead-time",
      reason: "Wayne Industrial has the highest supplier rating of 4.9 stars and an exceptional 48-month warranty. However, pricing is the highest among all bidders.",
      priceScore: 70,
      deliveryScore: 90,
      warrantyScore: 100,
      ratingScore: 100,
      repName: "Bruce Wayne",
      brand: "Wayne Defense Alloy M12",
      paymentTerms: "Net 30",
      tax: "18% GST ($1,438.20)",
      notes: "Military-grade high-tensile steel components with ultra-high durability coating. Extended 4-year warranty covers all material defects.",
      attachment: "wayne_defense_specifications_quote.pdf",
      totalCost: "$9,428.20"
    }
  };

  let currentlySelectedKey = "Acme Corp";

  // --- DOM Elements ---
  const tableRows = document.querySelectorAll('#comparisonTable tbody tr');
  const panelVendorName = document.getElementById('panelVendorName');
  const panelCompanyType = document.getElementById('panelCompanyType');
  const panelScoreVal = document.getElementById('panelScoreVal');
  const panelPriceAdv = document.getElementById('panelPriceAdv');
  const panelDeliveryAdv = document.getElementById('panelDeliveryAdv');
  const panelReasonText = document.getElementById('panelReasonText');

  const meterPriceVal = document.getElementById('meterPriceVal');
  const meterPriceFill = document.getElementById('meterPriceFill');
  const meterDeliveryVal = document.getElementById('meterDeliveryVal');
  const meterDeliveryFill = document.getElementById('meterDeliveryFill');
  const meterWarrantyVal = document.getElementById('meterWarrantyVal');
  const meterWarrantyFill = document.getElementById('meterWarrantyFill');
  const meterRatingVal = document.getElementById('meterRatingVal');
  const meterRatingFill = document.getElementById('meterRatingFill');

  const kpiRecommended = document.getElementById('kpiRecommended');
  const kpiTotalBids = document.getElementById('kpiTotalBids');
  const kpiLowestPrice = document.getElementById('kpiLowestPrice');
  const kpiLowestVendor = document.getElementById('kpiLowestVendor');
  const kpiFastestDelivery = document.getElementById('kpiFastestDelivery');
  const kpiFastestVendor = document.getElementById('kpiFastestVendor');

  // --- Header Navigation Interactions ---
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

  // Handle Notifications Bell Alerts
  let unreadNotificationsCount = 3;
  if (notificationBadge) {
    notificationBadge.textContent = unreadNotificationsCount;
    notificationBadge.style.display = 'block';
  }

  if (notificationBtn) {
    notificationBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (unreadNotificationsCount > 0) {
        showToast('ERP Dispatch: Received 5 total vendor bids for RFQ-2026-089. Compare bids now.', 'success');
        if (notificationBadge) notificationBadge.style.display = 'none';
        unreadNotificationsCount = 0;
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

  // --- Panel Transitions Function ---
  function updateAnalysisPanel(key) {
    const data = vendorsData[key];
    if (!data) return;

    currentlySelectedKey = key;

    // Remove active highlights and set new highlighted row
    tableRows.forEach(r => {
      if (r.getAttribute('data-vendor') === key) {
        r.classList.add('row-selected');
      } else {
        r.classList.remove('row-selected');
      }
    });

    // Update Text Elements
    panelVendorName.textContent = data.name;
    panelCompanyType.textContent = data.companyType;
    panelScoreVal.textContent = data.score;
    panelPriceAdv.textContent = data.priceAdv;
    panelDeliveryAdv.textContent = data.deliveryAdv;
    panelReasonText.textContent = data.reason;

    // Update Score Bar Meters (animated widths)
    meterPriceVal.textContent = `${data.priceScore}%`;
    meterPriceFill.style.width = `${data.priceScore}%`;

    meterDeliveryVal.textContent = `${data.deliveryScore}%`;
    meterDeliveryFill.style.width = `${data.deliveryScore}%`;

    meterWarrantyVal.textContent = `${data.warrantyScore}%`;
    meterWarrantyFill.style.width = `${data.warrantyScore}%`;

    meterRatingVal.textContent = `${data.ratingScore}%`;
    meterRatingFill.style.width = `${data.ratingScore}%`;
  }

  // --- Setup Table Row Listeners ---
  tableRows.forEach(row => {
    row.addEventListener('click', (e) => {
      // Prevent selection action if user clicked the "Select" button
      if (e.target.classList.contains('btn-select-row')) return;
      
      const vendorKey = row.getAttribute('data-vendor');
      updateAnalysisPanel(vendorKey);
    });
  });

  // Highlight default vendor on startup
  updateAnalysisPanel("Acme Corp");

  // --- Setup Row Selection Buttons ---
  const selectRowBtns = document.querySelectorAll('.btn-select-row');
  selectRowBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const vendorKey = btn.getAttribute('data-vendor');
      const vendorName = vendorsData[vendorKey].name;
      const totalCost = vendorsData[vendorKey].totalCost;

      // Reset all row selected styles and text
      selectRowBtns.forEach(b => {
        b.textContent = 'Select';
        b.classList.remove('selected');
      });

      // Highlight the selected row button
      btn.textContent = 'Selected';
      btn.classList.add('selected');

      // Update the KPI Cards
      kpiRecommended.textContent = vendorKey;
      const kpiRecBadge = kpiRecommended.nextElementSibling.querySelector('.trend-badge');
      if (kpiRecBadge) {
        kpiRecBadge.textContent = `${vendorsData[vendorKey].score} Score`;
      }

      showToast(`Selected ${vendorName} for PO. Purchase Order draft generated for ${totalCost}!`, 'success');
      
      // Update table status badges
      tableRows.forEach(r => {
        const key = r.getAttribute('data-vendor');
        const badge = r.querySelector('.table-badge');
        if (key === vendorKey) {
          if (badge) {
            badge.className = 'table-badge green';
            badge.textContent = 'Selected';
          }
        } else {
          // Reset other statuses
          if (badge && badge.textContent === 'Selected') {
            badge.className = 'table-badge yellow';
            badge.textContent = 'Pending Review';
          }
        }
      });
    });
  });

  // --- Export CSV Actions ---
  const exportBtn = document.getElementById('exportComparisonBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      let csvContent = "data:text/csv;charset=utf-8,";
      csvContent += "Vendor Name,Company,Base Amount,GST (Tax),Total Amount,Delivery Time,Warranty,Rating,Status\r\n";

      Object.keys(vendorsData).forEach(key => {
        const v = vendorsData[key];
        const rowString = `"${v.name}","${v.companyType}","${v.totalCost}","${v.tax}","${v.totalCost}","${v.deliveryAdv}","${v.warrantyScore} Months","${v.score}/100","Pending"`;
        csvContent += rowString + "\r\n";
      });

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "quotation_comparison_rfq_089.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast("Comparison CSV downloaded successfully.", "success");
    });
  }

  // --- Generate Approval Request Actions ---
  const generateApprovalBtn = document.getElementById('generateApprovalBtn');
  if (generateApprovalBtn) {
    generateApprovalBtn.addEventListener('click', () => {
      const activeVendor = vendorsData[currentlySelectedKey];
      
      generateApprovalBtn.classList.add('loading');
      generateApprovalBtn.disabled = true;

      setTimeout(() => {
        generateApprovalBtn.classList.remove('loading');
        generateApprovalBtn.disabled = false;
        showToast(`Approval request dispatched for ${activeVendor.name} (${activeVendor.totalCost}) successfully.`, 'success');
      }, 1500);
    });
  }

  // --- Modal Interactions ---
  const detailModal = document.getElementById('detailModal');
  const viewFullQuotationBtn = document.getElementById('viewFullQuotationBtn');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalCloseFooterBtn = document.getElementById('modalCloseFooterBtn');
  const modalSelectVendorBtn = document.getElementById('modalSelectVendorBtn');

  // Modal Text Fields
  const modalVendorHeader = document.getElementById('modalVendorHeader');
  const modalRepName = document.getElementById('modalRepName');
  const modalBrand = document.getElementById('modalBrand');
  const modalPaymentTerms = document.getElementById('modalPaymentTerms');
  const modalTax = document.getElementById('modalTax');
  const modalNotes = document.getElementById('modalNotes');
  const modalAttachmentName = document.getElementById('modalAttachmentName');

  function openDetailsModal(key) {
    const data = vendorsData[key];
    if (!data) return;

    modalVendorHeader.textContent = `${data.name} Quotation details`;
    modalRepName.textContent = data.repName;
    modalBrand.textContent = data.brand;
    modalPaymentTerms.textContent = data.paymentTerms;
    modalTax.textContent = data.tax;
    modalNotes.textContent = data.notes;
    modalAttachmentName.textContent = data.attachment;

    detailModal.style.display = 'flex';
  }

  if (viewFullQuotationBtn) {
    viewFullQuotationBtn.addEventListener('click', () => {
      openDetailsModal(currentlySelectedKey);
    });
  }

  function closeModal() {
    detailModal.style.display = 'none';
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modalCloseFooterBtn) modalCloseFooterBtn.addEventListener('click', closeModal);

  if (detailModal) {
    detailModal.addEventListener('click', (e) => {
      if (e.target === detailModal) {
        closeModal();
      }
    });
  }

  if (modalSelectVendorBtn) {
    modalSelectVendorBtn.addEventListener('click', () => {
      // Find the row select button and click it to trigger selection logic
      const selectBtns = Array.from(selectRowBtns);
      const targetBtn = selectBtns.find(btn => btn.getAttribute('data-vendor') === currentlySelectedKey);
      if (targetBtn) {
        targetBtn.click();
      }
      closeModal();
    });
  }

  // --- Toast Notifications System ---
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
