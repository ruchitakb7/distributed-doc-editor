"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FileText, Menu } from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { User } from "@/types/user.types";


const NAV = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "My Documents", href: "/dashboard/document" },
  { label: "Shared Documents", href: "/dashboard/sharedocument" },
  { label: "Trash Documents", href: "/dashboard/trashdocument" },
  { label: "About", href: "/about" },
];

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
    <header className="sticky top-0 z-40 border-b border-[var(--hairline)] bg-[color-mix(in_oklab,var(--surface-elevated)_85%,transparent)] backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

        <div className="flex items-center gap-10">
          <Link
            href={cookieUser ? "/dashboard" : "/"}
            className="flex items-center gap-2.5"
          >
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary">
              <FileText className="h-4 w-4" strokeWidth={2} />
            </span>

            <span className="font-serif text-2xl leading-none text-foreground">
              LiveDocs
            </span>
          </Link>

          {cookieUser && (
            <>
              <nav className="hidden items-center gap-1 md:flex">
                {NAV.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/about" &&
                      pathname.startsWith(item.href));

                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${isActive
                        ? "bg-accent text-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                        }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

           

            </>
          )}
        </div>


        <div className="flex items-center gap-3">
          {cookieUser ? (
            <button
              onClick={handleLogout}
              className="rounded-full border border-[var(--hairline)] bg-background px-4 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
            >
              Logout
            </button>
          ) : (
            pathname !== "/about" && (
              <Link
                href="/about"
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                About
              </Link>
            )
          )}
        </div>
      </div>

      {cookieUser &&  (
        <nav className="flex items-center gap-2 overflow-x-auto border-t border-[var(--hairline)] bg-background px-4 py-2 md:hidden">
          {NAV.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/about" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.label}
                href={item.href}
               
                className={`whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium ${isActive
                    ? "bg-accent text-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      )}

    </header>
  );
}
