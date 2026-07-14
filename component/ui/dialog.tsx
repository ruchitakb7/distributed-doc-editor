"use client";

import * as React from "react";
import { cn } from "./utils";

export interface DialogProps {
  open: boolean;
  onClose?: () => void;
  // compatible prop used elsewhere
  onOpenChange?: (open: boolean) => void;
  title?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function Dialog({ open, onClose, onOpenChange, title, children, footer, className }: DialogProps) {
  React.useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (onClose) onClose();
        if (onOpenChange) onOpenChange(false);
      }
    };

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose, onOpenChange]);

  if (!open) return null;
  const handleClose = () => {
    if (onClose) onClose();
    if (onOpenChange) onOpenChange(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={handleClose} aria-hidden />

      <div className="relative z-10" onClick={(e) => e.stopPropagation()}>
        {/* children expected to render DialogContent */}
        {children}
      </div>
    </div>
  );
}

export default Dialog;

// Convenience subcomponents to match existing usage
export function DialogContent({ children, className }: { children?: React.ReactNode; className?: string }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      className={cn("w-full max-w-lg rounded-lg bg-white shadow-lg", className)}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  );
}

export function DialogHeader({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <div className={cn("flex items-start justify-between border-b px-6 py-4", className)}>{children}</div>;
}

export function DialogTitle({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <div className={cn("text-lg font-semibold text-grey-800", className)}>{children}</div>;
}

export function DialogDescription({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <div className={cn("text-sm text-grey-600", className)}>{children}</div>;
}

export function DialogFooter({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <div className={cn("border-t px-6 py-4", className)}>{children}</div>;
}
