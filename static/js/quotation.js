document.addEventListener('DOMContentLoaded', () => {
  // --- Header Navigation & Settings ---
  const profileTrigger = document.getElementById('profileTrigger');
  const profileDropdown = document.getElementById('profileDropdown');
  const menuToggle = document.getElementById('menuToggle');
  const sidebar = document.getElementById('sidebar');
  const notificationBtn = document.getElementById('notificationBtn');
  const notificationBadge = document.getElementById('notificationBadge');

  if (profileTrigger && profileDropdown) {
    profileTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isVisible = profileDropdown.style.display === 'flex';
      profileDropdown.style.display = isVisible ? 'none' : 'flex';
    });
  }

  if (menuToggle && sidebar) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      sidebar.classList.toggle('open');
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
        showToast('alert', 'ERP Dispatch: Vendor quotation deadline for RFQ-089 is approaching.', 'success');
        if (notificationBadge) notificationBadge.style.display = 'none';
        hasNotifications = false;
      } else {
        showToast('alert', 'No new alerts.', 'success');
      }
    });
  }

  // Close menus when clicking outside
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

  // --- Real-time Cost Calculation & Syncing ---
  const quoteAmount = document.getElementById('quoteAmount');
  const quoteGst = document.getElementById('quoteGst');
  const deliveryTimeline = document.getElementById('deliveryTimeline');
  const warrantyPeriod = document.getElementById('warrantyPeriod');

  const summaryBaseAmount = document.getElementById('summaryBaseAmount');
  const summaryGstAmount = document.getElementById('summaryGstAmount');
  const summaryTotalAmount = document.getElementById('summaryTotalAmount');
  const summaryDelivery = document.getElementById('summaryDelivery');
  const summaryWarranty = document.getElementById('summaryWarranty');

  function updateSummaryNumbers() {
    const baseVal = parseFloat(quoteAmount.value);
    const gstPct = parseFloat(quoteGst.value);

    // Validate inputs
    if (baseVal && baseVal > 0) {
      const gstFactor = (gstPct && gstPct >= 0) ? (gstPct / 100) : 0;
      const gstVal = baseVal * gstFactor;
      const totalVal = baseVal + gstVal;

      summaryBaseAmount.textContent = `$${baseVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      summaryGstAmount.textContent = `$${gstVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      summaryTotalAmount.textContent = `$${totalVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else {
      summaryBaseAmount.textContent = '$0.00';
      summaryGstAmount.textContent = '$0.00';
      summaryTotalAmount.textContent = '$0.00';
    }
  }

  quoteAmount.addEventListener('input', updateSummaryNumbers);
  quoteGst.addEventListener('input', updateSummaryNumbers);

  deliveryTimeline.addEventListener('input', () => {
    const timeline = deliveryTimeline.value.trim();
    if (timeline && parseFloat(timeline) > 0) {
      summaryDelivery.textContent = `${timeline} Days`;
    } else {
      summaryDelivery.textContent = '-';
    }
    deliveryTimeline.classList.remove('error');
  });

  warrantyPeriod.addEventListener('input', () => {
    const warranty = warrantyPeriod.value.trim();
    if (warranty) {
      summaryWarranty.textContent = warranty;
    } else {
      summaryWarranty.textContent = '-';
    }
  });

  // --- Drag and Drop File Upload Area ---
  const dropzone = document.getElementById('dropzone');
  const fileInput = document.getElementById('fileInput');
  const uploadedFilesList = document.getElementById('uploadedFilesList');
  
  let uploadedFiles = []; // Holds list of added files

  dropzone.addEventListener('click', () => fileInput.click());

  fileInput.addEventListener('change', () => {
    handleFiles(fileInput.files);
    fileInput.value = ''; // Clear selection buffer
  });

  dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('dragover');
  });

  dropzone.addEventListener('dragleave', () => {
    dropzone.classList.remove('dragover');
  });

  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('dragover');
    handleFiles(e.dataTransfer.files);
  });

  function handleFiles(files) {
    dropzone.classList.remove('error');
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Limit: 15MB
      if (file.size > 15 * 1024 * 1024) {
        showToast('size-err', `File '${file.name}' exceeds the 15MB limit.`, 'danger');
        continue;
      }

      uploadedFiles.push(file);
      renderFilesList();
    }
  }

  function renderFilesList() {
    uploadedFilesList.innerHTML = '';
    uploadedFiles.forEach((file, index) => {
      const sizeStr = formatBytes(file.size);
      const fileItem = document.createElement('div');
      fileItem.className = 'file-item';
      fileItem.innerHTML = `
        <div class="file-info">
          <div class="file-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
          </div>
          <div>
            <span class="file-name" title="${file.name}">${file.name}</span>
            <span class="file-size">(${sizeStr})</span>
          </div>
        </div>
        <button type="button" class="file-delete-btn" data-index="${index}" aria-label="Remove file">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      `;
      uploadedFilesList.appendChild(fileItem);
    });
  }

  uploadedFilesList.addEventListener('click', (e) => {
    const deleteBtn = e.target.closest('.file-delete-btn');
    if (deleteBtn) {
      const idx = parseInt(deleteBtn.getAttribute('data-index'));
      uploadedFiles.splice(idx, 1);
      renderFilesList();
    }
  });

  function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  // --- Toast Notifications System ---
  const toastContainer = document.getElementById('toastContainer');
  function showToast(id, message, type = 'success') {
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

  // --- Form Validation & Submission ---
  const vendorName = document.getElementById('vendorName');
  const vendorCompany = document.getElementById('vendorCompany');
  const submitQuotationBtn = document.getElementById('submitQuotationBtn');
  const saveDraftBtn = document.getElementById('saveDraftBtn');
  const resetFormBtn = document.getElementById('resetFormBtn');

  const formFields = [vendorName, vendorCompany, quoteAmount, deliveryTimeline];
  formFields.forEach(field => {
    field.addEventListener('input', () => field.classList.remove('error'));
  });

  function validateForm() {
    let errors = [];

    if (!vendorName.value.trim()) errors.push(vendorName);
    if (!vendorCompany.value.trim()) errors.push(vendorCompany);
    
    const amountVal = parseFloat(quoteAmount.value);
    if (!amountVal || amountVal <= 0) errors.push(quoteAmount);
    
    const timelineVal = parseFloat(deliveryTimeline.value);
    if (!timelineVal || timelineVal <= 0) errors.push(deliveryTimeline);

    // Verify at least one file attachment is uploaded (Required File Validation)
    if (uploadedFiles.length === 0) {
      errors.push(dropzone);
    }

    if (errors.length > 0) {
      errors.forEach(f => f.classList.add('error'));
      showToast('validation', 'Please correct all highlighted fields and upload a proposal PDF.', 'danger');
      if (errors[0] === dropzone) {
        // focus not possible, scroll into view
        dropzone.scrollIntoView({ behavior: 'smooth' });
      } else {
        errors[0].focus();
      }
      return false;
    }

    return true;
  }

  // Action: Submit Quotation
  submitQuotationBtn.addEventListener('click', () => {
    if (!validateForm()) return;

    // Loading State
    submitQuotationBtn.classList.add('loading');
    saveDraftBtn.disabled = true;
    resetFormBtn.disabled = true;
    formFields.forEach(f => f.disabled = true);
    dropzone.style.pointerEvents = 'none';

    setTimeout(() => {
      // Mock Submission Complete
      const totalText = summaryTotalAmount.textContent;
      showToast('submit-ok', `Quotation proposal of ${totalText} submitted successfully for RFQ-2026-089!`, 'success');
      
      resetForm();

      // Release Loading State
      submitQuotationBtn.classList.remove('loading');
      saveDraftBtn.disabled = false;
      resetFormBtn.disabled = false;
      formFields.forEach(f => f.disabled = false);
      dropzone.style.pointerEvents = 'auto';
    }, 1500);
  });

  // Action: Save Draft
  saveDraftBtn.addEventListener('click', () => {
    if (!vendorCompany.value.trim()) {
      vendorCompany.classList.add('error');
      showToast('draft-err', 'Enter your Company Name to save this quote draft.', 'danger');
      vendorCompany.focus();
      return;
    }

    showToast('draft-ok', `Draft quotation proposal for '${vendorCompany.value}' saved successfully.`, 'success');
  });

  // Action: Reset Form
  resetFormBtn.addEventListener('click', () => {
    resetForm();
    showToast('reset', 'Proposal fields cleared.', 'success');
  });

  function resetForm() {
    // Reset inputs
    vendorName.value = '';
    vendorCompany.value = '';
    quoteAmount.value = '';
    quoteGst.value = '18';
    deliveryTimeline.value = '';
    warrantyPeriod.value = '';
    document.getElementById('paymentTerms').value = '';
    document.getElementById('productBrand').value = '';
    document.getElementById('additionalNotes').value = '';

    // Reset attachments
    uploadedFiles = [];
    renderFilesList();

    // Reset Summary Card
    summaryBaseAmount.textContent = '$0.00';
    summaryGstAmount.textContent = '$0.00';
    summaryTotalAmount.textContent = '$0.00';
    summaryDelivery.textContent = '-';
    summaryWarranty.textContent = '-';

    // Clear error highlights
    formFields.forEach(f => f.classList.remove('error'));
    dropzone.classList.remove('error');
  }
});
