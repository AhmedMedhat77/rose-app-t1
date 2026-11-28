"use client";

import { MapPin, PenLine, Phone, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/shared/ui/button";
import { IAddress } from "../types/addresses.types";

interface IAddressCardProps {
  address: IAddress;
  onEdit: () => void;
  onDelete: () => void;
}

export default function AddressCard({
  address,
  onEdit,
  onDelete,
}: IAddressCardProps) {
  // Translation
  const t = useTranslations("Addresses");

  return (
    <li>
      <fieldset className="border-border-soft hover:border-border-primary relative flex flex-col gap-4 rounded-[12px] border pt-2 pr-9 pb-5 pl-4 transition-colors">
        {address.title && (
          <legend className="text-text-maroon p-1.5 text-2xl font-semibold">
            {address.title}
          </legend>
        )}

        <div className="flex flex-wrap items-center justify-between">
          <p className="text-text-plain flex items-center gap-2.5 text-2xl font-semibold">
            <span className="bg-bg-success text-text-inverse flex size-8.25 shrink-0 items-center justify-center rounded-full">
              <MapPin aria-hidden="true" size={20} />
            </span>
            {address.city}
          </p>

          <p
            dir="ltr"
            className="text-text-default flex items-center gap-2 text-lg font-medium"
          >
            <Phone aria-hidden="true" size={20} />
            {address.phone}
          </p>
        </div>

        <p className="bg-bg-muted text-text-plain w-fit max-w-full rounded-full px-3 py-1 text-base">
          {address.street}
        </p>

        {/* الأزرار فوق الحد، نص الدايرة جوه الكارت ونصها برا */}
        <div className="absolute inset-e-0 top-2 -me-4.5 flex flex-col gap-1.5">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="border-border-default rounded-full border"
            aria-label={t("editAddress", { city: address.city })}
            onClick={onEdit}
          >
            <PenLine aria-hidden="true" size={18} />
          </Button>

          <Button
            type="button"
            variant="destructive"
            size="icon-sm"
            className="rounded-full"
            aria-label={t("deleteAddress", { city: address.city })}
            onClick={onDelete}
          >
            <Trash2 aria-hidden="true" size={18} />
          </Button>
        </div>
      </fieldset>
    </li>
  );
}
