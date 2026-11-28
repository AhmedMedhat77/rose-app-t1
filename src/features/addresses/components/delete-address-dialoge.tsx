"use client";

import { Trash, X } from "lucide-react";
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

import { Button } from "@/shared/ui/button";

interface IDeleteAddressDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isPending?: boolean;
}

export default function DeleteAddressDialog({
  open,
  onOpenChange,
  onConfirm,
  isPending = false,
}: IDeleteAddressDialogProps) {
  // Translation
  const t = useTranslations("Addresses");

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent
        size="lg"
        className="max-w-lg gap-5 p-4 sm:gap-9 sm:p-10"
      >
        {/* Close button */}
        <Button
          variant="ghost"
          type="button"
          onClick={() => onOpenChange(false)}
          aria-label={t("cancel")}
          className="text-text-soft absolute inset-e-0 top-1 cursor-pointer sm:inset-e-1 sm:top-2"
          disabled={isPending}
        >
          <X className="size-5 sm:size-6" />
        </Button>

        <AlertDialogHeader className="items-center gap-3 text-center">
          {/* Outer circle */}
          <div className="bg-bg-muted flex size-20 items-center justify-center rounded-full sm:size-26">
            {/* Inner circle */}
            <AlertDialogMedia className="bg-bg-soft mb-0 size-14 rounded-full sm:size-17.5 [&_svg]:size-6 sm:[&_svg]:size-8">
              <Trash aria-hidden="true" />
            </AlertDialogMedia>
          </div>

          <AlertDialogTitle className="text-text-plain text-lg font-semibold sm:text-xl">
            {t("deleteConfirm")}
          </AlertDialogTitle>
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
            onClick={onConfirm}
            disabled={isPending}
            className="bg-bg-danger text-text-inverse hover:bg-bg-danger-saturated h-11 min-w-0 px-2 text-sm sm:h-12 sm:px-4 sm:text-base"
          >
            {isPending ? t("deleting") : t("confirm")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
