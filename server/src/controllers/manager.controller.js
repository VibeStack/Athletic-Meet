import { Event } from "../models/Events.model.js";
import { SystemConfig } from "../models/SystemConfig.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/User.model.js";
import mongoose from "mongoose";

export const getAllEvents = asyncHandler(async (req, res) => {
  const user = req.user;

  if (!user) {
    throw new ApiError(401, "Not authenticated");
  }

  if (user.role !== "Manager") {
    throw new ApiError(403, "Access denied. Manager role required.");
  }

  const allEvents = await Event.find(
    {},
    {
      _id: 1,
      name: 1,
      type: 1,
      category: 1,
      day: 1,
      isActive: 1,
    }
  ).lean();

  const formattedEvents = allEvents.map((event) => ({
    id: event._id,
    name: event.name,
    type: event.type,
    category: event.category,
    day: event.day,
    isActive: event.isActive,
  }));

  return res.status(200).json(
    new ApiResponse(
      {
        eventsCount: formattedEvents.length,
        events: formattedEvents,
      },
      "All events fetched successfully"
    )
  );
});

export const bulkAddEvents = asyncHandler(async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const { jerseyNumbers: jerseyNumbersArray, eventId } = req.body;

    if (!Array.isArray(jerseyNumbersArray)) {
      throw new ApiError(400, "Jersey numbers must be an array");
    }

    if (jerseyNumbersArray.length === 0) {
      throw new ApiError(400, "No jersey numbers provided");
    }

    // Remove duplicates
    const uniqueJerseys = [...new Set(jerseyNumbersArray)];

    const selectedEventId = new mongoose.Types.ObjectId(eventId);

    // Fetch event
    const selectedEventObject =
      await Event.findById(selectedEventId).session(session);
    if (!selectedEventObject) {
      throw new ApiError(404, "Event not found");
    }

    // Normalize gender
    const category = selectedEventObject.category?.toLowerCase();

    const selectedEventObjectValidGender = category?.includes("girl")
      ? "Female"
      : category?.includes("boy")
        ? "Male"
        : selectedEventObject.category;

    // Fetch matching users
    const users = await User.find(
      {
        jerseyNumber: { $in: uniqueJerseys },
        gender: selectedEventObjectValidGender,
      },
      { jerseyNumber: 1, selectedEvents: 1 }
    ).session(session);

    // No users found
    if (users.length === 0) {
      throw new ApiError(
        404,
        "No matching users found for given jersey numbers"
      );
    }

    // Missing or gender mismatch
    if (users.length !== uniqueJerseys.length) {
      const foundJerseys = users.map((u) => u.jerseyNumber);

      const missingJerseys = uniqueJerseys.filter(
        (j) => !foundJerseys.includes(j)
      );

      throw new ApiError(
        400,
        `Some jersey numbers are invalid — either they do not exist or their gender does not match the event (${selectedEventObjectValidGender})`,
        missingJerseys
      );
    }

    // Already enrolled
    const usersAlreadyHavingEvent = users.filter((u) =>
      u.selectedEvents?.some(
        (ev) => ev.eventId?.toString() === selectedEventId.toString()
      )
    );

    if (usersAlreadyHavingEvent.length > 0) {
      throw new ApiError(
        400,
        "Some users are already enrolled in this event",
        usersAlreadyHavingEvent.map((u) => u.jerseyNumber)
      );
    }

    // Max event limit
    const usersReachedMaximumEventEnrollCount = users.filter(
      (u) => (u.selectedEvents?.length || 0) >= 5
    );

    if (usersReachedMaximumEventEnrollCount.length > 0) {
      throw new ApiError(
        400,
        "Some users reached maximum event limit (5)",
        usersReachedMaximumEventEnrollCount.map((u) => u.jerseyNumber)
      );
    }

    // Update only valid users
    const updateResult = await User.updateMany(
      { jerseyNumber: { $in: users.map((u) => u.jerseyNumber) } },
      {
        $addToSet: {
          selectedEvents: {
            eventId: selectedEventId,
            status: "notMarked",
            position: 0,
          },
        },
      },
      { session }
    );

    if (updateResult.modifiedCount !== users.length) {
      throw new ApiError(500, "Unexpected update mismatch — aborting");
    }

    // Update event counter
    await Event.updateOne(
      { _id: selectedEventId },
      { $inc: { "studentsCount.notMarked": updateResult.modifiedCount } },
      { session }
    );

    await session.commitTransaction();

    return res.status(200).json(
      new ApiResponse(
        {
          totalRequested: uniqueJerseys.length,
          updatedUsers: updateResult.modifiedCount,
        },
        `Event added successfully to ${updateResult.modifiedCount} participant(s)`
      )
    );
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find()
    .select("fullname course branch year jerseyNumber urn selectedEvents")
    .lean();

  return res.status(200).json(
    new ApiResponse(
      {
        count: users.length,
        users,
      },
      "All users fetched successfully"
    )
  );
});

