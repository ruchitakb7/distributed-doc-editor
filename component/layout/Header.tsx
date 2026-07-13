"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/component/ui/button";

export default function Header() {
  const router = useRouter();
  const { user, clearAuthUser } = useAuth();
 

const handleLogout = async () => {
  await fetch("/api/auth/logout", {
    method: "POST",
  });

  clearAuthUser();

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

          {user ? (
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

