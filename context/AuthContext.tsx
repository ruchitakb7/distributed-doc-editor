"use client";

import React, { createContext, useContext, useMemo, useState } from "react";
import { User } from "@/types/user.types";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function getCookie(name: string) {
  if (typeof document === "undefined") {
    return null;
  }

  const nameEQ = `${encodeURIComponent(name)}=`;
  const cookies = document.cookie.split("; ");

  for (const cookie of cookies) {
    if (cookie.startsWith(nameEQ)) {
      return decodeURIComponent(cookie.substring(nameEQ.length));
    }
  }

  return null;
}

function setCookie(
  name: string,
  value: string,
  options: {
    path?: string;
    maxAge?: number;
    sameSite?: "Strict" | "Lax" | "None";
    secure?: boolean;
  } = {}
) {
  if (typeof document === "undefined") {
    return;
  }

  const parts = [`${encodeURIComponent(name)}=${encodeURIComponent(value)}`];

  if (options.maxAge !== undefined) {
    parts.push(`max-age=${options.maxAge}`);
  }

  if (options.path) {
    parts.push(`path=${options.path}`);
  }

  if (options.sameSite) {
    parts.push(`SameSite=${options.sameSite}`);
  }

  if (options.secure) {
    parts.push("secure");
  }

  document.cookie = parts.join("; ");
}

function deleteCookie(name: string, path = "/") {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${encodeURIComponent(name)}=; path=${path}; max-age=0`;
  
}

interface AuthState {
  user: User | null;
  token: string | null;
}

interface AuthContextValue extends AuthState {
  setAuthUser: (payload: { user: User; token: string | null }) => void;
  clearAuthUser: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
  });

  React.useEffect(() => {
    const token = getCookie("auth_token");
    const userCookie = getCookie("auth_user");

    if (userCookie) {
      try {
        const user = JSON.parse(userCookie) as User;
        setAuthState({ user, token});
      } catch {
        deleteCookie("auth_user");
        deleteCookie("auth_token");
      }
    }
  }, []);


  const setAuthUser = (payload: { user: User; token: string | null }) => {
    setAuthState({ user: payload.user, token: payload.token });

    if (payload.token) {
      setCookie("auth_token", payload.token, {
        path: "/",
        maxAge: COOKIE_MAX_AGE,
        sameSite: "Strict",
        secure: process.env.NODE_ENV === "production",
      });
      setCookie("auth_user", JSON.stringify(payload.user), {
        path: "/",
        maxAge: COOKIE_MAX_AGE,
        sameSite: "Strict",
        secure: process.env.NODE_ENV === "production",
      });
    } else {
      deleteCookie("auth_token");
      deleteCookie("auth_user");
    }
  };

  const clearAuthUser = () => {
    setAuthState({ user: null, token: null });
    deleteCookie("auth_user");
    deleteCookie("auth_token");
  };

  const value = useMemo(
    () => ({
      ...authState,
      setAuthUser,
      clearAuthUser,
    }),
    [authState]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
