import type { z } from "zod";

import type {
  addressPayloadSchema,
  createAddressSchema,
  updateAddressPayloadSchema,
} from "../schemas/addresses.schema";

export interface IAddress {
  id: string;
  userId: string;
  title: string;
  isPrimary: boolean;
  city: string;
  street: string;
  phone: string;
  latitude: string;
  longitude: string;
  createdAt: string;
  updatedAt: string;
}

export interface IAddressesPayload {
  addresses: IAddress[];
}

export interface IAddressPayload {
  address: IAddress;
}

export type TAddressFormMessages = {
  cityRequired: string;
  addressRequired: string;
  phoneRequired: string;
  phoneInvalid: string;
};

export type TAddressFormValues = z.infer<
  ReturnType<typeof createAddressSchema>
>;

export type TCreateAddressPayload = z.infer<typeof addressPayloadSchema>;

export type TUpdateAddressPayload = z.infer<typeof updateAddressPayloadSchema>;
