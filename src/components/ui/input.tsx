"use client";
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import { Button } from "@base-ui/react";
import { useLocale, useTranslations } from "next-intl";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Eye, EyeOff, Search, Upload } from "lucide-react";

const defaultInputStyle = cn(
  "rounded-lg",
  "border border-[var(--border-soft)]",
  "p-4",
  "gap-2",
  "opacity-100",
  "focus-visible:ring-ring",
  "hover:!border-[var(--border-default)]",
  "focus:border-[var(--border-primary)]",
  "dark:bg-[var(--bg-soft)]",
);

const errorInputStyle = cn(
  "text-text-danger border-border-danger shadow-[0_0_0_3px_var(--border-danger-faint)] dark:shadow-[0_0_0_3px_var(--border-danger-faint)]",
);

const inputVariants = cva(
  "flex w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50",
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
        default: "w-[20.4rem] h-[3.0rem]",
        sm: "w-[10rem] h-[3.0rem]",
        lg: "w-[40rem] h-[3.0rem]",
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
    <>
      {label && (
        <p
          className={cn(
            isError === true
              ? "text-text-danger"
              : isDisabled === true
                ? "text-text-muted"
                : "text-text-default dark:text-text-soft",
            "py-2 text-[14px] leading-[100%] font-medium tracking-[0%]",
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
              "relative flex h-12.25 w-81.75 cursor-pointer items-center justify-between gap-3 text-right",
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
                className={cn(
                  "text-text-muted absolute top-1/2 flex -translate-y-1/2 items-center justify-center",
                  inputSize === "lg"
                    ? "inset-s-150"
                    : inputSize === "sm"
                      ? "inset-s-32"
                      : "inset-s-75",
                )}
                aria-label={
                  passwordInput === "password"
                    ? "Show password"
                    : "Hide password"
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
    </>
  );
}

function PhoneNumberInput() {
  const t = useTranslations("Input");
  const locale = useLocale();
  const isArabic = locale === "ar";

  return (
    <div dir={isArabic ? "rtl" : "ltr"} className="p-1.25">
      <PhoneInput
        country="eg"
        placeholder={t("phoneNumber")}
        containerClass="!relative !w-[20.4rem] !h-[3rem]"
        inputClass={cn(
          "!w-full !h-[3rem] !rounded-xl  transition-all",
          "!bg-background !text-sm !font-normal !text-foreground",
          "!shadow-none !outline-hidden",
          "placeholder:!text-muted-foreground border-1 border-[var-(--border-soft)]",

          // Hover & Focus
          "hover:!border-[var(--border-default)]",
          "focus:!border-[var(--border-primary)]",
          "focus-visible:!ring-2 focus-visible:!ring-ring",
          isArabic ? "!pr-14 !pl-3 !text-right" : "!pl-14 !pr-3 !text-left",
        )}
        buttonClass={cn(
          "!absolute !top-0 !h-full !w-12",
          "!border-0 !bg-transparent hover:!bg-transparent overflow-hidden ",
          isArabic ? "!right-0 !rounded-r-xl" : "!left-0 !rounded-l-xl",
        )}
        dropdownClass="!z-50 !rounded-lg !border !border-input !bg-background !text-foreground"
        countryCodeEditable={false}
      />
    </div>
  );
}

export { Input, inputVariants, PhoneNumberInput };
