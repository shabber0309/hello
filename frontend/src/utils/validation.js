/**
 * Live Fix Validation & Input Sanitization Suite
 * Strict regular expressions for Email, Indian Phone, Strong Password, and Pincode
 */

// Email: Standard RFC 5322 compliant regex
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Indian Mobile Number: Starts with 6, 7, 8, or 9 and exactly 10 digits
export const PHONE_REGEX = /^[6-9]\d{9}$/;

// 6-digit Indian Postal Pincode: Starts with 1-9 and exactly 6 digits
export const PINCODE_REGEX = /^[1-9]\d{5}$/;

// Name: Letters and spaces only, 2-50 characters
export const NAME_REGEX = /^[a-zA-Z\s]{2,50}$/;

// Strong Password Rules:
// - At least 8 characters
// - At least 1 uppercase letter (A-Z)
// - At least 1 lowercase letter (a-z)
// - At least 1 number (0-9)
// - At least 1 special character (!@#$%^&*()_+-=[]{};':"|,.<>/?)
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

/**
 * Validates a password and breaks down individual criteria for live UI indicators.
 */
export function getPasswordValidationState(password = '') {
  const minLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  const isValid = minLength && hasUpper && hasLower && hasNumber && hasSpecial;

  let errorMessage = '';
  if (!password) {
    errorMessage = 'Password is required';
  } else if (!minLength) {
    errorMessage = 'Password must be at least 8 characters long';
  } else if (!hasUpper) {
    errorMessage = 'Password must include at least 1 uppercase letter (A-Z)';
  } else if (!hasLower) {
    errorMessage = 'Password must include at least 1 lowercase letter (a-z)';
  } else if (!hasNumber) {
    errorMessage = 'Password must include at least 1 number (0-9)';
  } else if (!hasSpecial) {
    errorMessage = 'Password must include at least 1 special character (e.g. !@#$%^&*)';
  }

  return {
    isValid,
    errorMessage,
    rules: {
      minLength,
      hasUpper,
      hasLower,
      hasNumber,
      hasSpecial
    }
  };
}

/**
 * Sanitizes numeric inputs: strips non-digits and restricts to maxLength.
 */
export function sanitizeDigits(value = '', maxLength = 10) {
  return String(value).replace(/\D/g, '').slice(0, maxLength);
}

/**
 * Validates phone number starting with 6,7,8,9 and exactly 10 digits.
 */
export function validatePhone(phone = '') {
  const clean = sanitizeDigits(phone, 10);
  if (!clean) {
    return { isValid: false, error: 'Phone number is required' };
  }
  if (!/^[6-9]/.test(clean)) {
    return { isValid: false, error: 'Phone number must start with 6, 7, 8, or 9' };
  }
  if (clean.length !== 10) {
    return { isValid: false, error: 'Phone number must be exactly 10 digits' };
  }
  return { isValid: true, error: '' };
}

/**
 * Validates email address format.
 */
export function validateEmail(email = '') {
  const clean = String(email).trim();
  if (!clean) {
    return { isValid: false, error: 'Email address is required' };
  }
  if (!EMAIL_REGEX.test(clean)) {
    return { isValid: false, error: 'Please enter a valid email address (e.g. name@example.com)' };
  }
  return { isValid: true, error: '' };
}

/**
 * Automatically scrolls the page/container to the first element that failed validation.
 */
export function scrollToFirstError(errors = {}, idMap = {}) {
  const errorKeys = Object.keys(errors);
  if (errorKeys.length === 0) return;

  const firstKey = errorKeys[0];
  const targetId = idMap[firstKey] || `field-${firstKey}`;

  // Try finding by explicit target ID, id, data-field, name, or class
  let el = document.getElementById(targetId) ||
           document.getElementById(firstKey) ||
           document.querySelector(`[data-field="${firstKey}"]`) ||
           document.querySelector(`[name="${firstKey}"]`) ||
           document.querySelector(`.field-error-container-${firstKey}`);

  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    // Attempt focus if it's an interactive element or has a focusable child
    const focusable = el.tagName === 'INPUT' || el.tagName === 'SELECT' || el.tagName === 'TEXTAREA' || el.tagName === 'BUTTON'
      ? el 
      : el.querySelector('input, select, textarea, button');

    if (focusable && typeof focusable.focus === 'function') {
      try {
        focusable.focus({ preventScroll: true });
      } catch (err) {}
    }
  }
}
