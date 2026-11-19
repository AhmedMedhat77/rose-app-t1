"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
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
            label={t("clear-cart")}
            pendingLabel={t("clearing")}
            isPending={isPending}
            disabled={disabled || isPending}
          />
        }
      />

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("confirmClear")}</AlertDialogTitle>

          <AlertDialogDescription>
            {t("confirmClearDescription")}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>
            {t("cancel")}
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isPending}
            className="bg-bg-danger text-text-inverse hover:bg-bg-danger-saturated"
          >
            {t("clear-cart")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
