import { z } from "zod";
import {
  MAX_FILE_SIZE,
  ACCEPTED_IMAGE_TYPES,
} from "../constants/account-settings.constant";

export const GENDER_VALUES = ["MALE", "FEMALE"] as const;

export const profileSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, { message: "errors.firstNameRequired" })
    .min(2, { message: "errors.firstNameTooShort" })
    .max(50, { message: "errors.firstNameTooLong" }),
  lastName: z
    .string()
    .trim()
    .min(1, { message: "errors.lastNameRequired" })
    .min(2, { message: "errors.lastNameTooShort" })
    .max(50, { message: "errors.lastNameTooLong" }),
  phone: z
    .string()
    .regex(/^\+[1-9]\d{7,14}$/, { message: "errors.phoneInvalid" }),
  photo: z
    .custom<File | undefined>()
    .refine((file) => !file || file.size <= MAX_FILE_SIZE, {
      message: "errors.fileSizeExceeded",
    })
    .refine((file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: "errors.invalidFileType",
    })
    .optional(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
