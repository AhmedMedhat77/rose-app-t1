import type { IApiResponse } from "@/shared/types/api";

import type {
  IAddress,
  IAddressesPayload,
  IAddressPayload,
  TCreateAddressPayload,
  TUpdateAddressPayload,
} from "../types/addresses.types";

// GET addresses
export async function getAddresses(): Promise<IAddress[]> {
  const response = await fetch("/api/addresses");

  const result: IApiResponse<IAddressesPayload> = await response.json();

  if (!response.ok || !result.status) {
    throw new Error(result.message || "Unable to fetch addresses");
  }

  return result.payload.addresses;
}

// GET one address
export async function getAddressById(id: string): Promise<IAddress> {
  const response = await fetch(`/api/addresses/${encodeURIComponent(id)}`);

  const result: IApiResponse<IAddressPayload> = await response.json();

  if (!response.ok || !result.status) {
    throw new Error(result.message || "Unable to fetch address");
  }

  return result.payload.address;
}

// POST address
export async function createAddress(
  payload: TCreateAddressPayload,
): Promise<IAddress> {
  const response = await fetch("/api/addresses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result: IApiResponse<IAddressPayload> = await response.json();

  if (!response.ok || !result.status) {
    throw new Error(result.message || "Unable to create address");
  }

  return result.payload.address;
}

// UPDATE address
export async function updateAddress(
  id: string,
  payload: TUpdateAddressPayload,
): Promise<IAddress> {
  const response = await fetch(`/api/addresses/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result: IApiResponse<IAddressPayload> = await response.json();

  if (!response.ok || !result.status) {
    throw new Error(result.message || "Unable to update address");
  }

  return result.payload.address;
}

// DELETE address
export async function deleteAddress(id: string): Promise<void> {
  const response = await fetch(`/api/addresses/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });

  const result: IApiResponse<unknown> = await response.json();

  if (!response.ok || !result.status) {
    throw new Error(result.message || "Unable to delete address");
  }
}
