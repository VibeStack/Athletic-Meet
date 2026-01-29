import mongoose from "mongoose";

const OtpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      index: true,
    },
    otp: {
      type: String,
      required: true,
    },

    attempts: {
      type: Number,
      default: 0,
    },

    createdAt: {
      type: Date,
      default: Date.now,
      expires: 5 * 60,
    },
  },
  {
    strict: "throw",
  }
);

export const Otp = mongoose.model("Otp", OtpSchema);
