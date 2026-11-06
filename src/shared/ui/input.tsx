"use client";
import { Button } from "@base-ui/react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import { Eye, EyeOff, Search, Upload } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import * as React from "react";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import "react-phone-input-2/lib/style.css";

const defaultInputStyle = cn(
  "rounded-lg min-h-[1rem]",
  "border border-border-soft",
  "p-4",
  "gap-2",
  "opacity-100",
  "hover:ring-ring-default hover:ring-3 hover:border-border-default",
  "dark:bg-bg-soft",
  "focus:border-border-primary focus-visible:border-border-primary focus-visible:ring-ring-default focus-visible:ring-3",
  "aria-invalid:border-border-danger aria-invalid:ring-ring-danger aria-invalid:hover:border-border-danger aria-invalid:focus:border-border-danger aria-invalid:focus-visible:border-border-danger aria-invalid:ring-3",
);

const errorInputStyle = cn(
  "text-text-danger border-border-danger ring-ring-danger ring-3 hover:border-danger hover:ring-ring-danger hover:ring-3 dark:shadow-[0_0_0_3px_border-border-danger-faint]",
);

const inputVariants = cva(
  "flex w-full  rounded-md border bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: defaultInputStyle,

        search: defaultInputStyle,

        number: defaultInputStyle,

        upload: defaultInputStyle,

        password: defaultInputStyle,
      },
      inputSize: {
        default: "h-[3.0rem]",
        sm: "h-[3.0rem]",
        lg: "h-[3.0rem]",
      },
    },
    defaultVariants: {
      variant: "default",
      inputSize: "default",
    },
  },
);

export interface InputProps
  extends
    React.ComponentProps<"input">,
    VariantProps<typeof inputVariants>,
    sideEffect {}

interface sideEffect {
  label?: string;
  isError?: boolean;
  isDisabled?: boolean;
  error?: string;
}

function Input({
  className,
  type,
  variant,
  inputSize,
  label,
  isError,
  isDisabled,
  ...props
}: InputProps) {
  const fileRef = React.useRef<HTMLInputElement>(null);

  const t = useTranslations("Input");

  const [passwordInput, setPasswordInput] = React.useState<string>("password");

  const [fileName, setFileName] = React.useState<File | undefined>();

  return (
    <div className="space-y-1.5">
      {label && (
        <p
          className={cn(
            isError === true
              ? "text-text-danger"
              : isDisabled === true
                ? "text-text-muted"
                : "text-text-default dark:text-text-soft",
            "text-[0.9rem] leading-[100%] font-medium tracking-[0%]",
          )}
        >
          {label}
        </p>
      )}

      <div className="relative">
        {variant === "search" && (
          <Search
            size={18}
            className={cn(
              "text-text-muted absolute inset-5 top-1/2 z-5 -translate-y-1/2",
            )}
          />
        )}

        {variant === "upload" ? (
          <div
            className={cn(
              defaultInputStyle,
              "relative flex h-12.25 cursor-pointer items-center justify-between gap-3 text-right",
              isError === true && errorInputStyle,
            )}
          >
            <input
              ref={fileRef}
              type="file"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setFileName(file);
              }}
            />

            <Button
              type="button"
              className="text-text-primary flex shrink-0 cursor-pointer items-center gap-2"
              onClick={() => fileRef.current?.click()}
            >
              <Upload size={18} />
              <span>{t("uploadFile")}</span>
            </Button>

            {fileName && (
              <p className="text-text-muted min-w-0 truncate text-sm">
                {fileName.name}
              </p>
            )}
          </div>
        ) : (
          <div className="relative w-full">
            <input
              type={
                variant === "number"
                  ? "number"
                  : variant === "password"
                    ? passwordInput
                    : type
              }
              autoComplete={
                type === "email"
                  ? "email"
                  : type === "password"
                    ? "password"
                    : props.autoComplete
              }
              data-slot="input"
              disabled={isDisabled === true}
              placeholder={
                variant === "search"
                  ? t("searchPlaceholder")
                  : variant === "number"
                    ? t("numberPlaceholder")
                    : undefined
              }
              className={cn(
                inputVariants({ variant, inputSize }),
                variant === "search" && "ps-11",
                variant === "password" && "pe-10",
                "placeholder:text-text-muted",
                isError === true && errorInputStyle,
                className,
              )}
              {...props}
            />

            {variant === "password" && (
              <button
                type="button"
                onClick={() =>
                  setPasswordInput((prev) =>
                    prev === "password" ? "text" : "password",
                  )
                }
                className="text-text-muted absolute end-4 top-1/2 flex -translate-y-1/2 items-center justify-center"
                aria-label={
                  passwordInput === "password"
                    ? t("showPassword")
                    : t("hidePassword")
                }
              >
                {passwordInput === "password" ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            )}
          </div>
        )}
      </div>
      {props.error && (
        <p className="text-bg-danger text-sm font-medium">{props.error}</p>
      )}
    </div>
  );
}

interface PhoneNumberInputProps {
  value?: string; // E.164, e.g. "+201012345678"
  onChange?: (value: string) => void;
  onBlur?: () => void;
  id?: string; // so <FieldLabel htmlFor> works
  invalid?: boolean; // aria-invalid + error border
  disabled?: boolean;
  className?: string;
}

function PhoneNumberInput({
  value = "",
  onChange,
  onBlur,
  id,
  invalid,
  disabled,
  className,
}: PhoneNumberInputProps) {
  const t = useTranslations("Input");
  const locale = useLocale();
  const isArabic = locale === "ar";

  return (
    <PhoneInput
      defaultCountry="eg"
      value={value}
      disabled={disabled}
      onChange={(phone) => onChange?.(phone)}
      placeholder={t("phoneNumber")}
      inputProps={{ id, onBlur, "aria-invalid": invalid, dir: "ltr" }}
      className={cn(
        "!relative !h-[3rem] !w-[20.4rem] !rounded-xl",
        "border-border-soft !bg-background border",
        "hover:ring-ring-default hover:border-border-default hover:ring-3",
        "focus:border-border-primary focus-visible:border-border-primary focus-visible:ring-ring-default focus-visible:ring-3",
        "focus-within:!ring-ring focus-within:!ring-2",
        className,
      )}
      inputClassName={cn(
        "!w-full !h-full !rounded-xl",
        "!border-0 !bg-transparent",
        "!text-sm !font-normal !text-foreground",
        "!shadow-none !outline-none",
        "placeholder:!text-muted-foreground",
        "focus:!border-0 focus:!ring-0",
        // isArabic ? "!text-right" : "!text-left",
      )}
      countrySelectorStyleProps={{
        buttonClassName: cn(
          "!h-full !border-0 !bg-transparent",
          "hover:!bg-transparent !shadow-none",
          isArabic ? "!rounded-r-xl" : "!rounded-l-xl",
        ),
        flagClassName: cn(
          "!rounded-sm",
          isArabic ? "!-translate-x-1" : "!translate-x-1",
        ),
        dropdownArrowClassName: "ms-1 !text-muted-foreground",

        dropdownStyleProps: {
          className: cn(
            "!z-[9999] !rounded-lg",
            "relative inset-s-0 !border !border-input",
            "!bg-background !text-foreground",
            isArabic ? "[direction:rtl]" : "[direction:ltr]",
          ),
        },
      }}
    />
  );
}

export { Input, inputVariants, PhoneNumberInput };
