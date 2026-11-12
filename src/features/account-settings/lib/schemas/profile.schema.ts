import { z } from "zod";

import {
  ACCEPTED_IMAGE_TYPES,
  MAX_FILE_SIZE,
} from "../constants/account-settings.constant";

export function createProfileSchema(messages: {
  firstNameRequired: string;
  firstNameTooShort: string;
  firstNameTooLong: string;
  lastNameRequired: string;
  lastNameTooShort: string;
  lastNameTooLong: string;
  phoneInvalid: string;
  fileSizeExceeded: string;
  invalidFileType: string;
}) {
  return z.object({
    firstName: z
      .string()
      .trim()
      .min(1, messages.firstNameRequired)
      .min(2, messages.firstNameTooShort)
      .max(50, messages.firstNameTooLong),
    lastName: z
      .string()
      .trim()
      .min(1, messages.lastNameRequired)
      .min(2, messages.lastNameTooShort)
      .max(50, messages.lastNameTooLong),
    phone: z.string().regex(/^\+[1-9]\d{7,14}$/, messages.phoneInvalid),
    photo: z
      .file()
      .refine((file) => file.size <= MAX_FILE_SIZE, {
        error: messages.fileSizeExceeded,
      })
      .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
        error: messages.invalidFileType,
      })
      .optional(),
  });
}
