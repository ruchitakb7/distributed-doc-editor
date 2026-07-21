import * as React from "react";
import { cn } from "./utils";

export interface ToastProps {
  open: boolean;
  variant?: "success" | "error" | "info";
  title?: string;
  message: string;
  onClose: () => void;
  duration?: number;
}

const variantStyles = {
  success: "border-green-200 bg-green-50 text-green-900",
  error: "border-red-200 bg-red-50 text-red-900",
  info: "border-slate-200 bg-slate-50 text-slate-900",
};

export function Toast({
  open,
  variant = "info",
  title,
  message,
  onClose,
  duration = 3000,
}: ToastProps) {
  React.useEffect(() => {
    if (!open) return;

    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [open, duration, onClose]);

  if (!open) return null;

  return (
    <div
      className={cn(
        "fixed bottom-5 right-5 z-50 w-80 rounded-xl border p-4 shadow-lg animate-in slide-in-from-top-2",
        variantStyles[variant]
      )}
      role="alert"
    >
      {title && (
        <div className="mb-1 font-semibold">
          {title}
        </div>
      )}

      <div className="text-sm">
        {message}
      </div>
    </div>
  );
}