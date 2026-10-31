"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { cn } from "cn";

export interface TextareaProps extends React.ComponentProps<"textarea"> {
  label?: string;
  errorMessage?: string;
}

/**
 * Long-text field. The label and placeholder come from the `textarea`
 * messages when those props are omitted. A passed value replaces the message.
 *
 * @param label Visible label. Defaults to `textarea.label`.
 * @param placeholder Placeholder text. Defaults to `textarea.placeholder`.
 * @param errorMessage Message under the field. Sets the error state.
 * @param maxLength Limits typed and pasted text.
 * @param className Classes added to the textarea element.
 */
function Textarea({
  className,
  label,
  placeholder,
  errorMessage,
  id,
  maxLength,
  value,
  defaultValue,
  disabled,
  onChange,
  ...props
}: TextareaProps) {
  // Hooks
  const generatedId = React.useId();

  // Constants
  const fieldId = id ?? generatedId;
  const errorId = errorMessage ? `${fieldId}-error` : undefined;
  const describedBy =
    [props["aria-describedby"], errorId].filter(Boolean).join(" ") || undefined;
  const isInvalid =
    Boolean(errorMessage) ||
    props["aria-invalid"] === true ||
    props["aria-invalid"] === "true";

  const t = useTranslations("textarea");
  const resolvedLabel = label ?? t("label");
  const resolvedPlaceholder = placeholder ?? t("placeholder");

  function handleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    if (maxLength != null && event.currentTarget.value.length > maxLength) {
      event.currentTarget.value = event.currentTarget.value.slice(0, maxLength);
    }
    onChange?.(event);
  }

  return (
    <div
      data-slot="textarea-field"
      data-disabled={disabled ? "" : undefined}
      data-invalid={isInvalid ? "" : undefined}
      className="flex w-full flex-col gap-1.5 text-start"
    >
      {resolvedLabel ? (
        <label
          htmlFor={fieldId}
          className={cn(
            "text-sm",
            disabled
              ? "text-text-muted"
              : isInvalid
                ? "text-text-danger"
                : "text-text-default",
          )}
        >
          {resolvedLabel}
        </label>
      ) : null}
      <textarea
        {...props}
        id={fieldId}
        data-slot="textarea"
        placeholder={resolvedPlaceholder}
        disabled={disabled}
        maxLength={maxLength}
        aria-invalid={isInvalid || undefined}
        aria-describedby={describedBy}
        onChange={handleChange}
        {...(value === undefined ? { defaultValue } : { value })}
        className={cn(
          "border-border-soft bg-bg-plain text-text-plain placeholder:text-text-muted field-sizing-content max-h-60 min-h-37.5 w-full resize-y overflow-y-auto rounded-lg border px-3 py-2.5 text-sm break-words transition-colors outline-none",
          "hover:border-border-default",
          "focus:border-border-primary focus-visible:border-border-primary",
          "aria-invalid:border-border-danger aria-invalid:hover:border-border-danger aria-invalid:focus:border-border-danger aria-invalid:focus-visible:border-border-danger",
          "disabled:bg-bg-muted disabled:text-text-muted disabled:placeholder:text-text-muted disabled:cursor-not-allowed disabled:border-transparent",
          className,
        )}
      />
      {errorMessage ? (
        <p id={errorId} role="alert" className="text-text-danger text-sm">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}

export { Textarea };
