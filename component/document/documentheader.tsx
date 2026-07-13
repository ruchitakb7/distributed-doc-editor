"use client";

import Link from "next/link";
import { ArrowLeft, Share2, History } from "lucide-react";
import { Button } from "@/component/ui/button";

export default function DocumentHeader() {
  return (
    <header className="sticky top-0 z-50 border-b bg-white">
      <div className="mx-auto flex h-16 items-center justify-between px-6">
        {/* Left */}
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-2xl">📄</span>

            <h1 className="text-lg font-semibold text-gray-900">
              LiveDocs
            </h1>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <History className="mr-2 h-4 w-4" />
            Version 1
          </Button>

          <Button size="sm">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
      </div>
    </header>
  );
}