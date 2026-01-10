import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [3, "Username must be at least 3 characters long"],
      maxlength: [20, "Username cannot exceed 20 characters"],
      match: /^[a-zA-Z0-9_]+$/,
    },
    email: {
      type: String,
      required: [true, "College email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      // match: [
      //   /^[a-zA-Z0-9._%+-]+@gndec\.ac\.in$/,
      //   "Valid college email must end with @gndec.ac.in",
      // ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
    },
    fullname: {
      type: String,
      trim: true,
      minlength: [3, "Full name must be at least 3 characters long"],
      maxlength: [50, "Full name cannot exceed 50 characters"],
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },
    course: {
      type: String,
      enum: [
        "B.Tech",
        "M.Tech",
        "MBA",
        "MCA",
        "B.Voc.",
        "B.Com",
        "BBA",
        "BCA",
        "B.Arch",
      ],
    },
    branch: {
      type: String,
      trim: true,
    },
    crn: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },
    urn: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },
    year: {
      type: String,
      enum: ["1st Year", "2nd Year", "3rd Year", "4th Year"],
    },
    phone: {
      type: String,
      trim: true,
      match: [/^[6-9]\d{9}$/, "Enter a valid 10-digit phone number"],
    },
    jerseyNumber: {
      type: Number,
      unique: true,
      min: [1, "Jersey number must be at least 1"],
      max: [1000, "Jersey number cannot exceed 1000"],
    },
    isUserDetailsComplete: {
      type: String,
      enum: ["false", "partial", "true"],
      default: "false",
    },
    role: {
      type: String,
      enum: ["Student", "Admin", "Manager"],
      default: "Student",
    },
    selectedEvents: {
      type: [
        {
          _id: false,
          eventId: {
            type: Schema.Types.ObjectId,
            ref: "Event",
            required: true,
          },
          status: {
            type: String,
            enum: ["Present", "Absent", "Not Marked"],
            default: "Not Marked",
          },
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
    strict: "throw",
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (userPassword) {
  return await bcrypt.compare(userPassword, this.password);
};

export const User = mongoose.model("User", userSchema);
