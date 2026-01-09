import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    eventname: {
      type: String,
      required: true,
      trim: true,
    },
    eventType: {
      type: String,
      enum: ["Field", "Team Events", "Track"],
      required: true,
    },
    eventDay: {
      type: String,
      enum: ["Day 1", "Day 2", "Both"],
      require: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    enrolledStudentsStatus: {
      present: {
        type: Number,
        default: 0,
        min: 0,
      },
      absent: {
        type: Number,
        default: 0,
        min: 0,
      },
      notMarked: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
  },
  {
    strict: "throw",
  }
);

export const Event = mongoose.model("Event", eventSchema);
