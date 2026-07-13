interface UserValidationData {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

interface ValidationErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export const validateUser = (data: UserValidationData) => {
  const errors: ValidationErrors = {};

  if ("name" in data) {
    if (!data.name?.trim()) {
      errors.name = "Name is required";
    }
  }

  if ("email" in data) {
    if (!data.email?.trim()) {
      errors.email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)
    ) {
      errors.email = "Please enter a valid email address.";
    }
  }

  if ("password" in data) {
    if (!data.password) {
      errors.password = "Password is required";
    } else if (data.password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
    }
  }

  if ("confirmPassword" in data) {
    if (!data.confirmPassword) {
      errors.confirmPassword = "Confirm Password is required.";
    } else if (data.password !== data.confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }
  }

  return errors;
};