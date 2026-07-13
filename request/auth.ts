import { UserFormData } from "@/types/user.types";

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