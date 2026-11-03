"use client";

import { useEffect, useState } from "react";

import { getVapidPublicKey } from "../apis/notification-vapid-public-key";
import { useTranslations } from "next-intl";
import {
  disablePush,
  enablePush,
  hasActiveSubscription,
  isPushSupported,
} from "../utils/push";
import { Button } from "@/components/ui/button";
type State =
  | "loading"
  | "hidden"
  | "unsupported"
  | "denied"
  | "off"
  | "on"
  | "busy"
  | "error";

export function NotificationToggle() {
  //Translations
  const t = useTranslations("Header");
  //States
  const [state, setState] = useState<State>("loading");

  useEffect(() => {
    (async () => {
      if (!isPushSupported()) return setState("unsupported");
      const key = await getVapidPublicKey();
      if (!key) return setState("hidden");
      if (Notification.permission === "denied") return setState("denied");
      setState((await hasActiveSubscription()) ? "on" : "off");
    })();
  }, []);

  const handleEnable = async () => {
    setState("busy");
    try {
      const result = await enablePush();
      setState(result === "denied" ? "denied" : "on");
    } catch {
      setState("error");
    }
  };

  const handleDisable = async () => {
    setState("busy");
    try {
      await disablePush();
      setState("off");
    } catch {
      setState("error");
    }
  };

  if (state === "loading" || state === "hidden") return null;

  if (state === "unsupported")
    return <p className="text-text-soft text-sm">{t("pushUnsupported")}</p>;

  if (state === "denied")
    return <p className="text-text-soft text-sm">{t("pushDenied")}</p>;

  return (
    <div className="flex flex-col items-start gap-1">
      {state === "on" ? (
        <Button variant="outline" size="sm" onClick={handleDisable}>
          {t("pushDisable")}
        </Button>
      ) : (
        <Button
          variant="primary"
          size="sm"
          onClick={handleEnable}
          loading={state === "busy"}
        >
          {state === "busy" ? t("pushBusy") : t("pushEnable")}
        </Button>
      )}
      {state === "error" && (
        <p role="alert" className="text-text-danger text-xs">
          {t("pushError")}
        </p>
      )}
    </div>
  );
}
