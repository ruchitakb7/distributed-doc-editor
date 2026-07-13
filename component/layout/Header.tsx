import Link from "next/link";
import { Button } from "@/component/ui/button";

export default function Header() {
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
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className="text-sm font-medium text-gray-700 hover:text-blue-600"
          >
            Home
          </Link>

          <Link
            href="/about"
            className="text-sm font-medium text-gray-700 hover:text-blue-600"
          >
            About
          </Link>
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          <Link href="/auth/login">
            <Button variant="ghost">Login</Button>
          </Link>

          <Link href="/auth/register">
            <Button>Register</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}