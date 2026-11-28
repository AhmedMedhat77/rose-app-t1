"use client";

import { useQuery } from "@tanstack/react-query";

import { getAddresses } from "../apis/addresses.api";
import { addressesKeys } from "../constant/addresses.keys";

export function useAddresses() {
  return useQuery({
    queryKey: addressesKeys.lists(),
    queryFn: getAddresses,
  });
}
