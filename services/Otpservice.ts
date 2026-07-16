import bcrypt from "bcryptjs";
import Otp from "@/models/otp";
import { sendEmail } from "../services/Emailservice";
import { EmailAction } from "@/constant/emailAction";
import UserModel from "@/models/User";

interface SendOtpServiceParams {
  email: string;
  userName: string;
  type: "forgot-password";
  action: EmailAction;
}

interface VerifyOtpPayload {
  email: string;
  otp: number;
  type: "signup" | "forgot-password";
}


export const sendOtpService = async ({
  email,
  userName,
  type,
  action,
}: SendOtpServiceParams) => {
  // Delete existing OTP
  await Otp.deleteMany({
    email,
    type,
  });

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Hash OTP
//   const hashedOtp = await bcrypt.hash(otp, 10);

  // Save OTP
  await Otp.create({
    email,
    otp: otp,
    type,
    expiresAt: new Date(Date.now() + 2 * 60 * 1000),
  });

  // Send Email
  await sendEmail({
    to: email,
    action,
    data: {
      userName,
      otp,
    },
  });

  return {
    success: true,
    message: "OTP sent successfully.",
  };
};


export const verifyOtpService = async ({
  email,
  otp,
  type,
}: VerifyOtpPayload) => {
  const user = await Otp.findOne({
    email: email.trim().toLowerCase(),
  });

 

  if (!user) {
    return {
      success: false,
      message: "No user found with this email.",
    };
  }

  if (Number(user.otp) !== otp) {
    return {
      success: false,
      message: "Invalid OTP.",
    };
  }

  if (!user.expiresAt || user.expiresAt < new Date()) {
    return {
      success: false,
      message: "OTP has expired.",
    };
  }

  return {
    success: true,
    message: "OTP verified successfully.",
  };
};