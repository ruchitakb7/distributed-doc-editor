import { Schema, model, models, Document } from "mongoose";

export interface IOtp extends Document {
  email: string;
  otp: number;
  type: "forgot-password";
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const otpSchema = new Schema<IOtp>(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    otp: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ["forgot-password"],
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      expires: 0, // MongoDB TTL Index
    },
  },
  {
    timestamps: true,
  }
);

// Faster lookups
otpSchema.index({ email: 1, type: 1 });

const Otp = models.Otp || model<IOtp>("Otp", otpSchema);

export default Otp;