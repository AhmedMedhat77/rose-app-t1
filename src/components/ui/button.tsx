import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import { LoaderCircle } from "lucide-react";

const buttonVariants = cva(
  [
    // flex
    "group/button inline-flex shrink-0 items-center justify-center cursor-pointer",
    // border
    "gap-2.5 whitespace-nowrap rounded-lg border border-transparent",
    // text
    "bg-clip-padding text-base  font-medium dark:font-semibold dark:text-sm ",
    "transition-colors duration-200 outline-none select-none",
    "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
    "active:not-aria-[haspopup]:translate-y-px",
    "disabled:pointer-events-none disabled:cursor-not-allowed",
    "disabled:bg-bg-soft disabled:border-transparent dark:disabled:bg-bg-muted disabled:text-text-muted",
    "aria-invalid:border-destructive aria-invalid:ring-3",
    "aria-invalid:ring-destructive/20",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
    "[&_svg:not([class*='size-'])]:size-4",
  ],
  {
    variants: {
      variant: {
        primary: [
          // color
          "bg-bg-primary text-text-inverse",
          // hover
          "hover:bg-bg-primary-saturated",
        ],
        secondary: [
          // color
          "bg-bg-primary-fade text-text-primary dark:text-text-plain",
          // hover
          "hover:bg-bg-primary-faint",
        ],
        outline: [
          // color
          "border-border-primary  bg-bg-plain text-text-primary",
          // hover
          "hover:bg-bg-primary-fade",
        ],
        subtle: [
          // color
          "border-border-soft bg-bg-muted text-text-plain",
          // hover
          "hover:bg-bg-soft dark:hover:bg-bg-subtle dark:hover:border-border-primary",
        ],
        ghost: [
          // color
          "bg-bg-plain text-text-plain",
          // hover
          "hover:bg-bg-soft",
        ],
        destructive: [
          // color
          "bg-bg-danger text-text-inverse",
          // hover
          "hover:bg-bg-danger-saturated",
        ],
      },

      size: {
        default: "h-11 dark:h-10.25 px-4",
        xs: "h-6 gap-1 rounded-md px-2 text-xs",
        sm: "h-9 gap-1.5 rounded-lg px-3 text-sm",
        lg: "h-12 px-6 text-base",
        icon: "size-11 p-0",
        "icon-xs": "size-6 rounded-md p-0",
        "icon-sm": "size-9 rounded-lg p-0",
        "icon-lg": "size-12 p-0",
      },
    },

    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

type ButtonProps = ButtonPrimitive.Props &
  VariantProps<typeof buttonVariants> & {
    loading?: boolean;
  };

function Button({
  className,
  variant = "primary",
  size = "default",
  loading = false,
  disabled = false,
  children,
  ...props
}: ButtonProps) {
  const isDisabled = Boolean(disabled || loading);

  return (
    <ButtonPrimitive
      data-slot="button"
      data-loading={loading || undefined}
      aria-busy={loading || undefined}
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={isDisabled}
      {...props}
    >
      {children}
      {loading && <LoaderCircle aria-hidden="true" className="animate-spin" />}
    </ButtonPrimitive>
  );
}

export { Button, buttonVariants };
