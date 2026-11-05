"use client";

import { useEffect, useMemo, useRef } from "react";
import { CloudUploadIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useController, type Control } from "react-hook-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import { FieldError } from "@/shared/ui/field";
import {
  ACCEPTED_IMAGE_TYPES,
  MAX_FILE_SIZE,
} from "../lib/constants/account-settings.constant";
import type { ProfileFormValues } from "../lib/schemas/profile.schema";

const ACCEPT = ".jpg,.jpeg,.png,.gif";

interface ProfilePhotoFieldProps {
  control: Control<ProfileFormValues>;
  currentPhotoUrl?: string | null;
  initials: string;
}

export function ProfilePhotoUpload({ control, currentPhotoUrl, initials }: ProfilePhotoFieldProps) {
  const t = useTranslations("accountSettings.Profile");
  const inputRef = useRef<HTMLInputElement>(null);
  const { field, fieldState } = useController({ control, name: "photo" });

  const file = field.value;
  // Only preview files that pass the same rules as the schema (avoids a flash before validation).
  const isValidFile = !!file && file.size <= MAX_FILE_SIZE && ACCEPTED_IMAGE_TYPES.includes(file.type);

  const previewUrl = useMemo(
    () => (file && isValidFile ? URL.createObjectURL(file) : undefined),
    [file, isValidFile],
  );
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0];
    if (selected) field.onChange(selected);
    // Reset so choosing the same file again still fires onChange.
    event.target.value = "";
  };

  const errorMessage = fieldState.error?.message;

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
      <div className="relative shrink-0">
        <Avatar className="size-30">
          <AvatarImage src={previewUrl ?? currentPhotoUrl ?? undefined} alt="" />
          <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
        </Avatar>

        <Button
          type="button"
          variant="subtle"
          size="icon"
          className="bg-bg-subtle absolute end-0 bottom-0 size-8 rounded-full"
          aria-label={t("photo.changeAriaLabel")}
          onClick={() => inputRef.current?.click()}
        >
          <CloudUploadIcon className="size-4" aria-hidden />
        </Button>

        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          className="hidden"
          tabIndex={-1}
          aria-hidden
          onChange={handleChange}
        />
      </div>

      <div className="flex flex-col gap-2 text-center sm:text-start">
        <h2 className="text-lg font-semibold">{t("photo.title")}</h2>
        <p className="text-muted-foreground text-sm">{t("photo.hint")}</p>
        {errorMessage && (
          <FieldError errors={[{ message: t(errorMessage as Parameters<typeof t>[0]) }]} />
        )}
      </div>
    </div>
  );
}
