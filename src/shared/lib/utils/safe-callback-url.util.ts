export function getSafeCallbackUrl(callbackUrl: string | null): string | null {
  const isSafeCallbackUrl =
    callbackUrl?.startsWith("/") &&
    !callbackUrl.startsWith("//") &&
    // Browsers normalize backslashes and strip tabs and newlines in URLs.
    !/[\\\t\r\n]/.test(callbackUrl);
  if (isSafeCallbackUrl) {
    return isSafeCallbackUrl ? callbackUrl : "/";
  }
  return null;
}
