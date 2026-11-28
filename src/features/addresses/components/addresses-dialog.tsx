"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { TOAST_STATE } from "@/shared/lib/constants/toast-states.constant";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Skeleton } from "@/shared/ui/skeleton";
import { addToast } from "@/shared/ui/toast";

import { useAddresses } from "../hooks/use-addresses";
import { useCreateAddress } from "../hooks/use-create-address";
import { useDeleteAddress } from "../hooks/use-delete-address";
import { useUpdateAddress } from "../hooks/use-update-address";

import type {
  IAddress,
  TCreateAddressPayload,
  TUpdateAddressPayload,
} from "../types/addresses.types";

import AddressCard from "./address-card";
import AddressForm from "./address-form";
import DeleteAddressDialog from "./delete-address-dialoge";

interface IAddressesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// List or form (address = null means create)
type TView = { name: "list" } | { name: "form"; address: IAddress | null };

function AddressesSkeleton({ label }: { label: string }) {
  return (
    <div role="status" aria-busy="true" className="flex flex-col gap-9">
      <span className="sr-only">{label}</span>

      {Array.from({ length: 3 }, (_, index) => (
        <Skeleton key={index} className="h-28 w-full rounded-lg" />
      ))}
    </div>
  );
}

export default function AddressesDialog({
  open,
  onOpenChange,
}: IAddressesDialogProps) {
  // Translation
  const t = useTranslations("Addresses");

  // State
  const [view, setView] = useState<TView>({ name: "list" });
  const [addressToDelete, setAddressToDelete] = useState<IAddress | null>(null);

  // Queries
  const {
    data: addresses = [],
    isPending: isLoading,
    isError,
    refetch,
  } = useAddresses();

  // Mutations
  const createAddress = useCreateAddress();
  const updateAddress = useUpdateAddress();
  const deleteAddress = useDeleteAddress();

  // Variables
  const editing = view.name === "form" ? view.address : null;

  const isSaving = createAddress.isPending || updateAddress.isPending;

  const title =
    view.name === "list"
      ? t("title")
      : editing
        ? t("editTitle")
        : t("addTitle");

  // Functions
  function handleOpenChange(next: boolean) {
    if (!next) {
      setView({ name: "list" });
      setAddressToDelete(null);
    }

    onOpenChange(next);
  }

  function handleSubmitForm(values: TCreateAddressPayload) {
    if (editing) {
      const payload: TUpdateAddressPayload = values;

      updateAddress.mutate(
        {
          id: editing.id,
          payload,
        },
        {
          onSuccess: () => {
            addToast(TOAST_STATE.Successful, t("updated"));
            setView({ name: "list" });
          },
          onError: (error) => {
            addToast(TOAST_STATE.Unsuccessful, error.message);
          },
        },
      );

      return;
    }

    createAddress.mutate(values, {
      onSuccess: () => {
        addToast(TOAST_STATE.Successful, t("created"));
        setView({ name: "list" });
      },
      onError: (error) => {
        addToast(TOAST_STATE.Unsuccessful, error.message);
      },
    });
  }

  function handleConfirmDelete() {
    if (!addressToDelete) return;

    deleteAddress.mutate(addressToDelete.id, {
      onSuccess: () => {
        addToast(TOAST_STATE.Successful, t("deleted"));
        setAddressToDelete(null);
      },
      onError: (error) => {
        addToast(TOAST_STATE.Unsuccessful, error.message);
      },
    });
  }

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent
          showCloseButton={false}
          className="max-h-[90vh] scrollbar-none overflow-y-auto p-6 sm:max-w-212"
        >
          <DialogHeader
            className={`flex-row items-center justify-between ${
              view.name === "list"
                ? "border-border-muted border-b pb-4"
                : "pb-2"
            }`}
          >
            {" "}
            <DialogTitle className="text-3xl font-bold">{title}</DialogTitle>
            <DialogDescription className="sr-only">
              {view.name === "list" ? t("description") : t("formDescription")}
            </DialogDescription>
            {view.name === "list" && (
              <Button
                type="button"
                className="text-text-maroon font-medium"
                variant="secondary"
                onClick={() =>
                  setView({
                    name: "form",
                    address: null,
                  })
                }
              >
                {t("addNew")}
              </Button>
            )}
          </DialogHeader>

          {view.name === "form" ? (
            <AddressForm
              key={view.address?.id ?? "new"}
              address={view.address}
              onSubmit={handleSubmitForm}
              isPending={isSaving}
            />
          ) : isLoading ? (
            <AddressesSkeleton label={t("loading")} />
          ) : isError ? (
            <div
              role="alert"
              className="flex flex-col items-center gap-3 py-8 text-center"
            >
              <p className="text-text-danger font-medium">{t("loadError")}</p>

              <Button
                type="button"
                variant="secondary"
                onClick={() => refetch()}
              >
                {t("retry")}
              </Button>
            </div>
          ) : addresses.length === 0 ? (
            <p className="text-text-muted py-8 text-center font-medium">
              {t("empty")}
            </p>
          ) : (
            <ul className="flex flex-col gap-3 pr-3">
              {addresses.map((address) => (
                <AddressCard
                  key={address.id}
                  address={address}
                  onEdit={() =>
                    setView({
                      name: "form",
                      address,
                    })
                  }
                  onDelete={() => setAddressToDelete(address)}
                />
              ))}
            </ul>
          )}
        </DialogContent>
      </Dialog>

      <DeleteAddressDialog
        open={addressToDelete !== null}
        onOpenChange={(next) => {
          if (!next) setAddressToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        isPending={deleteAddress.isPending}
      />
    </>
  );
}
