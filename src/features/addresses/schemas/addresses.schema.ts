import { z } from "zod";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { TAddressFormMessages } from "../types/addresses.types";

export function createAddressSchema(messages: TAddressFormMessages) {
  return z.object({
    city: z.string().trim().min(1, messages.cityRequired),

    street: z.string().trim().min(1, messages.addressRequired),

    phone: z
      .string()
      .trim()
      .min(1, messages.phoneRequired)
      .refine((value) => {
        const phoneNumber = parsePhoneNumberFromString(value);

        return phoneNumber?.isValid() ?? false;
      }, messages.phoneInvalid),
  });
}

export const addressPayloadSchema = z.object({
  title: z.string().trim().min(1).optional(),
  isPrimary: z.boolean().optional(),
  city: z.string().trim().min(1),
  street: z.string().trim().min(1),
  phone: z.string().refine((value) => {
    const phoneNumber = parsePhoneNumberFromString(value);

    return phoneNumber?.isValid() ?? false;
  }),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
});

export const updateAddressPayloadSchema = addressPayloadSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });
