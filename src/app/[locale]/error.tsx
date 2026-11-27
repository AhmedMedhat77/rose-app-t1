"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/shared/ui/button";

type RouteErrorProps = {
  error: Error & { digest?: string };
  retry: () => void;
};

export default function RouteError({ error, retry }: RouteErrorProps) {
  const t = useTranslations("RouteError");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      role="alert"
      className="container mx-auto flex flex-col items-center gap-4 px-4 py-16 text-center"
    >
      <p>{t("message")}</p>
      <Button onClick={retry}>{t("retry")}</Button>
    </div>
  );
}
