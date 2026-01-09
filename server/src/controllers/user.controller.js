import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/User.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Event } from "../models/Events.model.js";
import { Session } from "../models/Session.model.js";
import { JerseyCounter } from "../models/JerseyCounter.model.js";

const getNextJerseyNumber = async () => {
  let counter = await JerseyCounter.findOne();

  if (!counter) {
    console.log("Jersey counter not found. Initializing new counter...");

    try {
      counter = await JerseyCounter.create({
        lastAssignedJerseyNumber: 0,
        freeJerseyNumbers: [],
      });

      console.log("✅ Jersey counter initialized successfully");
    } catch (err) {
      console.error("❌ Failed to initialize jersey counter:", err);

      throw new ApiError(
        500,
        "Failed to initialize jersey number counter. Please try again later."
      );
    }
  }

  if (counter.freeJerseyNumbers?.length > 0) {
    const freedNumber = counter.freeJerseyNumbers[0];

    await JerseyCounter.findOneAndUpdate(
      {},
      { $pop: { freeJerseyNumbers: -1 } },
      { new: true }
    );

    return freedNumber;
  }

  const updated = await JerseyCounter.findOneAndUpdate(
    {},
    { $inc: { lastAssignedJerseyNumber: 1 } },
    { new: true }
  );

  if (!updated) {
    throw new ApiError(
      500,
      "Failed to generate a new jersey number. Please try again."
    );
  }
  return updated.lastAssignedJerseyNumber;
};

const registerUser = asyncHandler(async (req, res) => {
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

  if (!username || !email) {
    return res
      .status(400)
      .json({ message: "Username and email are required." });
  }

  const user = await User.findOne({ $or: [{ email }, { username }] });

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  if (user.isUserDetailsComplete === "false") {
    throw new ApiError(
      403,
      "Please verify OTP before completing registration."
    );
  }

  if (user.isUserDetailsComplete === "true") {
    return res
      .status(200)
      .json(
        new ApiResponse(200, null, "Account already exists. Please log in.")
      );
  }

  user.fullname = fullname;
  user.gender = gender;
  user.course = course;
  user.branch = branch;
  user.crn = crn;
  user.urn = urn;
  user.year = year;
  user.phone = phone;
  user.isUserDetailsComplete = "true";
  user.jerseyNumber = await getNextJerseyNumber();

  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Registration completed successfully."));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const user = req.user;

  if (!user) {
    return res
      .status(401)
      .json(new ApiResponse(401, null, "Not authenticated"));
  }

  const { password, ...userWithoutPassword } = user;

  return res
    .status(200)
    .json(
      new ApiResponse(200, userWithoutPassword, "User fetched successfully")
    );
});

const getEvents = asyncHandler(async (req, res) => {
  const events = await Event.find({ isActive: true });
  res
    .status(200)
    .json(new ApiResponse(200, events, "Events fetched successfully"));
});

const lockEvents = asyncHandler(async (req, res) => {
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
    .json(new ApiResponse(200, null, "Events locked successfully"));
});

export { registerUser, getCurrentUser, getEvents, lockEvents };
