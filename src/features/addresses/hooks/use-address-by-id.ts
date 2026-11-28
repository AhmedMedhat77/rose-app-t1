"use client";

import { useQuery } from "@tanstack/react-query";

import { getAddressById } from "../apis/addresses.api";
import { addressesKeys } from "../constant/addresses.keys";

export function useAddressById(id: string) {
  return useQuery({
    queryKey: addressesKeys.detail(id),
    queryFn: () => getAddressById(id),
    enabled: Boolean(id),
  });
}
