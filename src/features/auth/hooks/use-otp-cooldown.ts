"use client";

import { useCallback, useEffect, useState } from "react";

import { getRemainingSeconds } from "../lib/otp-cooldown";

export function useOtpCooldown(email: string) {
  const [secondsLeft, setSecondsLeft] = useState(() =>
    getRemainingSeconds(email),
  );

  const sync = useCallback(
    () => setSecondsLeft(getRemainingSeconds(email)),
    [email],
  );

  useEffect(() => {
    if (secondsLeft <= 0) return;

    const id = setTimeout(sync, 1000);
    return () => clearTimeout(id);
  }, [secondsLeft, sync]);

  return { secondsLeft, sync };
}
