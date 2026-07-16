import { EMAIL_ACTION, EmailAction } from "../constant/emailAction";

interface EmailTemplateParams {
  action: EmailAction;
  data: Record<string, any>;
}

export const getEmailTemplate = ({
  action,
  data,
}: EmailTemplateParams) => {
  switch (action) {
    case EMAIL_ACTION.SHARE_DOCUMENT:
      return {
        subject: "A document has been shared with you",
        html: `
          <h2>Document Shared</h2>

          <p>Hello ${data.userName},</p>

          <p>
            <strong>${data.ownerName}</strong> has shared a document with you.
          </p>

          <p><strong>Document:</strong> ${data.documentTitle}</p>

          <p><strong>Role:</strong> ${data.role}</p>

          <p>Please login to your account to access the document.</p>

          <br/>

          <p>Thank you.</p>
        `,
      };

    case EMAIL_ACTION.FORGOT_PASSWORD:
      return {
        subject: "Reset Your Password",
        html: `
      <h2>Password Reset OTP</h2>

      <p>Hello ${data.userName},</p>

      <p>We received a request to reset your password.</p>

      <p>Your OTP is:</p>

      <h1 style="letter-spacing: 4px;">${data.otp}</h1>

      <p>This OTP is valid for <strong>2 minutes</strong>.</p>

      <p>If you didn't request this, you can safely ignore this email.</p>

      <br/>

      <p>Thank you.</p>
    `,
      };
    default:
      throw new Error("Invalid email action.");
  }
};