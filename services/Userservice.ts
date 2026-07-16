

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { sendOtpService } from "./Otpservice";
import { EMAIL_ACTION } from "@/constant/emailAction";

interface RegisterUserData {
  name: string;
  email: string;
  password: string;
}

interface LoginUserData {
  email: string;
  password: string;
}

interface SendOtpParams {
  email: string;
  type: "forgot-password";
}

interface ResetPasswordPayload {
  email: string;
  password: string;
}

export const registerUser = async ({
  name,
  email,
  password,
}: RegisterUserData) => {
  
  if (!name || !email || !password) {
    throw new Error("All fields are required.");
  }

  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters.");
  }

  await connectDB();

  const existingUser = await User.findOne({
    email: email.toLowerCase(),
  });

  if (existingUser) {
    throw new Error("User already exists.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
  });

  return {
    success: true,
    message: "User registered successfully.",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  };
};

export const loginUser = async ({ email, password }: LoginUserData) => {
  if (!email || !password) {
    throw new Error("Email and password are required.");
  }

  await connectDB();

  const user = await User.findOne({
    email: email.toLowerCase(),
  });

  if (!user) {
    throw new Error("Invalid email or password.");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid email or password.");
  }

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not defined.");
  }

  const token = jwt.sign(
    {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
    },
    secret,
    { expiresIn: "7d" }
  );

  return {
    success: true,
    message: "Login successful.",
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  };
};



export const sendOtp = async ({
  email,
  type,
}: SendOtpParams) => {
  const user = await User.findOne({
    email: email.trim()
  });

  if (!user) {
    throw {
      status: 404,
      message: "No user found with this email.",
    };
  }

  await sendOtpService({
    email: user.email,
    userName: user.name,
    type,
    action: EMAIL_ACTION.FORGOT_PASSWORD,
  });

  return {
    success: true,
    message: "OTP sent successfully.",
  };
};




export const resetPasswordService = async ({
  email,
  password,
}: ResetPasswordPayload) => {
  const user = await User.findOne({
    email: email.trim().toLowerCase(),
  });

  if (!user) {
    return {
      success: false,
      message: "No user found with this email.",
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  user.password = hashedPassword;

  await user.save();

  return {
    success: true,
    message: "Password reset successfully.",
  };
};