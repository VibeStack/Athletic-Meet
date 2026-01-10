import mongoose, { Schema } from "mongoose";

const jerseyCounterSchema = new Schema(
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
  },
  {
    timestamps: true,
  }
);

export const JerseyCounter = mongoose.model(
  "Jerseycounter",
  jerseyCounterSchema
);
