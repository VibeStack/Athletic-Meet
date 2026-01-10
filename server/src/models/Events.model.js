import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["Field", "Team", "Track"],
      required: true,
    },

    category: {
      type: String,
      enum: ["Boys", "Girls"],
      required: true,
    },

    day: {
      type: String,
      enum: ["Day 1", "Day 2", "Both"],
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    strict: "throw",
  }
);

export const Event = mongoose.model("Event", eventSchema);
