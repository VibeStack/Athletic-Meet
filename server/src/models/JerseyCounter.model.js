import mongoose, { Schema } from "mongoose";

const jerseyCounterSchema = new Schema(
  {
    lastAssignedJerseyNumber: {
      type: Number,
      required: true,
    },
    freeJerseyNumbers: {
      type: [Number],
      required: true,
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
