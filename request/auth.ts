import { UserFormData } from "@/types/user.types";



interface VerifyOtpPayload {
  email: string;
  otp:  number;
  type: "signup" | "forgot-password";
}

interface ResetPasswordPayload {
  email: string;
  password: string;
}

export const registerUser = async (formData: UserFormData) => {
  const response = await fetch("/api/auth/register", {
    method: "POST",    credentials: "same-origin",    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const data = await response.json();

  return {
    ok: response.ok,
    status: response.status,
    success: data?.success ?? response.ok,
    data,
  };
};

export interface LoginFormData {
  email: string;
  password: string;
}

export const loginUser = async (formData: LoginFormData) => {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const data = await response.json();

  return {
    ok: response.ok,
    status: response.status,
    success: data?.success ?? response.ok,
    data,
  };
};


export const sendOtp = async (email: string, type: string) => {
  const response = await fetch("/api/otp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      type,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to send OTP.");
  }

  return data;
};


export const verifyOtp = async ({
  email,
  otp,
  type,
}: VerifyOtpPayload) => {
  const response = await fetch("/api/auth/verify-otp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      otp,
      type,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to verify OTP.");
  }

  return data;
};




export const resetPassword = async ({
  email,
  password,
}: ResetPasswordPayload) => {
  const response = await fetch("/api/auth/reset-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to reset password.");
  }

  return data;
};