import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "cn";

interface AuthTextFieldProps extends React.ComponentProps<"input"> {
  label: string;
  error?: string;
}

/**
 * Labelled text input used across auth forms. Spread a react-hook-form
 * `register(...)` result onto it — the ref is forwarded to the inner input.
 */
export const AuthTextField = React.forwardRef<
  HTMLInputElement,
  AuthTextFieldProps
>(({ label, error, id, name, className, ...props }, ref) => {
  const fieldId = id ?? name;

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={fieldId}
        className="block text-xs font-medium text-zinc-300"
      >
        {label}
      </label>
      <Input
        id={fieldId}
        name={name}
        ref={ref}
        aria-invalid={error ? true : undefined}
        className={cn(
          "h-11 rounded-lg border border-zinc-700/60 bg-[#38373d] px-3.5 text-sm text-white placeholder:text-zinc-400 focus-visible:border-[#ffa3b9] focus-visible:ring-0",
          className,
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
});

AuthTextField.displayName = "AuthTextField";
