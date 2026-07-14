import transporter from "../lib/emailTransporter";
import { EmailAction } from "../constant/emailAction";
import { getEmailTemplate } from "../template/emailTemplates";

interface SendEmailParams {
  to: string;
  action: EmailAction;
  data: Record<string, any>;
}

export const sendEmail = async ({
  to,
  action,
  data,
}: SendEmailParams) => {
  const { subject, html } = getEmailTemplate({
    action,
    data,
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    html,
  });
};