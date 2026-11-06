import type { ChangePasswordFormValues } from "../schemas/change-password.schema";

/** Body of POST /api/users/change-password. */
export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export type ChangePasswordField = keyof ChangePasswordFormValues;

export type ChangePasswordFailureReason =
  "current-password" | "validation" | "generic";

export class ChangePasswordRequestError extends Error {
  readonly reason: ChangePasswordFailureReason;
  readonly fields: ChangePasswordField[];

  constructor(
    reason: ChangePasswordFailureReason,
    fields: ChangePasswordField[] = [],
  ) {
    super(reason);
    this.name = "ChangePasswordRequestError";
    this.reason = reason;
    this.fields = fields;
  }
}

interface ChangePasswordErrorBody {
  status?: boolean;
  code?: number;
  message?: string;
  errors?: { path?: string; message?: string }[];
}

const API_PATH_TO_FIELD: Record<string, ChangePasswordField> = {
  currentPassword: "oldPassword",
  oldPassword: "oldPassword",
  newPassword: "newPassword",
  confirmPassword: "confirmNewPassword",
  confirmNewPassword: "confirmNewPassword",
};

export function toChangePasswordPayload(
  values: ChangePasswordFormValues,
): ChangePasswordPayload {
  return {
    currentPassword: values.oldPassword,
    newPassword: values.newPassword,
    confirmPassword: values.confirmNewPassword,
  };
}

export function toChangePasswordError(
  status: number,
  body: ChangePasswordErrorBody | undefined,
): ChangePasswordRequestError {
  const code = body?.code ?? status;

  if (code === 401) {
    return new ChangePasswordRequestError("current-password", ["oldPassword"]);
  }

  if (code === 400 && body?.errors?.length) {
    const fields = body.errors.flatMap((issue) => {
      const field = issue.path ? API_PATH_TO_FIELD[issue.path] : undefined;
      return field ? [field] : [];
    });

    if (fields.length > 0) {
      return new ChangePasswordRequestError("validation", fields);
    }
  }

  return new ChangePasswordRequestError("generic");
}

/** Message key under `accountSettings.changePasswordContent`. */
export function fieldErrorKey(field: ChangePasswordField): string {
  if (field === "oldPassword") return "form.oldPasswordError";
  if (field === "confirmNewPassword")
    return "validation.passwords_do_not_match";
  return "validation.invalid";
}
