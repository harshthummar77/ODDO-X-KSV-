document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const togglePasswordBtn = document.getElementById('togglePassword');
  const eyeIcon = document.getElementById('eyeIcon');
  const errorAlert = document.getElementById('errorAlert');
  const errorMessage = document.getElementById('errorMessage');
  const loginButton = document.getElementById('loginButton');

  // Eye Icon SVGs
  const eyeOpenSVG = `
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
  `;

  const eyeClosedSVG = `
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
      <line x1="1" y1="1" x2="23" y2="23"></line>
    </svg>
  `;

  // Toggle password visibility
  togglePasswordBtn.addEventListener('click', () => {
    const isPassword = passwordInput.getAttribute('type') === 'password';
    passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
    togglePasswordBtn.innerHTML = isPassword ? eyeClosedSVG : eyeOpenSVG;
  });

  // Helper to show error alert
  function showError(message, fields = []) {
    errorMessage.textContent = message;
    errorAlert.style.display = 'flex';
    
    // Trigger card shaking animation for premium validation feedback
    const loginCard = document.getElementById('loginCard');
    if (loginCard) {
      loginCard.classList.remove('shake');
      void loginCard.offsetWidth; // Trigger reflow to restart keyframe animation
      loginCard.classList.add('shake');
    }
    
    fields.forEach(field => {
      field.classList.add('error');
    });
  }

  // Helper to hide error alert
  function clearErrors() {
    errorAlert.style.display = 'none';
    usernameInput.classList.remove('error');
    passwordInput.classList.remove('error');
    const loginCard = document.getElementById('loginCard');
    if (loginCard) loginCard.classList.remove('shake');
  }

  // Clear individual field error styling as the user types
  usernameInput.addEventListener('input', () => {
    usernameInput.classList.remove('error');
    if (!usernameInput.value.trim() && !passwordInput.value.trim()) {
      // Keep alert visible if both are empty, otherwise hide if user fixes one
    } else {
      clearErrors();
    }
  });

  passwordInput.addEventListener('input', () => {
    passwordInput.classList.remove('error');
    if (!usernameInput.value.trim() && !passwordInput.value.trim()) {
      // Keep alert visible
    } else {
      clearErrors();
    }
  });

  // Handle Form Submission
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors();

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    // Check for empty fields
    if (!username && !password) {
      showError('Please enter both your username and password.', [usernameInput, passwordInput]);
      return;
    }

    if (!username) {
      showError('Please enter your username or email address.', [usernameInput]);
      usernameInput.focus();
      return;
    }

    if (!password) {
      showError('Please enter your password.', [passwordInput]);
      passwordInput.focus();
      return;
    }

    // Validation passed - Simulate Loading State & API call
    setLoadingState(true);

    // Save the selected role in localStorage for RBAC checks
    const selectedRole = document.getElementById('userRole').value;
    localStorage.setItem('userRole', selectedRole);

    setTimeout(() => {
      // Simulate redirection to dashboard
      window.location.href = 'dashboard.html';
    }, 1500);
  });

  // Toggle button loading animations & disabled features
  function setLoadingState(isLoading) {
    if (isLoading) {
      loginButton.classList.add('loading');
      usernameInput.disabled = true;
      passwordInput.disabled = true;
      togglePasswordBtn.style.pointerEvents = 'none';
    } else {
      loginButton.classList.remove('loading');
      usernameInput.disabled = false;
      passwordInput.disabled = false;
      togglePasswordBtn.style.pointerEvents = 'auto';
    }
  }
});
