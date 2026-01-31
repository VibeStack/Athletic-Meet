import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/User.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Event } from "../models/Events.model.js";
import { SystemConfig } from "../models/SystemConfig.model.js";
import mongoose from "mongoose";

export const userGenderIsToEventCategory = function (gender) {
  if (gender === "Male") {
    return "Boys";
  }
  if (gender === "Female") {
    return "Girls";
  }
};

export const registerUser = asyncHandler(async (req, res) => {
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

  // 1️⃣ Find user
  const normalizedUsername = username?.toLowerCase().trim();
  const normalizedEmail = email?.toLowerCase().trim();

  const user = await User.findOne({
    $or: [{ email: normalizedEmail }, { username: normalizedUsername }],
  });

  if (!user) {
    throw new ApiError(404, "User not found. Please signup first.");
  }

  if (user.isUserDetailsComplete === "false") {
    throw new ApiError(403, "Please verify OTP first");
  }

  if (user.isUserDetailsComplete === "true") {
    return res
      .status(200)
      .json(new ApiResponse(null, "Account already exists"));
  }

  if (user.isUserDetailsComplete !== "partial") {
    throw new ApiError(400, "Invalid registration state");
  }

  if (user.jerseyNumber != null) {
    throw new ApiError(409, "User already has a jersey number");
  }

  let jerseyNumber = null;

  // 2️⃣ TRY REUSE JERSEY (SAFE READ)
  const config = await SystemConfig.findOne({ _id: "GLOBAL" }).lean();

  if (config?.freeJerseyNumbers?.length > 0) {
    const smallest = [...config.freeJerseyNumbers].sort((a, b) => a - b)[0];

    // Atomic remove that jersey
    const popResult = await SystemConfig.updateOne(
      { _id: "GLOBAL", freeJerseyNumbers: smallest },
      { $pull: { freeJerseyNumbers: smallest } }
    );

    if (popResult.modifiedCount === 1) {
      jerseyNumber = smallest;
    }
  }

  // 3️⃣ FALLBACK: AUTO INCREMENT IF NO FREE JERSEY
  if (!jerseyNumber) {
    const incremented = await SystemConfig.findOneAndUpdate(
      { _id: "GLOBAL" },
      {
        $inc: { lastAssignedJerseyNumber: 1 },
        $setOnInsert: { freeJerseyNumbers: [], areCertificatesLocked: true },
      },
      { upsert: true, new: true }
    );

    jerseyNumber = incremented.lastAssignedJerseyNumber;
  }

  // 4️⃣ ATOMIC USER UPDATE (BLOCKS DOUBLE ASSIGNMENT)
  const updatedUser = await User.findOneAndUpdate(
    {
      email: normalizedEmail,
      isUserDetailsComplete: "partial",
      $or: [{ jerseyNumber: { $exists: false } }, { jerseyNumber: null }],
    },
    {
      $set: {
        fullname,
        gender,
        course,
        branch,
        crn,
        urn,
        year,
        phone,
        jerseyNumber,
        isUserDetailsComplete: "true",
      },
    },
    { new: true }
  );

  // 5️⃣ ROLLBACK IF USER UPDATE FAILED
  if (!updatedUser) {
    // Put jersey back if user update failed
    await SystemConfig.updateOne(
      { _id: "GLOBAL" },
      { $addToSet: { freeJerseyNumbers: jerseyNumber } }
    );

    throw new ApiError(
      409,
      "User already completed registration or concurrency conflict"
    );
  }

  return res
    .status(200)
    .json(
      new ApiResponse({ jerseyNumber }, "Registration completed successfully")
    );
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

    createdAt: user.createdAt,
  };

  return res
    .status(200)
    .json(new ApiResponse(userResponse, "User fetched successfully"));
});

export const getEvents = asyncHandler(async (req, res) => {
  // Return ALL events with isActive status (not just active ones)
  // This allows frontend to show enrolled events even if they're deactivated
  const events = await Event.find({}).select(
    "_id name type category day isActive studentsCount"
  );

  const formattedEvents = events.map((event) => ({
    id: event._id,
    name: event.name,
    type: event.type,
    category: event.category,
    day: event.day,
    isActive: event.isActive,
    studentsCount: event.studentsCount || {
      present: 0,
      absent: 0,
      notMarked: 0,
    },
  }));

  res
    .status(200)
    .json(new ApiResponse(formattedEvents, "Events fetched successfully"));
});

