"use client";

import { BrushCleaning, X } from "lucide-react";
import { useTranslations } from "next-intl";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/shared/ui/alert-dialog";

type ClearWishlistDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

export default function ClearWishlistDialog({
  open,
  onOpenChange,
  onConfirm,
}: ClearWishlistDialogProps) {
  const t = useTranslations("Wishlist");

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent size="lg" className="gap-6 p-6 sm:max-w-lg">
        {/* Close button */}
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          aria-label={t("cancel")}
          className="text-muted-foreground hover:text-foreground absolute inset-e-5 top-5"
        >
          <X className="size-6" />
        </button>

        <AlertDialogHeader className="items-center gap-6 pt-8 text-center">
          {/* Outer circle */}
          <div className="mb-6 flex size-26 items-center justify-center rounded-full bg-zinc-100">
            {/* Inner circle */}
            <AlertDialogMedia className="mb-0 size-17.5 rounded-full bg-zinc-200 [&_svg]:size-8">
              <BrushCleaning
                aria-hidden="true"
                className="dark:text-zinc-800"
              />
            </AlertDialogMedia>
          </div>

          <AlertDialogTitle className="text-xl font-semibold text-zinc-800 dark:text-zinc-50">
            {t("clearConfirmTitle")}
          </AlertDialogTitle>
        </AlertDialogHeader>

        <AlertDialogFooter className="mx-0 mb-0 grid grid-cols-2 gap-4 border-t-0 bg-transparent p-0">
          <AlertDialogCancel variant="subtle" className="h-12">
            {t("cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={onConfirm}
            className="h-12"
          >
            {t("confirm")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
