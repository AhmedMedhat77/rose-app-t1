import type { z } from "zod";

import type { GENDER_VALUES } from "../constants/account-settings.constant";
import type { createProfileSchema } from "../schemas/profile.schema";

export type Gender = (typeof GENDER_VALUES)[number];

export type ProfileFormValues = z.infer<ReturnType<typeof createProfileSchema>>;

/** Shape of `payload.user` returned by GET/PATCH /api/users/profile. */
export interface UserProfile {
  id: string;
  username: string;
  email: string;
  phone: string | null;
  firstName: string;
  lastName: string;
  gender: Gender | null;
  photo: string | null;
  emailVerified: boolean;
  phoneVerified: boolean;
  role: string;
  createdAt: string;
  updatedAt: string;
}

/** Body of PATCH /api/users/profile. `photo` is the temp path returned by POST /api/upload. */
export interface UpdateProfilePayload {
  firstName: string;
  lastName: string;
  phone: string;
  photo?: string;
}

export type UpdateProfileActionResult =
  | { success: true; user: UserProfile }
  | { success: false; message: string; code?: number };

export type DeleteAccountActionResult =
  { success: true } | { success: false; message: string; code?: number };

export class ProfileActionError extends Error {
  readonly code?: number;

  constructor(message: string, code?: number) {
    super(message);
    this.name = "ProfileActionError";
    this.code = code;
  }
}
