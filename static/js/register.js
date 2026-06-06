document.addEventListener('DOMContentLoaded', () => {
  // --- Form Elements ---
  const registerForm = document.getElementById('registerForm');
  const registerButton = document.getElementById('registerButton');
  
  // Form Inputs
  const fullName = document.getElementById('fullName');
  const companyName = document.getElementById('companyName');
  const email = document.getElementById('email');
  const phone = document.getElementById('phone');
  const countryCode = document.getElementById('countryCode');
  const role = document.getElementById('role');
  const password = document.getElementById('password');
  const confirmPassword = document.getElementById('confirmPassword');
  
  // Password toggles
  const togglePasswordBtn = document.getElementById('togglePassword');
  const toggleConfirmPasswordBtn = document.getElementById('toggleConfirmPassword');
  
  // Validation Alert
  const errorAlert = document.getElementById('errorAlert');
  const errorMessage = document.getElementById('errorMessage');

  // Eye SVGs
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

  // Toggle Password Visibility
  if (togglePasswordBtn && password) {
    togglePasswordBtn.addEventListener('click', () => {
      const isPassword = password.getAttribute('type') === 'password';
      password.setAttribute('type', isPassword ? 'text' : 'password');
      togglePasswordBtn.innerHTML = isPassword ? eyeClosedSVG : eyeOpenSVG;
    });
  }

  if (toggleConfirmPasswordBtn && confirmPassword) {
    toggleConfirmPasswordBtn.addEventListener('click', () => {
      const isPassword = confirmPassword.getAttribute('type') === 'password';
      confirmPassword.setAttribute('type', isPassword ? 'text' : 'password');
      toggleConfirmPasswordBtn.innerHTML = isPassword ? eyeClosedSVG : eyeOpenSVG;
    });
  }

  // Country code phone placeholders
  const placeholders = {
    '+91': '9876543210',
    '+1': '5551234567',
    '+44': '7700900123',
    '+971': '501234567',
    '+61': '412345678',
    '+49': '1701234567',
    '+33': '612345678',
    '+65': '81234567',
    '+81': '9012345678',
    '+86': '13912345678',
    '+966': '501234567',
    '+27': '821234567',
    '+64': '211234567',
    '+55': '11912345678',
    '+41': '791234567',
    '+31': '612345678',
    '+39': '3123456789',
    '+34': '612345678',
    '+7': '9123456789'
  };

  // Country code select updates
  if (countryCode && phone) {
    const selectedDisplay = document.querySelector('.selected-code-display');
    countryCode.addEventListener('change', () => {
      const selectedCode = countryCode.value;
      if (selectedDisplay) {
        selectedDisplay.textContent = selectedCode;
      }
      phone.placeholder = placeholders[selectedCode] || 'Phone Number';
      phone.classList.remove('error');
      countryCode.classList.remove('error');
    });
  }

  // Alert Box displays helper
  function showError(message, fields = []) {
    errorMessage.textContent = message;
    errorAlert.style.display = 'flex';

    // Trigger card shaking animation for premium validation feedback
    const registerCard = document.getElementById('registerCard');
    if (registerCard) {
      registerCard.classList.remove('shake');
      void registerCard.offsetWidth; // trigger reflow
      registerCard.classList.add('shake');
    }

    fields.forEach(field => {
      field.classList.add('error');
    });
  }

  function clearErrors() {
    errorAlert.style.display = 'none';
    const errorInputs = document.querySelectorAll('.error');
    errorInputs.forEach(i => i.classList.remove('error'));
    
    const registerCard = document.getElementById('registerCard');
    if (registerCard) registerCard.classList.remove('shake');
  }

  // Clear errors on typing
  const allInputs = [fullName, companyName, email, phone, role, password, confirmPassword];
  allInputs.forEach(input => {
    if (input) {
      input.addEventListener('input', () => {
        input.classList.remove('error');
        const hasErrors = allInputs.some(i => i && i.classList.contains('error'));
        if (!hasErrors) {
          errorAlert.style.display = 'none';
        }
      });
      if (input.tagName === 'SELECT') {
        input.addEventListener('change', () => {
          input.classList.remove('error');
          errorAlert.style.display = 'none';
        });
      }
    }
  });

  // --- Submit Validations & Redirection ---
  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors();

    const nameVal = fullName.value.trim();
    const companyVal = companyName.value.trim();
    const emailVal = email.value.trim();
    const phoneVal = phone.value.trim();
    const roleVal = role.value;
    const passVal = password.value;
    const confirmPassVal = confirmPassword.value;

    // 1. Required fields validation
    let emptyFields = [];
    if (!nameVal) emptyFields.push(fullName);
    if (!companyVal) emptyFields.push(companyName);
    if (!emailVal) emptyFields.push(email);
    if (!phoneVal) emptyFields.push(phone);
    if (!roleVal) emptyFields.push(role);
    if (!passVal) emptyFields.push(password);
    if (!confirmPassVal) emptyFields.push(confirmPassword);

    if (emptyFields.length > 0) {
      showError('Please fill in all required registration fields.', emptyFields);
      emptyFields[0].focus();
      return;
    }

    // 2. Validate email syntax
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailVal)) {
      showError('Please enter a valid business email address.', [email]);
      email.focus();
      return;
    }

    // 3. Validate phone characters and length
    const selectedCountry = countryCode.value;
    const digitsOnly = phoneVal.replace(/\D/g, ''); // strip any non-digits
    const invalidCharRegex = /[^\d\s\-\(\)\+]/;

    if (invalidCharRegex.test(phoneVal)) {
      showError('Phone number can only contain digits and standard spacing/formatting.', [phone]);
      phone.focus();
      return;
    }

    // Enforce country length rules
    if (selectedCountry === '+91' || selectedCountry === '+1') {
      if (digitsOnly.length !== 10) {
        const countryName = selectedCountry === '+91' ? 'India (+91)' : 'USA/Canada (+1)';
        showError(`Phone number for ${countryName} must be exactly 10 digits.`, [phone]);
        phone.focus();
        return;
      }
    } else if (selectedCountry === '+86' || selectedCountry === '+55') {
      if (digitsOnly.length !== 11) {
        const countryName = selectedCountry === '+86' ? 'China (+86)' : 'Brazil (+55)';
        showError(`Phone number for ${countryName} must be exactly 11 digits.`, [phone]);
        phone.focus();
        return;
      }
    } else {
      // General length validation for other country codes (7 to 12 digits)
      if (digitsOnly.length < 7 || digitsOnly.length > 12) {
        showError('Phone number is invalid. Please enter a valid number.', [phone]);
        phone.focus();
        return;
      }
    }

    // 4. Password length (min 8 chars)
    if (passVal.length < 8) {
      showError('Password must be at least 8 characters long.', [password]);
      password.focus();
      return;
    }

    // 5. Password match check
    if (passVal !== confirmPassVal) {
      showError('Passwords do not match. Please verify your entries.', [password, confirmPassword]);
      confirmPassword.focus();
      return;
    }

    // Validation Succeeded - Simulate Loading & Redirection
    setLoadingState(true);

    setTimeout(() => {
      // Redirect to login page
      window.location.href = 'index.html';
    }, 1500);
  });

  function setLoadingState(isLoading) {
    if (isLoading) {
      registerButton.classList.add('loading');
      allInputs.forEach(i => { if (i) i.disabled = true; });
    } else {
      registerButton.classList.remove('loading');
      allInputs.forEach(i => { if (i) i.disabled = false; });
    }
  }
});
