"use client";

import * as React from "react";
import { Toast as ToastPrimitive } from "@base-ui/react/toast";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";

import { Button } from "@/shared/components/ui/button";
import { XIcon, Check, X, Info } from "lucide-react";
import { TOAST_STATE, type ToastState } from "@/shared/constants/toast-states";
import { useTranslations } from "next-intl";

/** Type guard for toast variants defined in `TOAST_STATE`. */
function isToastState(value: unknown): value is ToastState {
  return Object.values(TOAST_STATE).includes(value as ToastState);
}

const TOAST_ICONS: Record<ToastState, React.ReactNode> = {
  [TOAST_STATE.Informative]: (
    <Info className="text-text-plain" aria-hidden="true" />
  ),
  [TOAST_STATE.Successful]: (
    <Check className="text-text-success" aria-hidden="true" />
  ),
  [TOAST_STATE.Unsuccessful]: (
    <X className="text-text-danger" aria-hidden="true" />
  ),
};

const toast = ToastPrimitive.createToastManager();

/**
 * Adds a toast to the global queue. Requires `Toaster` to be mounted.
 *
 * @param state Visual variant: informative, successful, or unsuccessful.
 * @param title Optional message. Omit to use the translated default for `state`.
 *   Pass an already-translated string for custom copy.
 * @returns The toast id, for later `toast.close` or `toast.update`.
 */
function addToast(state: ToastState, title?: string) {
  return toast.add({
    type: state,
    ...(title ? { title } : {}),
  });
}

/** Provides toast context, auto-dismiss timeout, and the visible-toast limit. */
function ToastProvider({ ...props }: ToastPrimitive.Provider.Props) {
  return <ToastPrimitive.Provider {...props} />;
}

/** Portals the toast viewport out of the local DOM tree (defaults to `document.body`). */
function ToastPortal({ ...props }: ToastPrimitive.Portal.Props) {
  return <ToastPrimitive.Portal data-slot="toast-portal" {...props} />;
}

function ToastViewport({ className, ...props }: ToastPrimitive.Viewport.Props) {
  return (
    <ToastPrimitive.Viewport
      data-slot="toast-viewport"
      className={cn(
        "pointer-events-none fixed inset-x-4 bottom-4 z-50 mx-auto w-auto max-w-sm outline-none sm:start-auto sm:end-4 sm:mx-0 sm:w-full",
        className,
      )}
      {...props}
    />
  );
}

const toastVariants = cva(
  [
    "group/toast pointer-events-auto absolute end-0 bottom-0 z-[calc(1000-var(--toast-index))] w-full origin-bottom rounded-lg border border-border-soft dark:border-0 text-text-plain shadow-subtle-lg will-change-transform outline-none select-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
    "[--gap:0.75rem] [--height:var(--toast-frontmost-height,var(--toast-height))] [--offset-y:calc(var(--toast-offset-y)*-1+calc(var(--toast-index)*var(--gap)*-1)+var(--toast-swipe-movement-y))] [--peek:0.75rem] [--scale:calc(max(0,1-(var(--toast-index)*0.1)))] [--shrink:calc(1-var(--scale))]",
    "h-(--height) [transform:translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)-(var(--toast-index)*var(--peek))-(var(--shrink)*var(--height))))_scale(var(--scale))] [transition:transform_500ms_cubic-bezier(0.22,1,0.36,1),opacity_500ms,height_150ms]",
    "after:absolute after:top-full after:start-0 after:h-[calc(var(--gap)+1px)] after:w-full after:content-['']",
    "data-expanded:h-(--toast-height) data-expanded:[transform:translateX(var(--toast-swipe-movement-x))_translateY(var(--offset-y))]",
    "data-limited:opacity-0 data-starting-style:[transform:translateY(150%)]",
    "[&[data-ending-style]:not([data-limited]):not([data-swipe-direction])]:[transform:translateY(150%)]",
    "data-ending-style:data-[swipe-direction=down]:[transform:translateY(calc(var(--toast-swipe-movement-y)+150%))]",
    "data-ending-style:data-[swipe-direction=left]:[transform:translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))]",
    "data-ending-style:data-[swipe-direction=right]:[transform:translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))]",
    "data-ending-style:data-[swipe-direction=up]:[transform:translateY(calc(var(--toast-swipe-movement-y)-150%))]",
    "data-expanded:data-ending-style:data-[swipe-direction=down]:[transform:translateY(calc(var(--toast-swipe-movement-y)+150%))]",
    "data-expanded:data-ending-style:data-[swipe-direction=left]:[transform:translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))]",
    "data-expanded:data-ending-style:data-[swipe-direction=right]:[transform:translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))]",
    "data-expanded:data-ending-style:data-[swipe-direction=up]:[transform:translateY(calc(var(--toast-swipe-movement-y)-150%))]",
  ],
  {
    variants: {
      variant: {
        informative: "bg-bg-muted",
        successful: "bg-[#073627]", //bg-bg-success-fade
        unsuccessful: "bg-[#431819]", //bg-bg-danger-fade
      },
    },
    defaultVariants: {
      variant: "informative",
    },
  },
);