export const makeAsAdmin = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    throw {
      code: 400,
      message: "User ID is required",
    };
  }

  const updatedUser = await User.findOneAndUpdate(
    { _id: userId, role: "Student", isUserDetailsComplete: "true" },
    { $set: { role: "Admin" } },
    { new: true, runValidators: true }
  );

  if (!updatedUser) {
    const existingUser = await User.findById(userId).select("role");

    if (!existingUser) {
      throw {
        code: 404,
        message: "User not found",
      };
    }

    if (existingUser.role === "Admin") {
      throw {
        code: 409,
        message: "User is already an Admin",
      };
    }

    throw {
      code: 403,
      message: "Only students can be promoted to Admin",
    };
  }

  res
    .status(200)
    .json(new ApiResponse(null, "Student promoted to Admin successfully"));
});

export const removeAsAdmin = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    throw {
      code: 400,
      message: "User ID is required",
    };
  }

  const updatedUser = await User.findOneAndUpdate(
    { _id: userId, role: "Admin", isUserDetailsComplete: "true" },
    { $set: { role: "Student" } },
    { new: true, runValidators: true }
  );

  if (!updatedUser) {
    const existingUser = await User.findById(userId).select("role");

    if (!existingUser) {
      throw {
        code: 404,
        message: "User not found",
      };
    }

    if (existingUser.role === "Student") {
      throw {
        code: 409,
        message: "User is already a Student",
      };
    }

    throw {
      code: 403,
      message: "Only Admin can be demoted to Student",
    };
  }

  res
    .status(200)
    .json(new ApiResponse(null, "Admin demoted to Student successfully"));
});

export const toggleEvent = asyncHandler(async (req, res) => {
  const user = req.user;
  const { eventId } = req.body;

  if (!user) {
    throw new ApiError(401, "Not authenticated");
  }

  if (user.role !== "Manager") {
    throw new ApiError(403, "Access denied. Manager role required.");
  }

  if (!eventId) {
    throw new ApiError(400, "eventId is required");
  }

  const event = await Event.findById(eventId);

  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  // Toggle the isActive status
  event.isActive = !event.isActive;
  await event.save();

  return res.status(200).json(
    new ApiResponse(
      {
        id: event._id,
        name: event.name,
        isActive: event.isActive,
      },
      `Event ${event.isActive ? "activated" : "deactivated"} successfully`
    )
  );
});

export const activateEvents = asyncHandler(async (req, res) => {
  const user = req.user;
  const { eventIds } = req.body;

  if (!user) {
    throw new ApiError(401, "Not authenticated");
  }

  if (user.role !== "Manager") {
    throw new ApiError(403, "Access denied. Manager role required.");
  }

  if (!eventIds || !Array.isArray(eventIds) || eventIds.length === 0) {
    throw new ApiError(400, "eventIds array is required");
  }

  const result = await Event.updateMany(
    { _id: { $in: eventIds } },
    { $set: { isActive: true } }
  );

  return res.status(200).json(
    new ApiResponse(
      {
        modifiedCount: result.modifiedCount,
        matchedCount: result.matchedCount,
      },
      `${result.modifiedCount} event(s) activated successfully`
    )
  );
});

export const deactivateEvents = asyncHandler(async (req, res) => {
  const user = req.user;
  const { eventIds } = req.body;

  if (!user) {
    throw new ApiError(401, "Not authenticated");
  }

  if (user.role !== "Manager") {
    throw new ApiError(403, "Access denied. Manager role required.");
  }

  if (!eventIds || !Array.isArray(eventIds) || eventIds.length === 0) {
    throw new ApiError(400, "eventIds array is required");
  }

  const result = await Event.updateMany(
    { _id: { $in: eventIds } },
    { $set: { isActive: false } }
  );

  return res.status(200).json(
    new ApiResponse(
      {
        modifiedCount: result.modifiedCount,
        matchedCount: result.matchedCount,
      },
      `${result.modifiedCount} event(s) deactivated successfully`
    )
  );
});

export const getCertificateStatus = asyncHandler(async (req, res) => {
  const user = req.user;

  if (!user) {
    throw new ApiError(401, "Not authenticated");
  }

  if (user.role !== "Manager") {
    throw new ApiError(403, "Access denied. Manager role required.");
  }

  let config = await SystemConfig.findById("GLOBAL");

  if (!config) {
    // Create default config if doesn't exist
    config = await SystemConfig.create({
      _id: "GLOBAL",
      lastAssignedJerseyNumber: 0,
      freeJerseyNumbers: [],
      areCertificatesLocked: true,
    });
  }

  return res.status(200).json(
    new ApiResponse(
      {
        areCertificatesLocked: config.areCertificatesLocked,
      },
      "Certificate status fetched successfully"
    )
  );
});

