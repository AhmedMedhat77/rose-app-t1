"use client";

import { useState } from "react";
import { X, Trash } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/ui/alert-dialog";
import { Button } from "@/shared/ui/button";
import { useDeleteAccount } from "../hooks/use-delete-account";

export function DeleteAccountDialog() {
  const t = useTranslations("accountSettings.Profile");
  const [open, setOpen] = useState(false);
  const { deleteAccount, isPending } = useDeleteAccount();

  return (
    <AlertDialog
      open={open}
      // Don't let the dialog close mid-request.
      onOpenChange={(next) => {
        if (!isPending) setOpen(next);
      }}
    >
      <AlertDialogTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            className="text-text-primary hover:text-text-primary h-auto justify-start px-0 hover:bg-transparent"
          />
        }
      >
        {t("actions.delete")}
      </AlertDialogTrigger>

      <AlertDialogContent
        className={
          "bg-bg-plain justify-space-between max-h-93 w-full max-w-118.5 ring-0"
        }
      >
        <Button
          variant="ghost"
          size="icon-xs"
          className="text-text-soft hover:text-text-plain absolute end-4 top-4 bg-transparent transition-opacity hover:bg-transparent"
          onClick={() => setOpen(false)}
          disabled={isPending}
        >
          <X className="size-6" aria-hidden="true" />
          <span className="sr-only">{t("deleteDialog.close")}</span>
        </Button>
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="bg-bg-inverse/5 flex size-26 items-center justify-center rounded-full">
            <div className="bg-bg-inverse/15 flex size-17.5 items-center justify-center rounded-full">
              <Trash className="text-text-plain size-7" aria-hidden />
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            <AlertDialogTitle className="text-xl font-semibold">
              {t("deleteDialog.title")}
            </AlertDialogTitle>
            <AlertDialogDescription
              className={"font-regular text-text-danger text-base"}
            >
              {t("deleteDialog.description")}
            </AlertDialogDescription>
          </div>
        </div>

        <AlertDialogFooter className={"bg-bg-plain gap-2.5 border-0 p-6"}>
          <AlertDialogCancel
            className={
              "bg-bg-subtle border-border-default text-text-plain flex-1 px-4 py-3"
            }
            disabled={isPending}
          >
            {t("deleteDialog.cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-bg-danger text-text-inverse flex-1 px-4 py-3"
            disabled={isPending}
            onClick={(event) => {
              // Keep the dialog open until the request settles; the account is only
              // deleted from this explicit confirm click.
              event.preventDefault();
              deleteAccount(undefined, { onError: () => setOpen(false) });
            }}
          >
            {isPending
              ? t("deleteDialog.confirming")
              : t("deleteDialog.confirm")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
