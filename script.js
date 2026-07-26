// 1. Automatically track visitor IP when the page loads
window.addEventListener('DOMContentLoaded', () => {
  fetch('/api/track-ip', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  })
    .then(res => res.json())
    .then(data => console.log('IP Tracker response:', data))
    .catch(err => console.error('IP Tracker error:', err));
});

alert("Would you rather.....?");

const form = document.getElementById('latentForm');
const clearBtn = document.getElementById('clearBtn');
const successCard = document.getElementById('successCard');
const reloadBtn = document.getElementById('reloadBtn');

// 2. Handle Form Submission
form.addEventListener('submit', async function (e) {
  e.preventDefault();

  clearErrors();

  let isValid = true;

  const emailInput = document.getElementById('email');
  const emailValue = emailInput.value.trim();
  if (emailValue === '') {
    showError(emailInput, 'emailError', 'Email address is required.');
    isValid = false;
  } else if (!validateEmailFormat(emailValue)) {
    showError(emailInput, 'emailError', 'Please enter a valid email address.');
    isValid = false;
  }

  const nameInput = document.getElementById('name');
  if (nameInput.value.trim() === '') {
    showError(nameInput, 'nameError', 'Name is required.');
    isValid = false;
  }

  const mobInput = document.getElementById('mobno');
  if (mobInput.value.trim() === '') {
    showError(mobInput, 'mobError', 'Mobile number is required.');
    isValid = false;
  }

  const consentRadio = document.getElementById('consent');
  if (!consentRadio.checked) {
    document.getElementById('consentError').textContent =
      'You must agree to the consent terms to submit.';
    isValid = false;
  }

  // If validation passes, send form data to backend
  if (isValid) {
    const formData = {
      name: nameInput.value.trim(),
      email: emailValue,
      mobile: mobInput.value.trim()
    };

    try {
      // Optional: Send form data to server (if you create a /api/submit endpoint later)
      console.log('Form data ready to save:', formData);

      // Show success screen
      form.classList.add('hidden');
      successCard.classList.remove('hidden');
    } catch (err) {
      console.error('Error submitting form:', err);
    }
  }
});

clearBtn.addEventListener('click', function () {
  form.reset();
  clearErrors();
});

if (reloadBtn) {
  reloadBtn.addEventListener('click', function (e) {
    e.preventDefault();
    form.reset();
    clearErrors();
    successCard.classList.add('hidden');
    form.classList.remove('hidden');
  });
}

function showError(inputElement, errorSpanId, message) {
  inputElement.classList.add('input-error');
  document.getElementById(errorSpanId).textContent = message;
}

function clearErrors() {
  const errorSpans = document.querySelectorAll('.error-msg');
  errorSpans.forEach((span) => (span.textContent = ''));

  const inputs = document.querySelectorAll('.text-input');
  inputs.forEach((input) => input.classList.remove('input-error'));
}

function validateEmailFormat(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}