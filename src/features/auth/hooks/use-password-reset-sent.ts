"use client";

import { useSyncExternalStore } from "react";

const storageKey = "auth:password-reset-sent-email";
const changeEvent = "password-reset-sent-change";
let fallbackEmail: string | null = null;
let storageAvailable = true;

function getSnapshot() {
  if (!storageAvailable) return fallbackEmail;
  try {
    return sessionStorage.getItem(storageKey);
  } catch {
    storageAvailable = false;
    return fallbackEmail;
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener(changeEvent, onChange);
  return () => window.removeEventListener(changeEvent, onChange);
}

function setSentEmail(email: string | null) {
  fallbackEmail = email;
  try {
    if (!storageAvailable) {
      window.dispatchEvent(new Event(changeEvent));
      return;
    }
    if (email === null) {
      sessionStorage.removeItem(storageKey);
    } else {
      sessionStorage.setItem(storageKey, email);
    }
  } catch {
    storageAvailable = false;
    // Keep locale switches working when browser storage is unavailable.
  }
  window.dispatchEvent(new Event(changeEvent));
}

export function usePasswordResetSent() {
  // Both locale routes read the same tab-scoped state, including when a
  // previously hidden route is restored by Next.js Activity.
  const sentEmail = useSyncExternalStore(subscribe, getSnapshot, () => null);
  return { sentEmail, setSentEmail };
}
