import type { GENDER_VALUES } from "../schemas/profile.schema";

export type Gender = (typeof GENDER_VALUES)[number];

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

/** Body of PATCH /api/users/profile. `photo` is the temp URL returned by POST /api/upload. */
export interface UpdateProfilePayload {
  firstName: string;
  lastName: string;
  phone: string;
  photo?: string;
}

export interface ApiEnvelope<T> {
  status: boolean;
  code: number;
  payload: T;
}

export type ProfileResponse = ApiEnvelope<{ user: UserProfile }>;
export type UploadResponse = ApiEnvelope<{ url: string }>;
