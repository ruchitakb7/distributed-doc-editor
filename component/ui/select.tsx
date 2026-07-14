"use client";

import * as React from "react";
import { cn } from "./utils";

interface SelectContextProps {
  value?: string;
  onChange?: (val: string) => void;
  open?: boolean;
  setOpen?: (open: boolean) => void;
}

const SelectContext = React.createContext<SelectContextProps>({});

export function Select({ value, onValueChange, children }: { value?: string; onValueChange?: (val: string) => void; children?: React.ReactNode; }) {
  const [open, setOpen] = React.useState(false);

  return (
    <SelectContext.Provider value={{ value, onChange: onValueChange, open, setOpen }}>
      <div className="relative inline-block w-full">{children}</div>
    </SelectContext.Provider>
  );
}

export function SelectTrigger({ children, className, id }: { children?: React.ReactNode; className?: string; id?: string }) {
  const ctx = React.useContext(SelectContext);

  return (
    <div className={cn("w-full", className)} id={id}>
      <button type="button" onClick={() => ctx.setOpen?.(!ctx.open)} className="w-full rounded-md border px-3 py-2 text-left bg-white">
        {children}
      </button>
    </div>
  );
}

export function SelectValue({ placeholder, className }: { placeholder?: string; className?: string }) {
  const ctx = React.useContext(SelectContext);

  return <span className={cn(className ?? "text-slate-700")}>{ctx.value ?? placeholder}</span>;
}

export function SelectContent({ children, className }: { children?: React.ReactNode; className?: string }) {
  const ctx = React.useContext(SelectContext);

  if (!ctx.open) return null;

  return (
    <div className={cn("absolute left-0 mt-2 w-full z-20 rounded-md border bg-white shadow", className)}>
      {children}
    </div>
  );
}

export function SelectItem({ value, children }: { value: string; children?: React.ReactNode }) {
  const ctx = React.useContext(SelectContext);

  const handleClick = () => {
    ctx.onChange?.(value);
    ctx.setOpen?.(false);
  };

  return (
    <div onClick={handleClick} className="px-3 py-2 hover:bg-slate-100 cursor-pointer">
      {children}
    </div>
  );
}

export default Select;
