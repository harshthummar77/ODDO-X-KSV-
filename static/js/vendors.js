document.addEventListener('DOMContentLoaded', () => {
  // --- Nav & Profile Dropdown Controls ---
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
        showToast('compliance', '3 pending compliance reviews loaded successfully.', 'success');
        if (notificationBadge) notificationBadge.style.display = 'none';
        hasNotifications = false;
      } else {
        showToast('compliance', 'No new notifications.', 'success');
      }
    });
  }

  // Global click listener to close dropdowns
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

  // --- Add Vendor Modal Dialog Trigger ---
  const addVendorBtn = document.getElementById('addVendorBtn');
  const addVendorModal = document.getElementById('addVendorModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const cancelModalBtn = document.getElementById('cancelModalBtn');
  const addVendorForm = document.getElementById('addVendorForm');

  // Input Fields
  const vendorName = document.getElementById('vendorName');
  const vendorCompany = document.getElementById('vendorCompany');
  const vendorEmail = document.getElementById('vendorEmail');
  const vendorPhone = document.getElementById('vendorPhone');
  const vendorGst = document.getElementById('vendorGst');
  const vendorCategory = document.getElementById('vendorCategory');
  const vendorAddress = document.getElementById('vendorAddress');
  const vendorStatus = document.getElementById('vendorStatus');

  const modalInputs = [vendorName, vendorCompany, vendorEmail, vendorPhone, vendorGst, vendorCategory, vendorAddress, vendorStatus];

  function openModal() {
    addVendorModal.style.display = 'flex';
    vendorName.focus();
  }

  function closeModal() {
    addVendorModal.style.display = 'none';
    addVendorForm.reset();
    modalInputs.forEach(i => i.classList.remove('error'));
  }

  if (addVendorBtn) addVendorBtn.addEventListener('click', openModal);
  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
  if (cancelModalBtn) cancelModalBtn.addEventListener('click', closeModal);

  // Close modal when clicking on the blurred backdrop overlay
  if (addVendorModal) {
    addVendorModal.addEventListener('click', (e) => {
      if (e.target === addVendorModal) {
        closeModal();
      }
    });
  }

  // --- Toast Notifications Engine ---
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
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
      toast.style.animation = 'slideInRight 0.3s reverse forwards';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // --- Table Calculations & KPI counters ---
  const statTotal = document.getElementById('statTotal');
  const statActive = document.getElementById('statActive');
  const statPending = document.getElementById('statPending');
  const statTopRated = document.getElementById('statTopRated');
  const vendorTableBody = document.getElementById('vendorTableBody');

  function calculateKPIs() {
    const rows = Array.from(vendorTableBody.querySelectorAll('tr'));
    const total = rows.length;
    
    let activeCount = 0;
    let pendingCount = 0;
    let topRatedCount = 0;

    rows.forEach(row => {
      const status = row.getAttribute('data-status');
      const ratingStars = row.querySelector('.rating-stars').textContent;
      const starCount = (ratingStars.match(/★/g) || []).length;

      if (status === 'active') activeCount++;
      if (status === 'pending') pendingCount++;
      if (starCount >= 5) topRatedCount++;
    });

    if (statTotal) statTotal.textContent = total;
    if (statActive) statActive.textContent = activeCount;
    if (statPending) statPending.textContent = pendingCount;
    if (statTopRated) statTopRated.textContent = topRatedCount;
  }

  // Clear modal errors when typing
  modalInputs.forEach(input => {
    input.addEventListener('input', () => input.classList.remove('error'));
    if (input.tagName === 'SELECT') {
      input.addEventListener('change', () => input.classList.remove('error'));
    }
  });

  // --- Handle Adding New Vendor Profile ---
  if (addVendorForm) {
    addVendorForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Check fields
      let emptyFields = [];
      modalInputs.forEach(input => {
        if (!input.value || !input.value.trim()) {
          emptyFields.push(input);
        }
      });

      if (emptyFields.length > 0) {
        emptyFields.forEach(field => field.classList.add('error'));
        showToast('error', 'Please fill in all the required form fields.', 'danger');
        emptyFields[0].focus();
        return;
      }

      // Generate a new sequential Vendor ID
      const rowsCount = vendorTableBody.querySelectorAll('tr').length;
      const nextIdNum = rowsCount + 1;
      const vendorId = `VND-${String(nextIdNum).padStart(3, '0')}`;

      // Create new table row element
      const tr = document.createElement('tr');
      tr.setAttribute('data-category', vendorCategory.value);
      tr.setAttribute('data-status', vendorStatus.value);

      // Status badge class mapping
      let statusBadgeClass = 'status-active';
      let statusText = 'Active';
      if (vendorStatus.value === 'pending') {
        statusBadgeClass = 'status-badge status-pending';
        statusText = 'Pending';
      } else if (vendorStatus.value === 'inactive') {
        statusBadgeClass = 'status-badge status-inactive';
        statusText = 'Inactive';
      } else {
        statusBadgeClass = 'status-badge status-active';
      }

      tr.innerHTML = `
        <td><strong>${vendorId}</strong></td>
        <td>${vendorName.value.trim()}</td>
        <td>${vendorCompany.value.trim()}</td>
        <td>${vendorEmail.value.trim()}</td>
        <td>${vendorPhone.value.trim()}</td>
        <td>${vendorGst.value.trim()}</td>
        <td>${vendorCategory.value}</td>
        <td>
          <div class="rating-stars">★★★★★</div>
        </td>
        <td><span class="${statusBadgeClass}">${statusText}</span></td>
        <td class="action-columns">
          <div class="action-buttons">
            <button class="action-btn btn-view" title="View Profile">View</button>
            <button class="action-btn btn-edit" title="Edit Profile">Edit</button>
            <button class="action-btn btn-delete" title="Delete Profile">Delete</button>
          </div>
        </td>
      `;

      // Prepend to top of table body
      vendorTableBody.insertBefore(tr, vendorTableBody.firstChild);

      // Recalculate dashboard counters & trigger alert
      calculateKPIs();
      showToast('added', `Supplier '${vendorCompany.value}' registered successfully!`, 'success');
      closeModal();
      filterTable(); // Refresh table view under current filters
    });
  }

  // --- Search & Filtering engine ---
  const searchVendor = document.getElementById('searchVendor');
  const filterCategory = document.getElementById('filterCategory');
  const filterStatus = document.getElementById('filterStatus');

  function filterTable() {
    const query = searchVendor.value.trim().toLowerCase();
    const categoryFilter = filterCategory.value;
    const statusFilter = filterStatus.value;
    const rows = vendorTableBody.querySelectorAll('tr');

    rows.forEach(row => {
      const vendorId = row.querySelector('td:nth-child(1)').textContent.toLowerCase();
      const name = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
      const company = row.querySelector('td:nth-child(3)').textContent.toLowerCase();
      const email = row.querySelector('td:nth-child(4)').textContent.toLowerCase();
      
      const rowCategory = row.getAttribute('data-category');
      const rowStatus = row.getAttribute('data-status');

      // Check text search query
      const matchesSearch = vendorId.includes(query) || name.includes(query) || company.includes(query) || email.includes(query);
      
      // Check dropdown category match
      const matchesCategory = !categoryFilter || rowCategory === categoryFilter;

      // Check dropdown status match
      const matchesStatus = !statusFilter || rowStatus === statusFilter;

      if (matchesSearch && matchesCategory && matchesStatus) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  }

  if (searchVendor) searchVendor.addEventListener('input', filterTable);
  if (filterCategory) filterCategory.addEventListener('change', filterTable);
  if (filterStatus) filterStatus.addEventListener('change', filterTable);

  // --- Table Actions (Delete, View, Edit) via Event Delegation ---
  if (vendorTableBody) {
    vendorTableBody.addEventListener('click', (e) => {
      const row = e.target.closest('tr');
      if (!row) return;

      const vendorId = row.querySelector('td:nth-child(1)').textContent;
      const name = row.querySelector('td:nth-child(2)').textContent;
      const company = row.querySelector('td:nth-child(3)').textContent;
      const email = row.querySelector('td:nth-child(4)').textContent;
      const phone = row.querySelector('td:nth-child(5)').textContent;
      const gst = row.querySelector('td:nth-child(6)').textContent;
      const category = row.querySelector('td:nth-child(7)').textContent;
      const statusBadge = row.querySelector('.status-badge').textContent;

      // Click: Delete
      if (e.target.classList.contains('btn-delete')) {
        const confirmed = confirm(`Are you sure you want to delete the vendor profile for '${company}' (${vendorId})?`);
        if (confirmed) {
          row.remove();
          calculateKPIs();
          showToast('deleted', `Vendor ${vendorId} deleted.`, 'danger');
        }
      }

      // Click: View details modal/banner
      if (e.target.classList.contains('btn-view')) {
        alert(
          `VENDOR ERP DOSSIER (${vendorId})\n` +
          `----------------------------------------\n` +
          `Vendor Contact: ${name}\n` +
          `Company Name: ${company}\n` +
          `Category: ${category}\n` +
          `GSTIN Number: ${gst}\n` +
          `Contact Email: ${email}\n` +
          `Contact Phone: ${phone}\n` +
          `Compliance Status: ${statusBadge}\n` +
          `----------------------------------------`
        );
      }

      // Click: Edit
      if (e.target.classList.contains('btn-edit')) {
        alert(`Initiating ERP Modification Sequence for ${vendorId} (${company}). Opening form in edit mode...`);
        // We could also populate modal and open it in edit mode
        vendorName.value = name;
        vendorCompany.value = company;
        vendorEmail.value = email;
        vendorPhone.value = phone;
        vendorGst.value = gst;
        vendorCategory.value = category;
        vendorStatus.value = row.getAttribute('data-status');
        vendorAddress.value = "104 Main Street, Industrial Zone, NY"; // seed placeholder address
        openModal();
      }
    });
  }

  // --- Export Vendors CSV Sheet Download ---
  const exportVendorsBtn = document.getElementById('exportVendorsBtn');
  if (exportVendorsBtn) {
    exportVendorsBtn.addEventListener('click', () => {
      const rows = Array.from(vendorTableBody.querySelectorAll('tr'));
      
      // Build CSV Headers
      let csvContent = "data:text/csv;charset=utf-8,Vendor ID,Contact Name,Company Name,Email,Phone,GST Number,Category,Status\n";
      
      rows.forEach(row => {
        if (row.style.display !== 'none') {
          const cells = Array.from(row.querySelectorAll('td'));
          const rowData = [
            cells[0].textContent, // ID
            cells[1].textContent, // Name
            cells[2].textContent, // Company
            cells[3].textContent, // Email
            cells[4].textContent, // Phone
            cells[5].textContent, // GST
            cells[6].textContent, // Category
            cells[8].textContent  // Status
          ].map(text => `"${text.replace(/"/g, '""')}"`).join(","); // format double quotes
          
          csvContent += rowData + "\n";
        }
      });

      // Trigger actual browser download
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `vendorbridge_vendors_export_${new Date().toISOString().slice(0,10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('export', 'CSV Spreadsheet compiled and downloaded.', 'success');
    });
  }

  // Initial Calculation on Load
  calculateKPIs();
});
