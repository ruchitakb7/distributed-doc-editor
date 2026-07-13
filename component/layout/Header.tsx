"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/component/ui/button";
import { User } from "@/types/user.types";

function readCookie(name: string) {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${encodeURIComponent(name)}=([^;]*)`)
  );
  return match ? decodeURIComponent(match[1]) : null;
}

function getUserFromCookie(): User | null {
  const raw = readCookie("auth_user");
  if (!raw) return null;

  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { clearAuthUser } = useAuth();
  const [cookieUser, setCookieUser] = useState<User | null>(null);

  useEffect(() => {
    setCookieUser(getUserFromCookie());
  }, [pathname]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    clearAuthUser();
    document.cookie = "auth_token=; path=/; max-age=0";
    document.cookie = "auth_user=; path=/; max-age=0";
    document.cookie = "token=; path=/; max-age=0";

    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-2xl font-bold text-blue-600"
        >
          📄 <span className="text-gray-900">LiveDocs</span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-6">
          <Link
            href="/about"
            className="text-sm font-medium text-gray-700 hover:text-blue-600 transition"
          >
            About
          </Link>

          {cookieUser ? (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleLogout}
            >
              Logout
            </Button>
          ) : null}
        </nav>
      </div>
    </header>
  );
}

