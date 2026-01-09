import mongoose, { Schema } from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 1 * 24 * 60 * 60,
    },
  },
  { strict: "throw" }
);

export const Session = mongoose.model("Session", sessionSchema);
