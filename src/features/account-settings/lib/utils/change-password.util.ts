import {
  ChangePasswordRequestError,
  type ChangePasswordField,
  type ChangePasswordFormValues,
  type ChangePasswordPayload,
} from "../types/change-password.types";

interface ChangePasswordErrorBody {
  status?: boolean;
  code?: number;
  errors?: { path?: string }[];
}

const API_PATH_TO_FIELD: Record<string, ChangePasswordField> = {
  currentPassword: "oldPassword",
  newPassword: "newPassword",
  confirmPassword: "confirmNewPassword",
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
    return new ChangePasswordRequestError(code, ["oldPassword"]);
  }

  if (code === 400 && body?.errors?.length) {
    const fields = body.errors.flatMap((issue) => {
      const field = issue.path ? API_PATH_TO_FIELD[issue.path] : undefined;
      return field ? [field] : [];
    });

    if (fields.length > 0) {
      return new ChangePasswordRequestError(code, fields);
    }
  }

  return new ChangePasswordRequestError(code);
}

/** Message key under `accountSettings.changePasswordContent`. */
export function fieldErrorKey(field: ChangePasswordField) {
  if (field === "oldPassword") return "form.oldPasswordError" as const;
  if (field === "confirmNewPassword") {
    return "validation.passwords_do_not_match" as const;
  }
  return "validation.invalid" as const;
}