export const lockCertificates = asyncHandler(async (req, res) => {
  const user = req.user;

  if (!user) {
    throw new ApiError(401, "Not authenticated");
  }

  if (user.role !== "Manager") {
    throw new ApiError(403, "Access denied. Manager role required.");
  }

  await SystemConfig.findByIdAndUpdate(
    "GLOBAL",
    { areCertificatesLocked: true },
    { upsert: true }
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        { areCertificatesLocked: true },
        "Certificates locked successfully"
      )
    );
});

export const unlockCertificates = asyncHandler(async (req, res) => {
  const user = req.user;

  if (!user) {
    throw new ApiError(401, "Not authenticated");
  }

  if (user.role !== "Manager") {
    throw new ApiError(403, "Access denied. Manager role required.");
  }

  await SystemConfig.findByIdAndUpdate(
    "GLOBAL",
    { areCertificatesLocked: false },
    { upsert: true }
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        { areCertificatesLocked: false },
        "Certificates unlocked successfully"
      )
    );
});

export const markingResults = asyncHandler(async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const { eventId, jerseyNumbers: jerseyNumbersArray, position } = req.body;

    if (!Array.isArray(jerseyNumbersArray)) {
      throw new ApiError(400, "Jersey numbers must be an array");
    }

    if (jerseyNumbersArray.length === 0) {
      throw new ApiError(400, "No jersey numbers provided");
    }

    // Remove duplicates
    const uniqueJerseys = [...new Set(jerseyNumbersArray)];

    const selectedEventId = new mongoose.Types.ObjectId(eventId);

    // Fetch event
    const selectedEventObject =
      await Event.findById(selectedEventId).session(session);
    if (!selectedEventObject) {
      throw new ApiError(404, "Event not found");
    }

    // Normalize gender
    const category = selectedEventObject.category?.toLowerCase();

    const selectedEventObjectValidGender = category?.includes("girl")
      ? "Female"
      : category?.includes("boy")
        ? "Male"
        : selectedEventObject.category;

    // Fetch matching users
    const users = await User.find(
      {
        jerseyNumber: { $in: uniqueJerseys },
        gender: selectedEventObjectValidGender,
      },
      { jerseyNumber: 1, selectedEvents: 1 }
    ).session(session);

    // No users found
    if (users.length === 0) {
      throw new ApiError(
        404,
        "No matching users found for given jersey numbers"
      );
    }

    // Missing or gender mismatch
    if (users.length !== uniqueJerseys.length) {
      const foundJerseys = users.map((u) => u.jerseyNumber);

      const missingJerseys = uniqueJerseys.filter(
        (j) => !foundJerseys.includes(j)
      );

      throw new ApiError(
        400,
        `Some jersey numbers are invalid — either they do not exist or their gender does not match the event (${selectedEventObjectValidGender})`,
        missingJerseys
      );
    }

    const usersNotEnrolledJerseyNumbers = users
      .filter((u) =>
        u.selectedEvents.every(
          (ev) => ev.eventId.toString() !== selectedEventId.toString()
        )
      )
      .map((u) => u.jerseyNumber);

    if (usersNotEnrolledJerseyNumbers.length > 0) {
      throw new ApiError(
        400,
        "Some users are NOT enrolled in this event",
        usersNotEnrolledJerseyNumbers
      );
    }

    const usersNotPresentJerseyNumbers = users
      .filter((u) =>
        u.selectedEvents.some(
          (ev) =>
            ev.eventId.toString() === selectedEventId.toString() &&
            ev.status !== "present"
        )
      )
      .map((u) => u.jerseyNumber);

    if (usersNotPresentJerseyNumbers.length > 0) {
      throw new ApiError(
        400,
        "Some users are enrolled but NOT marked present in this event",
        usersNotPresentJerseyNumbers
      );
    }

    await User.updateMany(
      {
        jerseyNumber: { $in: uniqueJerseys },
        "selectedEvents.eventId": selectedEventId,
        "selectedEvents.status": "present",
      },
      {
        $set: {
          "selectedEvents.$.position": position,
        },
      },
      { session }
    );

    await session.commitTransaction();

    return res
      .status(200)
      .json(new ApiResponse(200, "Results updated successfully"));
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});

export const markAllDetailsCompleteAsPartial = asyncHandler(
  async (req, res) => {
    const users = await User.find({});

    for (const user of users) {
      user.isUserDetailsComplete = "partial";
      await user.save();
    }

    return res
      .status(200)
      .json(new ApiResponse(null, "Details marked as partial successfully"));
  }
);