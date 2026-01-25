import { Event } from "../models/Events.model.js";
import { SystemConfig } from "../models/SystemConfig.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/User.model.js";

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
