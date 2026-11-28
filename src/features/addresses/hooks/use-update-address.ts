"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateAddress } from "../apis/addresses.api";

import type { IAddress, TUpdateAddressPayload } from "../types/addresses.types";
import { addressesKeys } from "../constant/addresses.keys";

interface IUpdateAddressVariables {
  id: string;
  payload: TUpdateAddressPayload;
}

export function useUpdateAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: IUpdateAddressVariables) =>
      updateAddress(id, payload),

    onSuccess: async (updatedAddress: IAddress) => {
      queryClient.setQueryData(
        addressesKeys.detail(updatedAddress.id),
        updatedAddress,
      );

      await queryClient.invalidateQueries({
        queryKey: addressesKeys.lists(),
      });
    },
  });
}
