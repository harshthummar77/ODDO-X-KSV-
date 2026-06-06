// Centralized Role-Based Access Control (RBAC) System for VendorBridge ERP
(function () {
  // Page access configuration for each role
  const rolePermissions = {
    'Admin': [
      'dashboard.html',
      'vendors.html',
      'rfq.html',
      'quotation.html',
      'comparison.html',
      'approvals.html',
      'purchase-invoice.html',
      'activity-logs.html',
      'reports.html',
      'users.html'
    ],
    'Procurement Officer': [
      'dashboard.html',
      'vendors.html',
      'rfq.html',
      'quotation.html',
      'comparison.html',
      'purchase-invoice.html'
    ],
    'Vendor / Supplier': [
      'dashboard.html',
      'quotation.html',
      'comparison.html',
      'purchase-invoice.html'
    ],
    'Department Manager': [
      'dashboard.html',
      'approvals.html',
      'reports.html'
    ]
  };

  const roleNames = {
    'Admin': 'Administrator',
    'Procurement Officer': 'Procurement Officer',
    'Vendor / Supplier': 'Vendor Partner',
    'Department Manager': 'Department Manager'
  };

  const roleEmails = {
    'Admin': 'admin@vendorbridge.com',
    'Procurement Officer': 'officer@vendorbridge.com',
    'Vendor / Supplier': 'vendor@vendorbridge.com',
    'Department Manager': 'manager@vendorbridge.com'
  };

  // Get current filename from path (ignoring parameters/hash)
  const pathname = window.location.pathname;
  const currentPage = pathname.split('/').pop().split('?')[0].split('#')[0] || 'index.html';
  
  // Pages exempt from authentication checks
  const publicPages = ['index.html', 'register.html', 'access-denied.html'];

  // 1. Initial Page Access Verification (Instant Redirect blocking)
  const userRole = localStorage.getItem('userRole');

  if (!publicPages.includes(currentPage)) {
    // If not authenticated, redirect to login
    if (!userRole) {
      window.location.href = 'index.html';
      return;
    }

    // If role has no permissions configured or page is not allowed
    const allowedPages = rolePermissions[userRole] || [];
    if (!allowedPages.includes(currentPage)) {
      window.location.href = 'access-denied.html';
      return;
    }
  }

  // 2. DOM Manipulation for filtering menus and displaying profile role details
  document.addEventListener('DOMContentLoaded', () => {
    if (publicPages.includes(currentPage) && currentPage !== 'access-denied.html') {
      return; // Skip for login and register screens
    }

    const currentRole = localStorage.getItem('userRole');
    if (!currentRole) return;

    // A. Update user profile name and add role tags (beside user name)
    const displayName = roleNames[currentRole] || 'User';
    const initials = displayName.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
    
    // Update top header profile dropdown triggers
    const profileSpan = document.querySelector('.profile-trigger span') || document.querySelector('#profileTrigger span');
    const avatarDiv = document.querySelector('.profile-trigger .avatar') || document.querySelector('#profileTrigger .avatar');
    
    if (profileSpan) {
      profileSpan.innerHTML = `<span>${displayName}</span> <span class="role-badge" style="background-color: var(--secondary); color: var(--primary); padding: 2px 6px; font-size: 0.75rem; border-radius: var(--radius-sm); margin-left: 6px; font-weight: 600;">${currentRole}</span>`;
    }
    if (avatarDiv) {
      avatarDiv.textContent = initials;
    }

    // Update inside dropdown items if they exist
    const dropdownName = document.querySelector('#profileDropdown .dropdown-header .name') || document.querySelector('.dropdown-menu .dropdown-header .name');
    const dropdownEmail = document.querySelector('#profileDropdown .dropdown-header .email') || document.querySelector('.dropdown-menu .dropdown-header .email');
    if (dropdownName) dropdownName.textContent = displayName;
    if (dropdownEmail) dropdownEmail.textContent = roleEmails[currentRole] || 'user@vendorbridge.com';

    // Update sidebar profiles if present
    const sidebarName = document.querySelector('.user-info .user-name');
    const sidebarRoleText = document.querySelector('.user-info .user-role');
    const sidebarAvatar = document.querySelector('.user-profile .avatar');
    
    if (sidebarName) sidebarName.textContent = displayName;
    if (sidebarRoleText) sidebarRoleText.textContent = currentRole;
    if (sidebarAvatar) sidebarAvatar.textContent = initials;

    // B. Dynamically inject User Management sidebar option for Admins
    if (currentRole === 'Admin') {
      injectUserManagementLink();
    }

    // C. Filter sidebar navigation items based on role permissions
    const allowedPages = rolePermissions[currentRole] || [];
    const sidebarLinks = document.querySelectorAll('.sidebar-nav a');
    
    sidebarLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;
      
      const linkPage = href.split('/').pop().split('?')[0].split('#')[0];
      
      // If page is not in role permissions, hide the element
      if (linkPage && !allowedPages.includes(linkPage) && !publicPages.includes(linkPage)) {
        link.style.display = 'none';
      }
    });

    // D. Bind global logout functions
    const logoutBtn1 = document.getElementById('sidebarLogoutBtn');
    const logoutBtn2 = document.getElementById('dropdownLogoutBtn');
    const logoutBtn3 = document.querySelector('.btn-logout');
    
    const triggerLogout = (e) => {
      e.preventDefault();
      localStorage.removeItem('userRole');
      window.location.href = 'index.html';
    };

    if (logoutBtn1) logoutBtn1.addEventListener('click', triggerLogout);
    if (logoutBtn2) logoutBtn2.addEventListener('click', triggerLogout);
    if (logoutBtn3) logoutBtn3.addEventListener('click', triggerLogout);
  });

  // Inject User Management item into Sidebar
  function injectUserManagementLink() {
    const sidebarNav = document.querySelector('.sidebar-nav');
    if (!sidebarNav) return;
    
    // Stop duplicate injections
    if (document.querySelector('.nav-link-users') || document.querySelector('a[href="users.html"]')) return;

    const userLink = document.createElement('a');
    userLink.href = 'users.html';
    userLink.className = 'nav-link nav-link-users';
    
    if (currentPage === 'users.html') {
      userLink.className += ' active';
    }

    userLink.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        <circle cx="12" cy="7" r="4"></circle>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      </svg>
      <span>User Management</span>
    `;

    // Insert just before logout link or at the end
    const logoutLink = document.querySelector('.nav-link-logout');
    if (logoutLink && logoutLink.parentNode === sidebarNav) {
      sidebarNav.insertBefore(userLink, logoutLink);
    } else {
      sidebarNav.appendChild(userLink);
    }
  }

  // Global helper functions for manual role checks inside page scripts
  window.VendorBridgeAuth = {
    getRole: function() {
      return localStorage.getItem('userRole');
    },
    hasAccess: function(page) {
      const role = localStorage.getItem('userRole');
      if (!role) return false;
      return (rolePermissions[role] || []).includes(page);
    }
  };
})();
