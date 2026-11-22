"use client";

import { useState } from "react";
import { BrushCleaning, X } from "lucide-react";
import { useTranslations } from "next-intl";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/ui/alert-dialog";

import { ProductCollection } from "@/shared/components/product-collection";

interface IClearCartDialogProps {
  onConfirm: () => void | Promise<void>;
  isPending?: boolean;
  disabled?: boolean;
}

export default function ClearCartDialog({
  onConfirm,
  isPending = false,
  disabled = false,
}: IClearCartDialogProps) {
  const t = useTranslations("Cart");
  const [open, setOpen] = useState(false);

  const handleConfirm = async () => {
    await onConfirm();
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        render={
          <ProductCollection.ClearButton
            className="text-text-maroon"
            label={t("clear-cart")}
            pendingLabel={t("clearing")}
            isPending={isPending}
            disabled={disabled || isPending}
          />
        }
      />

      <AlertDialogContent
        size="lg"
        className="max-w-lg gap-5 p-4 sm:gap-6 sm:p-6"
      >
        {/* Close button */}
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label={t("cancel")}
          className="text-muted-foreground hover:text-foreground absolute inset-e-4 top-4 transition-colors sm:inset-e-5 sm:top-5"
          disabled={isPending}
        >
          <X className="size-5 sm:size-6" />
        </button>

        <AlertDialogHeader className="items-center gap-3 text-center">
          {/* Outer circle */}
          <div className="flex size-20 items-center justify-center rounded-full bg-zinc-100 sm:size-26">
            {/* Inner circle */}
            <AlertDialogMedia className="mb-0 size-14 rounded-full bg-zinc-200 sm:size-17.5 [&_svg]:size-6 sm:[&_svg]:size-8">
              <BrushCleaning
                aria-hidden="true"
                className="dark:text-zinc-800"
              />
            </AlertDialogMedia>
          </div>

          <AlertDialogTitle className="text-lg font-semibold text-zinc-800 sm:text-xl dark:text-zinc-50">
            {t("confirmClear")}
          </AlertDialogTitle>

          <AlertDialogDescription className="max-w-sm text-sm leading-relaxed sm:text-base">
            {t("confirmClearDescription")}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="mx-0 mb-0 grid w-full grid-cols-2 gap-2 border-t-0 bg-transparent p-0 sm:gap-4">
          <AlertDialogCancel
            variant="subtle"
            className="h-11 min-w-0 px-2 text-sm sm:h-12 sm:px-4 sm:text-base"
            disabled={isPending}
          >
            {t("cancel")}
          </AlertDialogCancel>

          <AlertDialogAction
            variant="destructive"
            onClick={handleConfirm}
            disabled={isPending}
            className="bg-bg-danger text-text-inverse hover:bg-bg-danger-saturated h-11 min-w-0 px-2 text-sm sm:h-12 sm:px-4 sm:text-base"
          >
            {t("clear-cart")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
