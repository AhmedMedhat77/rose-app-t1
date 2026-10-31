export const TOAST_STATE = {
  Informative: "informative",
  Successful: "successful",
  Unsuccessful: "unsuccessful",
} as const;

export type ToastState = (typeof TOAST_STATE)[keyof typeof TOAST_STATE];
// "informative" | "successful" | "unsuccessful"
