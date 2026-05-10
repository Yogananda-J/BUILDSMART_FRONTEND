// Password validation regex
export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// Phone validation regex (exactly 10 digits)
export const phoneRegex = /^\d{10}$/;

// Email validation regex
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Username validation (3-30 characters, alphanumeric and underscores)
export const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;

// Validate password strength
export const validatePassword = (password) => {
  if (!password) {
    return { valid: false, message: 'Password is required' };
  }
  
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters' };
  }
  
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' };
  }
  
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' };
  }
  
  if (!/\d/.test(password)) {
    return { valid: false, message: 'Password must contain at least one digit' };
  }
  
  if (!/[@$!%*?&]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one special character (@$!%*?&)' };
  }
  
  return { valid: true, message: 'Password is strong' };
};

// Validate phone number
export const validatePhone = (phone) => {
  if (!phone) {
    return { valid: false, message: 'Phone number is required' };
  }
  
  if (!phoneRegex.test(phone)) {
    return { valid: false, message: 'Phone must be exactly 10 digits' };
  }
  
  return { valid: true, message: 'Valid phone number' };
};

// Validate email
export const validateEmail = (email) => {
  if (!email) {
    return { valid: false, message: 'Email is required' };
  }
  
  if (!emailRegex.test(email)) {
    return { valid: false, message: 'Invalid email format' };
  }
  
  return { valid: true, message: 'Valid email' };
};

// Validate username
export const validateUsername = (username) => {
  if (!username) {
    return { valid: false, message: 'Username is required' };
  }
  
  if (username.length < 3) {
    return { valid: false, message: 'Username must be at least 3 characters' };
  }
  
  if (username.length > 30) {
    return { valid: false, message: 'Username must be at most 30 characters' };
  }
  
  if (!usernameRegex.test(username)) {
    return { valid: false, message: 'Username must contain only alphanumeric characters and underscores' };
  }
  
  return { valid: true, message: 'Valid username' };
};

// Check password match
export const validatePasswordMatch = (password, confirmPassword) => {
  if (!confirmPassword) {
    return { valid: false, message: 'Please confirm your password' };
  }
  
  if (password !== confirmPassword) {
    return { valid: false, message: 'Passwords do not match' };
  }
  
  return { valid: true, message: 'Passwords match' };
};
