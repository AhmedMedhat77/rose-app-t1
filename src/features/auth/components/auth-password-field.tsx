"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "cn";

interface AuthPasswordFieldProps
  extends Omit<React.ComponentProps<"input">, "type"> {
  label: string;
  error?: string;
}

/**
 * Labelled password input with a show/hide toggle. Spread a react-hook-form
 * `register(...)` result onto it — the ref is forwarded to the inner input.
 */
export const AuthPasswordField = React.forwardRef<
  HTMLInputElement,
  AuthPasswordFieldProps
>(({ label, error, id, name, className, ...props }, ref) => {
  const [show, setShow] = React.useState(false);
  const fieldId = id ?? name;

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={fieldId}
        className="block text-xs font-medium text-zinc-300"
      >
        {label}
      </label>
      <div className="relative">
        <Input
          id={fieldId}
          name={name}
          ref={ref}
          type={show ? "text" : "password"}
          aria-invalid={error ? true : undefined}
          className={cn(
            "h-11 rounded-lg border border-zinc-700/60 bg-[#38373d] px-3.5 pe-10 text-sm text-white placeholder:text-zinc-400 focus-visible:border-[#ffa3b9] focus-visible:ring-0",
            className,
          )}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShow((prev) => !prev)}
          className="absolute end-3 top-1/2 -translate-y-1/2 text-zinc-400 transition-colors hover:text-zinc-200"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
        </button>
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
});

AuthPasswordField.displayName = "AuthPasswordField";
