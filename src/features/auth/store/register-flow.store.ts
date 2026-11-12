"use client";

import * as React from "react";

import type { TAccountDetailsValues } from "@/features/auth/types";

export type Step = "email" | "otp" | "details" | "password";

type RegisterFlowState = {
  step: Step;
  email: string;
  details: TAccountDetailsValues | null;
};

const STORAGE_KEY = "rose-register-flow";
const INITIAL: RegisterFlowState = { step: "email", email: "", details: null };

const listeners = new Set<() => void>();
let cachedRaw: string | null = null;
let cachedState: RegisterFlowState = INITIAL;

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

// Must return a stable reference while the stored value is unchanged
function getSnapshot(): RegisterFlowState {
  let raw: string | null = null;
  try {
    raw = sessionStorage.getItem(STORAGE_KEY);
  } catch {}

  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      cachedState = raw ? { ...INITIAL, ...JSON.parse(raw) } : INITIAL;
    } catch {
      cachedState = INITIAL;
    }
  }
  return cachedState;
}

function write(next: RegisterFlowState | null) {
  try {
    if (next) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    else sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    cachedRaw = null;
    cachedState = next ?? INITIAL;
  }
  listeners.forEach((listener) => listener());
}

function update(patch: Partial<RegisterFlowState>) {
  write({ ...getSnapshot(), ...patch });
}

function reset() {
  write(null);
}

const subscribeNoop = () => () => {};

export function useRegisterFlow() {
  const state = React.useSyncExternalStore(
    subscribe,
    getSnapshot,
    () => INITIAL,
  );

  // false during SSR and hydration, true afterwards
  const ready = React.useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );

  return { ...state, ready, update, reset };
}
