import { Event } from "../models/Events.model.js";
import { SystemConfig } from "../models/SystemConfig.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Get all events for manager
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

// Toggle single event (activate/deactivate)
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

// Activate multiple events
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

// Deactivate multiple events
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

// Get certificate lock status
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

// Lock certificates
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

// Unlock certificates
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
