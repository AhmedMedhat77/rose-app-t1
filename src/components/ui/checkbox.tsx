"use client";

import * as React from "react";
import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";
import { CheckIcon } from "lucide-react";
import { cn } from "cn";

type CheckboxProps = CheckboxPrimitive.Root.Props & {
  label?: React.ReactNode;
  error?: string;
};

function Checkbox({
  className,
  label,
  error,
  "aria-describedby": describedBy,
  ...props
}: CheckboxProps) {
  const errorId = React.useId();

  const box = (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      aria-invalid={error ? true : undefined}
      aria-describedby={
        [describedBy, error ? errorId : undefined].filter(Boolean).join(" ") ||
        undefined
      }
      className={cn(
        // base
        "peer border-border-primary bg-bg-plain relative flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-lg border transition-all outline-none",
        // checked
        "data-checked:bg-bg-primary data-checked:text-text-inverse",
        // hover + focus:
        "hover:ring-ring-default focus-visible:ring-ring-default hover:ring-4 focus-visible:ring-4",
        // error: border
        "aria-invalid:border-border-danger aria-invalid:aria-checked:border-border-primary",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current transition-none"
      >
        <CheckIcon className="size-4" strokeWidth={3} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );

  // if not use label or error
  if (!label && !error) return box;

  return (
    <div data-slot="checkbox-field" className="flex flex-col gap-1.5">
      <label className="text-text-plain flex cursor-pointer items-center gap-2.5 text-sm">
        {box}
        {label}
      </label>
      {error && (
        <p
          id={errorId}
          role="alert"
          className="text-text-danger text-xs font-normal"
        >
          {error}
        </p>
      )}
    </div>
  );
}

export { Checkbox };
