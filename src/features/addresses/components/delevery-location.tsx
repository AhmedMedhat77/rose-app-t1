"use client";

import { useState } from "react";
import { LocationEdit } from "lucide-react";
import { usePathname } from "@/i18n/navigation";

import { useDeliveryLocation } from "../context/delivery-location-context";
import AddressesDialog from "./addresses-dialog";

export function DeliveryLocation() {
  const pathname = usePathname();
  const { city } = useDeliveryLocation();
  const [open, setOpen] = useState(false);

  const isCheckout = pathname === "/checkout";

  if (!isCheckout) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex shrink-0 cursor-pointer items-center gap-1 px-2.5 text-start"
      >
        <div className="flex flex-col">
          <span className="text-text-soft text-sm">Deliver to:</span>

          <span className="text-text-maroon-700 flex items-center gap-1 font-medium">
            <LocationEdit className="text-text-maroon-700 size-5" />
            {city || "Select"}
          </span>
        </div>
      </button>

      <AddressesDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
