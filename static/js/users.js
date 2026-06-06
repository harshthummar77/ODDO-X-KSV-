document.addEventListener('DOMContentLoaded', () => {
  // --- Initialize Users Database in LocalStorage ---
  const defaultUsers = [
    { name: "Administrator", email: "admin@vendorbridge.com", role: "Admin", status: "Active", lastActive: "Just now" },
    { name: "Sarah Jenkins", email: "officer@vendorbridge.com", role: "Procurement Officer", status: "Active", lastActive: "15 mins ago" },
    { name: "John Carter", email: "vendor@vendorbridge.com", role: "Vendor / Supplier", status: "Active", lastActive: "1 hour ago" },
    { name: "Bruce Wayne", email: "manager@vendorbridge.com", role: "Department Manager", status: "Active", lastActive: "3 hours ago" }
  ];

  if (!localStorage.getItem('usersDB')) {
    localStorage.setItem('usersDB', JSON.stringify(defaultUsers));
  }

  // --- DOM Elements ---
  const usersTableBody = document.getElementById('usersTableBody');
  const searchBar = document.getElementById('searchBar');
  const btnCreateUser = document.getElementById('btnCreateUser');
  const userModal = document.getElementById('userModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalCancelBtn = document.getElementById('modalCancelBtn');
  const userForm = document.getElementById('userForm');
  
  const modalTitle = document.getElementById('modalTitle');
  const editUserIndex = document.getElementById('editUserIndex');
  const modalFullName = document.getElementById('modalFullName');
  const modalEmail = document.getElementById('modalEmail');
  const modalRole = document.getElementById('modalRole');
  const modalStatus = document.getElementById('modalStatus');
  const modalSubmitBtn = document.getElementById('modalSubmitBtn');

  // KPI elements
  const kpiTotalUsers = document.getElementById('kpiTotalUsers');
  const activeUserBadge = document.getElementById('activeUserBadge');

  // Header triggers
  const menuToggle = document.getElementById('menuToggle');
  const sidebar = document.getElementById('sidebar');
  const profileTrigger = document.getElementById('profileTrigger');
  const profileDropdown = document.getElementById('profileDropdown');
  const notificationBtn = document.getElementById('notificationBtn');
  const notificationBadge = document.getElementById('notificationBadge');

  // --- Header Navigation Interactions ---
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

  let alertsCount = 2;
  if (notificationBadge) {
    notificationBadge.textContent = alertsCount;
    notificationBadge.style.display = 'block';
  }

  if (notificationBtn) {
    notificationBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (alertsCount > 0) {
        showToast('ERP Audits: Security rules are active. Review staff logins.', 'success');
        if (notificationBadge) notificationBadge.style.display = 'none';
        alertsCount = 0;
      } else {
        showToast('No new security events.', 'success');
      }
    });
  }

  // --- Load and Render Users ---
  function getUsers() {
    return JSON.parse(localStorage.getItem('usersDB')) || [];
  }

  function saveUsers(users) {
    localStorage.setItem('usersDB', JSON.stringify(users));
  }

  function renderUsers(filterText = '') {
    const users = getUsers();
    usersTableBody.innerHTML = '';
    
    let activeSessionsCount = 0;
    const currentLoggedInRole = localStorage.getItem('userRole');
    
    // Set current role badge in KPI card
    if (activeUserBadge) {
      activeUserBadge.textContent = currentLoggedInRole || 'None';
    }

    const filtered = users.filter(user => {
      const matchText = filterText.toLowerCase();
      return (
        user.name.toLowerCase().includes(matchText) ||
        user.email.toLowerCase().includes(matchText) ||
        user.role.toLowerCase().includes(matchText)
      );
    });

    // Update KPI for total users
    if (kpiTotalUsers) {
      kpiTotalUsers.textContent = users.length;
    }

    filtered.forEach((user, idx) => {
      const initials = user.name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
      
      const tr = document.createElement('tr');
      
      // Mark active if current session matches email or username is active
      const isCurrentSession = (user.role === currentLoggedInRole);
      const activeBadgeHtml = isCurrentSession 
        ? `<span style="background-color: var(--success-bg); color: var(--success); font-size: 0.7rem; padding: 2px 6px; border-radius: var(--radius-sm); font-weight: 600; margin-left: 6px;">You</span>`
        : '';
        
      const statusClass = user.status === 'Active' ? 'status-active' : 'status-inactive';
      
      tr.innerHTML = `
        <td>
          <div class="user-cell">
            <div class="user-cell-avatar">${initials}</div>
            <div class="user-cell-meta">
              <span class="user-cell-name">${user.name} ${activeBadgeHtml}</span>
              <span class="user-cell-role">${user.role}</span>
            </div>
          </div>
        </td>
        <td>${user.email}</td>
        <td>
          <span style="font-weight: 500; color: var(--text-main);">${user.role}</span>
        </td>
        <td>
          <span class="status-badge ${statusClass}">${user.status}</span>
        </td>
        <td style="color: var(--text-muted); font-size: 0.85rem;">${user.lastActive || 'Never'}</td>
        <td>
          <div class="action-buttons">
            <button class="btn-sm-primary btn-edit-user" data-index="${idx}">Edit Role</button>
            <button class="btn-sm-danger btn-delete-user" data-index="${idx}" ${isCurrentSession ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>Delete</button>
          </div>
        </td>
      `;
      
      usersTableBody.appendChild(tr);
    });

    // Bind action buttons after rendering
    bindActionButtons();
  }

  // --- Modal Operations ---
  function openModal(titleText, editIdx = null) {
    modalTitle.textContent = titleText;
    editUserIndex.value = editIdx !== null ? editIdx : '';
    
    if (editIdx !== null) {
      const users = getUsers();
      const user = users[editIdx];
      modalFullName.value = user.name;
      modalFullName.disabled = true; // Protect username
      modalEmail.value = user.email;
      modalRole.value = user.role;
      modalStatus.value = user.status;
      modalSubmitBtn.textContent = 'Update User';
    } else {
      userForm.reset();
      modalFullName.disabled = false;
      modalSubmitBtn.textContent = 'Save User';
    }
    
    userModal.style.display = 'flex';
  }

  function closeModal() {
    userModal.style.display = 'none';
    userForm.reset();
  }

  if (btnCreateUser) {
    btnCreateUser.addEventListener('click', () => {
      openModal('Create New ERP User');
    });
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modalCancelBtn) modalCancelBtn.addEventListener('click', closeModal);
  
  if (userModal) {
    userModal.addEventListener('click', (e) => {
      if (e.target === userModal) {
        closeModal();
      }
    });
  }

  // --- Save / Update Form Submission ---
  userForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = modalFullName.value.trim();
    const email = modalEmail.value.trim();
    const role = modalRole.value;
    const status = modalStatus.value;
    const idxVal = editUserIndex.value;
    
    if (!name || !email) {
      showToast('Please fill in all the required fields.', 'danger');
      return;
    }

    const users = getUsers();

    if (idxVal !== '') {
      // Edit mode
      const targetIdx = parseInt(idxVal);
      const oldRole = users[targetIdx].role;
      
      users[targetIdx].email = email;
      users[targetIdx].role = role;
      users[targetIdx].status = status;
      
      saveUsers(users);
      showToast(`Successfully updated role of ${name} to ${role}!`, 'success');
      
      // If Admin edited their own role, re-login/force refresh or let auth.js redirect them
      const currentRole = localStorage.getItem('userRole');
      if (name === 'Administrator' && role !== oldRole) {
        localStorage.setItem('userRole', role);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } else {
      // Create mode
      // Check if user already exists
      const exists = users.some(u => u.name.toLowerCase() === name.toLowerCase() || u.email.toLowerCase() === email.toLowerCase());
      if (exists) {
        showToast('A user with that name or email already exists.', 'danger');
        return;
      }
      
      users.push({
        name: name,
        email: email,
        role: role,
        status: status,
        lastActive: "Never"
      });
      
      saveUsers(users);
      showToast(`Created new user account for ${name} as ${role}!`, 'success');
    }

    closeModal();
    renderUsers(searchBar.value);
  });

  // --- Bind Row Actions (Edit, Delete) ---
  function bindActionButtons() {
    const editBtns = document.querySelectorAll('.btn-edit-user');
    const deleteBtns = document.querySelectorAll('.btn-delete-user');
    
    editBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(btn.getAttribute('data-index'));
        openModal('Edit User Access Role', idx);
      });
    });

    deleteBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(btn.getAttribute('data-index'));
        const users = getUsers();
        const userName = users[idx].name;
        
        if (confirm(`Are you sure you want to delete user account '${userName}'?`)) {
          users.splice(idx, 1);
          saveUsers(users);
          showToast(`Successfully deleted user account '${userName}'.`, 'success');
          renderUsers(searchBar.value);
        }
      });
    });
  }

  // --- Search Bar Filter Listener ---
  if (searchBar) {
    searchBar.addEventListener('input', () => {
      renderUsers(searchBar.value);
    });
  }

  // --- Toast notifications ---
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

  // Initial table render
  renderUsers();
});
