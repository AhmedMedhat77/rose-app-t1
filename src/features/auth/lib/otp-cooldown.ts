const STORAGE_KEY = "rose-otp-sent";

export const OTP_RESEND_SECONDS = 60;

type SavedOtp = { email: string; sentAt: number };

const normalize = (email: string) => email.trim().toLowerCase();

function read(): SavedOtp | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "email" in parsed &&
      "sentAt" in parsed &&
      typeof parsed.email === "string" &&
      typeof parsed.sentAt === "number"
    ) {
      return { email: parsed.email, sentAt: parsed.sentAt };
    }
  } catch {}

  return null;
}

export function markOtpSent(email: string) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ email: normalize(email), sentAt: Date.now() }),
    );
  } catch {}
}

export function clearOtpSent() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
}

// Remaining cooldown for this email, computed from the saved timestamp
export function getRemainingSeconds(email: string): number {
  const saved = read();
  if (!saved || saved.email !== normalize(email)) return 0;

  const elapsed = Math.floor((Date.now() - saved.sentAt) / 1000);
  return Math.min(
    OTP_RESEND_SECONDS,
    Math.max(0, OTP_RESEND_SECONDS - elapsed),
  );
}