export const lockEvents = asyncHandler(async (req, res) => {
  const user = req.user;
  const { events: userSelectedEventsIdArray } = req.body;

  if (
    !Array.isArray(userSelectedEventsIdArray) ||
    userSelectedEventsIdArray.length === 0
  ) {
    throw new ApiError(400, "Events must be a non-empty array");
  }

  if (userSelectedEventsIdArray.length > 3) {
    throw new ApiError(400, "Maximum 3 events can be selected");
  }

  const eventObjectIds = userSelectedEventsIdArray.map(
    (id) => new mongoose.Types.ObjectId(id)
  );

  // Step 1: Validate events (read-only, safe under concurrency)
  const validEvents = await Event.find({
    _id: { $in: eventObjectIds },
    category: userGenderIsToEventCategory(user.gender),
    isActive: true,
  });

  if (validEvents.length !== eventObjectIds.length) {
    throw new ApiError(
      400,
      "One or more events are invalid (Gender mismatch or inactive)"
    );
  }

  const userEventsToBeLocked = eventObjectIds.map((eventId) => ({
    eventId,
    position: 0,
    status: "notMarked",
  }));

  // Step 2: Atomically lock user (ONLY if not already locked)
  const userUpdate = await User.updateOne(
    { _id: user._id, isEventsLocked: false },
    {
      $set: {
        selectedEvents: userEventsToBeLocked,
        isEventsLocked: true,
      },
    }
  );

  if (!userUpdate.modifiedCount) {
    throw new ApiError(409, "Events already locked. Contact admin to unlock.");
  }

  // Step 3: Increment event counters
  const eventUpdate = await Event.updateMany(
    { _id: { $in: eventObjectIds } },
    {
      $inc: {
        "studentsCount.notMarked": 1,
      },
    }
  );

  // Safety rollback (extremely rare, but needed)
  if (eventUpdate.modifiedCount !== eventObjectIds.length) {
    await User.updateOne(
      { _id: user._id, isEventsLocked: true },
      {
        $set: {
          selectedEvents: [],
          isEventsLocked: false,
        },
      }
    );

    throw new ApiError(409, "Event counter update conflict");
  }

  const returningEventsData = validEvents.map((e) => ({
    eventId: e._id,
    eventName: e.name,
    eventDay: e.day,
    eventType: e.type,
    isEventActive: e.isActive,
    userEventAttendance: "notMarked",
    position: 0,
  }));

  return res
    .status(200)
    .json(new ApiResponse(returningEventsData, "Events locked successfully"));
});

export const getCertificates = asyncHandler(async (req, res) => {
  const user = req.user;

  if (!user) {
    throw new ApiError(401, "Not authenticated");
  }

  // Get global certificate lock status
  let config = await SystemConfig.findById("GLOBAL");
  const areCertificatesLocked = config?.areCertificatesLocked ?? true;

  // If locked, just return the status
  if (areCertificatesLocked) {
    return res.status(200).json(
      new ApiResponse(
        {
          areCertificatesLocked: true,
          certificates: [],
        },
        "Certificates are currently locked"
      )
    );
  }

  // Get user with populated events
  const userWithEvents = await User.findById(user._id)
    .populate({
      path: "selectedEvents.eventId",
      select: "name type category day",
    })
    .lean();

  if (!userWithEvents) {
    throw new ApiError(404, "User not found");
  }

  // Only include events where student is marked as present
  const presentEvents = (userWithEvents.selectedEvents || []).filter(
    (event) => event.status === "present"
  );

  // Format certificates from present events only
  const certificates = presentEvents.map((event) => ({
    eventId: event.eventId?._id,
    eventName: event.eventId?.name || null,
    eventType: event.eventId?.type || null,
    eventDay: event.eventId?.day || null,
    status: event.status,
    // Position from event results (if applicable)
    // For now, assuming participation. Winner logic can be added later.
    position: event.position || 0, // 1, 2, 3 for winners or null for participation
    certificateType: event.position === 0 ? "Participation" : "Winner", // "Winner" if position is 1,2,3
  }));

  return res.status(200).json(
    new ApiResponse(
      {
        areCertificatesLocked: false,
        certificates,
      },
      "Certificates fetched successfully"
    )
  );
});
