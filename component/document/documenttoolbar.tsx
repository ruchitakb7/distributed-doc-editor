"use client";

import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Undo2,
  Redo2,
} from "lucide-react";

import { Button } from "@/component/ui/button";

export default function DocumentToolbar() {
  return (
    <div className="sticky top-16 z-40 border-b bg-white">
      <div className="mx-auto flex max-w-6xl items-center gap-2 overflow-x-auto px-6 py-3">

        <Button variant="ghost" size="icon">
          <Bold className="h-4 w-4" />
        </Button>

        <Button variant="ghost" size="icon">
          <Italic className="h-4 w-4" />
        </Button>

        <Button variant="ghost" size="icon">
          <Underline className="h-4 w-4" />
        </Button>

        <div className="mx-2 h-6 w-px bg-gray-300" />

        <Button variant="ghost" size="icon">
          <List className="h-4 w-4" />
        </Button>

        <Button variant="ghost" size="icon">
          <ListOrdered className="h-4 w-4" />
        </Button>

        <div className="mx-2 h-6 w-px bg-gray-300" />

        <Button variant="ghost" size="icon">
          <Undo2 className="h-4 w-4" />
        </Button>

        <Button variant="ghost" size="icon">
          <Redo2 className="h-4 w-4" />
        </Button>

      </div>
    </div>
  );
}