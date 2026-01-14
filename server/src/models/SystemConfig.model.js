import mongoose, { Schema } from "mongoose";

const systemConfigSchema = new Schema(
  {
    _id: {
      type: String,
      default: "GLOBAL",
    },
    lastAssignedJerseyNumber: {
      type: Number,
      required: true,
    },
    freeJerseyNumbers: {
      type: [Number],
      required: true,
      default: [],
    },
    areCertificatesLocked: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const SystemConfig = mongoose.model("SystemConfig", systemConfigSchema);
