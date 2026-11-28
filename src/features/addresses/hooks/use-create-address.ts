"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createAddress } from "../apis/addresses.api";
import { addressesKeys } from "../constant/addresses.keys";

export function useCreateAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAddress,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: addressesKeys.lists(),
      });
    },
  });
}
