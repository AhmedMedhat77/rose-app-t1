export function getSafeCallbackUrl(
  callbackUrl: string | null,
): string | undefined {
  if (!callbackUrl) return "/";

  const isSafeCallbackUrl =
    callbackUrl?.startsWith("/") &&
    !callbackUrl.startsWith("//") &&
    // Browsers normalize backslashes and strip tabs and newlines in URLs.
    !/[\\\t\r\n]/.test(callbackUrl);
  if (isSafeCallbackUrl) {
    return callbackUrl;
  }
}
