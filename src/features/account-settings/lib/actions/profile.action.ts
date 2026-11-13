"use server";

import { updateTag } from "next/cache";
import { getServerSession } from "next-auth";

import { authOptions } from "@/auth";

import {
  deleteAccount,
  profileCacheTag,
  ProfileRequestError,
  updateProfile,
  uploadProfilePhoto,
} from "../apis/profile.api";
import { createProfileSchema } from "../schemas/profile.schema";
import type {
  DeleteAccountActionResult,
  ProfileFormValues,
  UpdateProfileActionResult,
} from "../types/profile.types";

const profileActionSchema = createProfileSchema({
  firstNameRequired: "Invalid first name",
  firstNameTooShort: "Invalid first name",
  firstNameTooLong: "Invalid first name",
  lastNameRequired: "Invalid last name",
  lastNameTooShort: "Invalid last name",
  lastNameTooLong: "Invalid last name",
  phoneInvalid: "Invalid phone",
  fileSizeExceeded: "Invalid photo",
  invalidFileType: "Invalid photo",
});

function failed(error: unknown): {
  success: false;
  message: string;
  code?: number;
} {
  if (error instanceof ProfileRequestError) {
    return { success: false, message: "Request failed", code: error.status };
  }

  return { success: false, message: "Request failed" };
}

async function readAccessToken() {
  const session = await getServerSession(authOptions);
  return {
    accessToken: session?.accessToken,
    userId: session?.user?.id,
  };
}

export async function updateProfileAction(
  values: ProfileFormValues,
): Promise<UpdateProfileActionResult> {
  const parsed = profileActionSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, message: "Invalid data" };
  }

  const { accessToken, userId } = await readAccessToken();
  if (!accessToken || !userId) {
    return { success: false, message: "Unauthorized", code: 401 };
  }

  try {
    const photo = parsed.data.photo
      ? await uploadProfilePhoto(accessToken, parsed.data.photo)
      : undefined;

    const user = await updateProfile(accessToken, {
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      phone: parsed.data.phone,
      ...(photo ? { photo } : {}),
    });

    updateTag(profileCacheTag(userId));
    return { success: true, user };
  } catch (error) {
    return failed(error);
  }
}

export async function deleteAccountAction(): Promise<DeleteAccountActionResult> {
  const { accessToken } = await readAccessToken();
  if (!accessToken) {
    return { success: false, message: "Unauthorized", code: 401 };
  }

  try {
    await deleteAccount(accessToken);
    return { success: true };
  } catch (error) {
    return failed(error);
  }
}