/**
 * Single toast root: variant styles, stack transforms, swipe, and focus ring.
 * @param variant Visual state: informative, successful, or unsuccessful.
 */
function Toast({
  className,
  variant = TOAST_STATE.Informative,
  ...props
}: ToastPrimitive.Root.Props & VariantProps<typeof toastVariants>) {
  return (
    <ToastPrimitive.Root
      data-slot="toast"
      data-variant={variant}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  );
}

/** Inner layout: icon, title, and close control. Hides content while stacked behind. */
function ToastContent({ className, ...props }: ToastPrimitive.Content.Props) {
  return (
    <ToastPrimitive.Content
      data-slot="toast-content"
      className={cn(
        "flex h-full items-center gap-2.5 overflow-hidden py-4 ps-4 pe-8 transition-opacity duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] data-behind:opacity-0 data-expanded:opacity-100",
        className,
      )}
      {...props}
    />
  );
}

function ToastTitle({ className, ...props }: ToastPrimitive.Title.Props) {
  return (
    <ToastPrimitive.Title
      data-slot="toast-title"
      className={cn("text-sm leading-normal font-semibold", className)}
      {...props}
    />
  );
}

function ToastClose({
  className,
  children,
  render = <Button variant="ghost" size="icon-sm" />,
  ...props
}: ToastPrimitive.Close.Props) {
  return (
    <ToastPrimitive.Close
      data-slot="toast-close"
      render={render}
      className={cn(
        "text-text-soft absolute end-1 top-1 shrink-0 after:absolute after:-inset-2 after:content-['']",
        className,
      )}
      {...props}
    >
      {children ?? <XIcon aria-hidden="true" />}
    </ToastPrimitive.Close>
  );
}

/**
 * Variant icon. Decorative; hidden from the accessibility tree.
 * @param type Toast variant used to pick the icon and color.
 */
function ToastIcon({ type }: { type: ToastState }) {
  return (
    <span
      data-slot="toast-icon"
      className="shrink-0 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4"
    >
      {TOAST_ICONS[type]}
    </span>
  );
}

/** Renders the current queue from the toast manager. */
function ToastList({ closeLabel }: { closeLabel: string }) {
  // Translation
  const t = useTranslations("toast");
  const { toasts } = ToastPrimitive.useToastManager();

  return toasts.map((toastItem) => {
    const state = isToastState(toastItem.type)
      ? toastItem.type
      : TOAST_STATE.Informative;
    const title =
      typeof toastItem.title === "string" && toastItem.title.trim() !== ""
        ? toastItem.title
        : t(state);

    return (
      <Toast key={toastItem.id} toast={toastItem} variant={state}>
        <ToastContent>
          <ToastIcon type={state} />
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <ToastTitle>{title}</ToastTitle>
          </div>
          <ToastClose aria-label={closeLabel} />
        </ToastContent>
      </Toast>
    );
  });
}

function Toaster({
  children,
  toastManager = toast,
  ...props
}: ToastPrimitive.Provider.Props) {
  // Translation
  const t = useTranslations("toast");

  return (
    <ToastProvider toastManager={toastManager} {...props}>
      {children}
      <ToastPortal>
        <ToastViewport aria-label={t("notifications")}>
          <ToastList closeLabel={t("close")} />
        </ToastViewport>
      </ToastPortal>
    </ToastProvider>
  );
}

const createToastManager = ToastPrimitive.createToastManager;
const useToastManager = ToastPrimitive.useToastManager;

export {
  Toaster,
  Toast,
  ToastClose,
  ToastContent,
  ToastPortal,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  createToastManager,
  addToast,
  toast,
  useToastManager,
};
