import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/User.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Event } from "../models/Events.model.js";
import { Session } from "../models/Session.model.js";
import { JerseyCounter } from "../models/JerseyCounter.model.js";

const getNextJerseyNumber = async (session) => {
  const counter = await JerseyCounter.findOne(
    { _id: "GLOBAL" },
    { freeJerseyNumbers: { $slice: 1 } }
  ).session(session);

  if (counter?.freeJerseyNumbers?.length > 0) {
    const reused = counter.freeJerseyNumbers[0];

    await JerseyCounter.updateOne(
      { _id: "GLOBAL" },
      { $pull: { freeJerseyNumbers: reused } },
      { session }
    );

    return reused;
  }

  const updated = await JerseyCounter.findOneAndUpdate(
    { _id: "GLOBAL" },
    { $inc: { lastAssignedJerseyNumber: 1 } },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
      session,
    }
  );

  return updated.lastAssignedJerseyNumber;
};

import mongoose from "mongoose";

export const registerUser = asyncHandler(async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      username,
      email,
      fullname,
      gender,
      course,
      branch,
      crn,
      urn,
      year,
      phone,
    } = req.body;

    const user = await User.findOne({ $or: [{ email }, { username }] }).session(
      session
    );

    if (!user) {
      throw new ApiError(400, "Invalid registration attempt");
    }

    if (user.isUserDetailsComplete === "false") {
      throw new ApiError(403, "Please verify OTP first");
    }

    if (user.isUserDetailsComplete === "true") {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(200)
        .json(new ApiResponse(null, "Account already exists"));
    }

    user.fullname = fullname;
    user.gender = gender;
    user.course = course;
    user.branch = branch;
    user.crn = crn;
    user.urn = urn;
    user.year = year;
    user.phone = phone;

    user.jerseyNumber = await getNextJerseyNumber(session);

    user.isUserDetailsComplete = "true";

    await user.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res
      .status(200)
      .json(new ApiResponse(null, "Registration completed successfully"));
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, "Not authenticated");
  }

  const user = req.user;

  const userResponse = {
    id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,

    fullname: user.fullname,
    gender: user.gender,
    course: user.course,
    branch: user.branch,
    crn: user.crn,
    urn: user.urn,
    phone: user.phone,
    year: user.year,

    jerseyNumber: user.jerseyNumber,

    selectedEvents: user.selectedEvents,

    createdAt: user.createdAt, // optional
  };

  return res
    .status(200)
    .json(new ApiResponse(userResponse, "User fetched successfully"));
});


export const getEvents = asyncHandler(async (req, res) => {
  const events = await Event.find({ isActive: true });
  res.status(200).json(new ApiResponse(events, "Events fetched successfully"));
});

export const lockEvents = asyncHandler(async (req, res) => {
  const { sid } = req.signedCookies;
  const { events } = req.body;

  const session = await Session.findById(sid);
  const user = await User.findById(session.userId);
  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  user.selectedEvents.push(...events);
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(null, "Events locked successfully"));
});

