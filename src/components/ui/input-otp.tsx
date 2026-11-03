"use client";

import * as React from "react";
import { cn } from "cn";
import { OTPInput, OTPInputContext } from "input-otp";
import { MinusIcon } from "lucide-react";

function InputOTP({
  className,
  containerClassName,
  ...props
}: React.ComponentProps<typeof OTPInput> & {
  containerClassName?: string;
}) {
  return (
    <OTPInput
      data-slot="input-otp"
      containerClassName={cn(
        "cn-input-otp flex items-center has-disabled:opacity-50",
        containerClassName,
      )}
      spellCheck={false}
      className={cn("disabled:cursor-not-allowed", className)}
      {...props}
    />
  );
}

function InputOTPGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-group"
      className={cn(
        "has-aria-invalid:border-destructive has-aria-invalid:ring-destructive/20 dark:has-aria-invalid:ring-destructive/40 flex items-center rounded-lg has-aria-invalid:ring-3",
        className,
      )}
      {...props}
    />
  );
}

function InputOTPSlot({
  index,
  isError,
  isDisabled,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  index: number;
  isError?: boolean;
  isDisabled?: boolean;
}) {
  const inputOTPContext = React.useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {};

  const defaultInputStyle = cn(
    "relative z-0 flex h-11.25 w-11.25 items-center justify-center",
    "m-1 rounded-lg border p-4 text-center text-3xl",
    "border-1 border-[var-(--border-soft)",
    "border-input opacity-100",
    "hover:border-[var(--border-default)]",
    "focus:border-[var(--border-primary)]",
    "focus-visible:ring-ring",
    "dark:bg-[var(--bg-soft)]",
    isActive && "border-[var(--border-primary)]",
    isError &&
      "border-border-danger text-text-danger shadow-[0_0_0_3px_var(--border-danger-faint)]",
    isDisabled &&
      "cursor-not-allowed border-input bg-bg-muted text-text-muted opacity-50",
  );

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      className={cn(defaultInputStyle, className)}
      {...props}
    >
      {char && /^\d$/.test(char) ? char : ""}

      {hasFakeCaret && !isDisabled && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="animate-caret-blink bg-foreground h-4 w-px duration-1000" />
        </div>
      )}
    </div>
  );
}

function InputOTPSeparator({ ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-separator"
      className="flex items-center [&_svg:not([class*='size-'])]:size-4"
      role="separator"
      {...props}
    >
      <MinusIcon />
    </div>
  );
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };
