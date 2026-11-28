"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteAddress } from "../apis/addresses.api";
import { addressesKeys } from "../constant/addresses.keys";

export function useDeleteAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAddress,

    onSuccess: async (_data, id) => {
      queryClient.removeQueries({
        queryKey: addressesKeys.detail(id),
        exact: true,
      });

      await queryClient.invalidateQueries({
        queryKey: addressesKeys.lists(),
      });
    },
  });
}
