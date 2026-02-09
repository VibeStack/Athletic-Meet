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
      default: 0,
    },
    freeJerseyNumbers: {
      type: [Number],
      required: true,
      default: [],
    },
    lastAssignedSerialNumber: {
      type: Number,
      required: true,
      default: 0,
    },
    freeSerialNumbers: {
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
