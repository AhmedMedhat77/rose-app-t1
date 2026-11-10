import { z } from "zod";
import { parsePhoneNumberFromString } from "libphonenumber-js";

export function createRegisterSchema(messages: {
  usernameRequired: string;
  emailInvalid: string;
  passwordRequired: string;
  passwordMin: string;
  passwordMismatch: string;
  firstNameRequired: string;
  lastNameRequired: string;
  phoneRequired: string;
  phoneInvalid: string;
  genderRequired: string;
}) {
  return z
    .object({
      username: z.string().trim().min(1, messages.usernameRequired),

      email: z.email({
        error: messages.emailInvalid,
      }),

      password: z
        .string()
        .min(8, "At least 8 characters")
        .regex(/[A-Z]/, "Must contain an uppercase letter")
        .regex(/[a-z]/, "Must contain a lowercase letter")
        .regex(/[0-9]/, "Must contain a number")
        .regex(/[^A-Za-z0-9]/, "Must contain a special character"),

      confirmPassword: z.string().min(1, messages.passwordRequired),

      firstName: z.string().trim().min(1, messages.firstNameRequired),

      lastName: z.string().trim().min(1, messages.lastNameRequired),

      phone: z
        .string()
        .trim()
        .min(1, messages.phoneRequired)
        .refine((value) => {
          const phoneNumber = parsePhoneNumberFromString(value);

          return phoneNumber?.isValid() ?? false;
        }, messages.phoneInvalid),

      gender: z.enum(["MALE", "FEMALE"], {
        error: messages.genderRequired,
      }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      path: ["confirmPassword"],
      message: messages.passwordMismatch,
    });
}

export function createAccountDetailsSchema(messages: {
  usernameRequired: string;
  firstNameRequired: string;
  lastNameRequired: string;
  phoneRequired: string;
  phoneInvalid: string;
  genderRequired: string;
}) {
  return z.object({
    username: z.string().trim().min(1, messages.usernameRequired),
    firstName: z.string().trim().min(1, messages.firstNameRequired),
    lastName: z.string().trim().min(1, messages.lastNameRequired),
    phone: z
      .string()
      .trim()
      .min(1, messages.phoneRequired)
      .refine((value) => {
        const phoneNumber = parsePhoneNumberFromString(value);

        return phoneNumber?.isValid() ?? false;
      }, messages.phoneInvalid),
    gender: z.enum(["MALE", "FEMALE"], { error: messages.genderRequired }),
  });
}

export function createPasswordSchema(messages: {
  passwordRequired: string;
  passwordMin: string;
  passwordUppercase: string;
  passwordLowercase: string;
  passwordNumber: string;
  passwordSpecial: string;
  confirmPasswordRequired: string;
  passwordMismatch: string;
}) {
  return z
    .object({
      password: z
        .string()
        .min(1, messages.passwordRequired)
        .min(8, messages.passwordMin)
        .regex(/[A-Z]/, messages.passwordUppercase)
        .regex(/[a-z]/, messages.passwordLowercase)
        .regex(/[0-9]/, messages.passwordNumber)
        .regex(/[^A-Za-z0-9]/, messages.passwordSpecial),

      confirmPassword: z.string().min(1, messages.confirmPasswordRequired),
    })
    .refine((data) => data.password === data.confirmPassword, {
      path: ["confirmPassword"],
      message: messages.passwordMismatch,
    });
}
