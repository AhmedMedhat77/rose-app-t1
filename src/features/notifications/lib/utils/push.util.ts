"use client";

import {
  deleteSubscriptionFromServer,
  sendSubscriptionToServer,
} from "../apis/notification-subscriptions.api";
import { getVapidPublicKey } from "../apis/notification-vapid-public-key.api";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  return Uint8Array.from(rawData, (c) => c.charCodeAt(0));
}

export function isPushSupported() {
  return (
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
}

export async function enablePush(): Promise<"subscribed" | "denied"> {
  const publicKey = await getVapidPublicKey();
  if (!publicKey) throw new Error("Push is not available");

  const permission = await Notification.requestPermission();
  if (permission !== "granted") return "denied";

  await navigator.serviceWorker.register("/sw.js");
  const registration = await navigator.serviceWorker.ready;

  const subscription =
    (await registration.pushManager.getSubscription()) ??
    (await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    }));

  await sendSubscriptionToServer(subscription);
  return "subscribed";
}

export async function disablePush() {
  const registration = await navigator.serviceWorker.getRegistration();
  const subscription = await registration?.pushManager.getSubscription();
  if (!subscription) return;

  const endpoint = subscription.endpoint;
  await subscription.unsubscribe();
  await deleteSubscriptionFromServer(endpoint);
}

export async function hasActiveSubscription() {
  const registration = await navigator.serviceWorker.getRegistration();
  return !!(await registration?.pushManager.getSubscription());
}
