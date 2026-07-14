export const EMAIL_ACTION = {
  SHARE_DOCUMENT: "SHARE_DOCUMENT",
  FORGOT_PASSWORD: "FORGOT_PASSWORD",
} as const;

export type EmailAction =
  (typeof EMAIL_ACTION)[keyof typeof EMAIL_ACTION];