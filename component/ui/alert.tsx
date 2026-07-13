import * as React from "react";
import { cn } from "./utils";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "success" | "error" | "info";
  title?: string;
  message: string;
}

const variantStyles: Record<NonNullable<AlertProps["variant"]>, string> = {
  success: "border-green-200 bg-green-50 text-green-900",
  error: "border-red-200 bg-red-50 text-red-900",
  info: "border-slate-200 bg-slate-50 text-slate-900",
};

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = "info", title, message, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl border p-4 text-sm",
          variantStyles[variant],
          className
        )}
        role="status"
        {...props}
      >
        {title ? <div className="mb-1 font-semibold">{title}</div> : null}
        <div>{message}</div>
      </div>
    );
  }
);

Alert.displayName = "Alert";
