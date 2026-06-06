document.addEventListener('DOMContentLoaded', () => {
  // --- Header Navigation & Profile Settings ---
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
        showToast('alert', 'System Alert: 2 Procurement Drafts are nearing completion.', 'success');
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
    
    // Close multi-select list if clicking outside the container
    if (vendorDropdownList && vendorDropdownList.style.display === 'flex') {
      const multiselectContainer = document.querySelector('.multiselect-container');
      if (!multiselectContainer.contains(e.target)) {
        vendorDropdownList.style.display = 'none';
      }
    }
  });

  // --- Multi-Select Vendor Dropdown Checklist ---
  const vendorSelectBtn = document.getElementById('vendorSelectBtn');
  const vendorDropdownList = document.getElementById('vendorDropdownList');
  const vendorCheckboxes = vendorDropdownList.querySelectorAll('input[type="checkbox"]');
  const summaryVendors = document.getElementById('summaryVendors');

  vendorSelectBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isVisible = vendorDropdownList.style.display === 'flex';
    vendorDropdownList.style.display = isVisible ? 'none' : 'flex';
  });

  vendorCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', updateSelectedVendors);
  });

  function updateSelectedVendors() {
    const checked = Array.from(vendorCheckboxes).filter(c => c.checked);
    
    // Update trigger button label text
    const triggerSpan = vendorSelectBtn.querySelector('span');
    if (checked.length === 0) {
      triggerSpan.textContent = "Choose verified suppliers (0 selected)";
      summaryVendors.innerHTML = `<span style="color: var(--text-light); font-size: 0.85rem; font-style: italic;">None selected</span>`;
    } else {
      triggerSpan.textContent = `Choose verified suppliers (${checked.length} selected)`;
      
      // Update Summary Card badges
      summaryVendors.innerHTML = '';
      checked.forEach(c => {
        const val = c.value;
        const span = document.createElement('span');
        span.className = 'vendor-badge-pill';
        span.textContent = val;
        summaryVendors.appendChild(span);
      });
    }
    vendorSelectBtn.classList.remove('error');
  }

  // --- Real-time Estimated Cost & Summary Card Updates ---
  const rfqQty = document.getElementById('rfqQty');
  const rfqPrice = document.getElementById('rfqPrice');
  const submissionDeadline = document.getElementById('submissionDeadline');
  const rfqPriority = document.getElementById('rfqPriority');

  const summaryQty = document.getElementById('summaryQty');
  const summaryDeadline = document.getElementById('summaryDeadline');
  const summaryPriority = document.getElementById('summaryPriority');
  const summaryCost = document.getElementById('summaryCost');

  function calculateEstimatedCost() {
    const qty = parseFloat(rfqQty.value);
    const price = parseFloat(rfqPrice.value);

    // Update quantity summary text
    if (qty && qty > 0) {
      summaryQty.textContent = qty.toLocaleString();
    } else {
      summaryQty.textContent = '-';
    }

    // Calculate spend cost
    if (qty && qty > 0) {
      if (price && price > 0) {
        const cost = qty * price;
        summaryCost.textContent = `$${cost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      } else {
        summaryCost.textContent = 'TBD (Quotation based)';
      }
    } else {
      summaryCost.textContent = '$0.00';
    }
  }

  rfqQty.addEventListener('input', calculateEstimatedCost);
  rfqPrice.addEventListener('input', calculateEstimatedCost);

  submissionDeadline.addEventListener('change', () => {
    if (submissionDeadline.value) {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      const dateVal = new Date(submissionDeadline.value);
      summaryDeadline.textContent = dateVal.toLocaleDateString('en-US', options);
    } else {
      summaryDeadline.textContent = '-';
    }
    submissionDeadline.classList.remove('error');
  });

  rfqPriority.addEventListener('change', () => {
    const val = rfqPriority.value;
    summaryPriority.textContent = val;
    
    // Clear and set priority status class
    summaryPriority.className = 'priority-badge';
    if (val === 'low') summaryPriority.classList.add('badge-low');
    if (val === 'medium') summaryPriority.classList.add('badge-medium');
    if (val === 'high') summaryPriority.classList.add('badge-high');
    if (val === 'urgent') summaryPriority.classList.add('badge-urgent');
  });

  // --- Drag and Drop File Upload Functionality ---
  const dropzone = document.getElementById('dropzone');
  const fileInput = document.getElementById('fileInput');
  const uploadedFilesList = document.getElementById('uploadedFilesList');
  
  let uploadedFiles = []; // holds file pointers

  // Trigger file select dialog on dropzone click
  dropzone.addEventListener('click', () => fileInput.click());

  fileInput.addEventListener('change', () => {
    handleFiles(fileInput.files);
    fileInput.value = ''; // Reset file input
  });

  // Drag over states
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
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Limit check size: 10MB
      if (file.size > 10 * 1024 * 1024) {
        showToast('size-err', `File '${file.name}' exceeds the 10MB file limit.`, 'danger');
        continue;
      }

      // Add to array and render
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
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
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

  // File Deletion via delegation
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

  // --- Form Validation & Submission Trigger ---
  const rfqTitle = document.getElementById('rfqTitle');
  const productName = document.getElementById('productName');
  const deliveryDate = document.getElementById('deliveryDate');
  const createRfqBtn = document.getElementById('createRfqBtn');
  const saveDraftBtn = document.getElementById('saveDraftBtn');
  const resetFormBtn = document.getElementById('resetFormBtn');

  // Input fields validation indicators removal
  const formFields = [rfqTitle, productName, rfqQty, deliveryDate, submissionDeadline];
  formFields.forEach(field => {
    field.addEventListener('input', () => field.classList.remove('error'));
  });

  function validateForm() {
    let errors = [];

    // Title
    if (!rfqTitle.value.trim()) { errors.push(rfqTitle); }
    // Product Name
    if (!productName.value.trim()) { errors.push(productName); }
    // Qty
    const qty = parseFloat(rfqQty.value);
    if (!qty || qty <= 0) { errors.push(rfqQty); }
    // Delivery Date
    if (!deliveryDate.value) { errors.push(deliveryDate); }
    // Deadline
    if (!submissionDeadline.value) { errors.push(submissionDeadline); }

    // Multi-select Vendor validation
    const selectedVendorsCount = Array.from(vendorCheckboxes).filter(c => c.checked).length;
    if (selectedVendorsCount === 0) {
      errors.push(vendorSelectBtn);
    }

    if (errors.length > 0) {
      errors.forEach(f => f.classList.add('error'));
      showToast('validation', 'Please correct all marked validation fields before issuing RFQ.', 'danger');
      if (errors[0] === vendorSelectBtn) {
        vendorSelectBtn.focus();
      } else {
        errors[0].focus();
      }
      return false;
    }

    // Verify Deadline cannot be past date
    const today = new Date();
    today.setHours(0,0,0,0);
    const deadlineVal = new Date(submissionDeadline.value);
    if (deadlineVal < today) {
      submissionDeadline.classList.add('error');
      showToast('date-err', 'Quotation deadline cannot be set to a past date.', 'danger');
      submissionDeadline.focus();
      return false;
    }

    // Verify Delivery date is after Submission Deadline
    const deliveryVal = new Date(deliveryDate.value);
    if (deliveryVal < deadlineVal) {
      deliveryDate.classList.add('error');
      showToast('delivery-err', 'Required delivery date must be set after the quotation submission deadline.', 'danger');
      deliveryDate.focus();
      return false;
    }

    return true;
  }

  // Action: Create RFQ
  createRfqBtn.addEventListener('click', () => {
    if (!validateForm()) return;

    // Trigger loading state animations
    createRfqBtn.classList.add('loading');
    saveDraftBtn.disabled = true;
    resetFormBtn.disabled = true;
    formFields.forEach(f => f.disabled = true);
    vendorSelectBtn.disabled = true;

    setTimeout(() => {
      // Mock Success Dispatch
      const vendorsChecked = Array.from(vendorCheckboxes).filter(c => c.checked);
      showToast('dispatch', `RFQ for ${productName.value} created and dispatched to ${vendorsChecked.length} vendors.`, 'success');
      
      resetForm();
      
      // Release Loader
      createRfqBtn.classList.remove('loading');
      saveDraftBtn.disabled = false;
      resetFormBtn.disabled = false;
      formFields.forEach(f => f.disabled = false);
      vendorSelectBtn.disabled = false;
    }, 1500);
  });

  // Action: Save Draft
  saveDraftBtn.addEventListener('click', () => {
    if (!rfqTitle.value.trim()) {
      rfqTitle.classList.add('error');
      showToast('draft-err', 'An RFQ Title is required to save a procurement draft.', 'danger');
      rfqTitle.focus();
      return;
    }

    showToast('draft-ok', `Draft RFQ '${rfqTitle.value}' saved successfully.`, 'success');
  });

  // Action: Reset Form
  resetFormBtn.addEventListener('click', () => {
    resetForm();
    showToast('reset', 'RFQ form cleared successfully.', 'success');
  });

  function resetForm() {
    // Reset HTML Form
    rfqTitle.value = '';
    productName.value = '';
    rfqQty.value = '';
    rfqPrice.value = '';
    deliveryDate.value = '';
    submissionDeadline.value = '';
    document.getElementById('productDesc').value = '';
    document.getElementById('additionalNotes').value = '';
    document.getElementById('procurementRequirements').value = '';

    // Clear checkboxes and lists
    vendorCheckboxes.forEach(c => c.checked = false);
    updateSelectedVendors();

    // Reset attachments
    uploadedFiles = [];
    renderFilesList();

    // Reset Summary Card fields
    summaryQty.textContent = '-';
    summaryDeadline.textContent = '-';
    summaryPriority.textContent = 'Medium';
    summaryPriority.className = 'priority-badge badge-medium';
    summaryCost.textContent = '$0.00';
    
    // Clear validation borders
    formFields.forEach(f => f.classList.remove('error'));
    vendorSelectBtn.classList.remove('error');
  }
});
