import { Event } from "../models/Events.model.js";
import { SystemConfig } from "../models/SystemConfig.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/User.model.js";
import mongoose from "mongoose";
import { generateCertificatePDF } from "../utils/certificate.utils.js";

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
        $set: {
          isEventsLocked: true,
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

export const makeSingleAsAdmin = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    throw new ApiError(400, "User ID is required");
  }

  // Attempt atomic promotion
  const updatedUser = await User.findOneAndUpdate(
    {
      _id: userId,
      role: "Student",
      isUserDetailsComplete: "true",
    },
    { $set: { role: "Admin" } },
    { new: true }
  ).select("_id role");

  if (updatedUser) {
    return res
      .status(200)
      .json(new ApiResponse(null, "Student promoted to Admin successfully"));
  }

  // Fallback check ONLY if update failed
  const existingUser = await User.findById(userId).select("role");

  if (!existingUser) {
    throw new ApiError(404, "User not found");
  }

  if (existingUser.role === "Admin") {
    throw new ApiError(409, "User is already an Admin");
  }

  throw new ApiError(403, "Only eligible students can be promoted to Admin");
});

export const makeMultipleAsAdmin = asyncHandler(async (req, res) => {
  const { jerseyNumbers } = req.body;

  if (!Array.isArray(jerseyNumbers) || jerseyNumbers.length === 0) {
    throw new ApiError(400, "Jersey numbers array is required");
  }

  // Fetch relevant users once
  const users = await User.find({
    jerseyNumber: { $in: jerseyNumbers },
  }).select("_id jerseyNumber role isUserDetailsComplete");

  if (!users.length) {
    throw new ApiError(404, "No users found for given jersey numbers");
  }

  // Split users by state
  const alreadyAdmins = users
    .filter((u) => u.role === "Admin")
    .map((u) => u.jerseyNumber);

  const eligibleStudents = users
    .filter((u) => u.role === "Student" && u.isUserDetailsComplete === "true")
    .map((u) => u._id);

  // Promote only eligible students
  let modifiedCount = 0;

  if (eligibleStudents.length > 0) {
    const updateResult = await User.updateMany(
      { _id: { $in: eligibleStudents } },
      { $set: { role: "Admin" } }
    );

    modifiedCount = updateResult.modifiedCount;
  }

  return res.status(200).json(
    new ApiResponse(
      {
        totalRequested: jerseyNumbers.length,
        promotedCount: modifiedCount,
        alreadyAdminCount: alreadyAdmins.length,
        alreadyAdmins, // send jersey numbers
      },
      `${modifiedCount} promoted to Admin, ${alreadyAdmins.length} already Admin`
    )
  );
});

export const removeSingleAsAdmin = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    throw new ApiError(400, "User ID is required");
  }

  const updatedUser = await User.findOneAndUpdate(
    {
      _id: userId,
      role: "Admin",
      isUserDetailsComplete: "true",
    },
    { $set: { role: "Student" } },
    { new: true }
  ).select("_id role");

  if (updatedUser) {
    return res
      .status(200)
      .json(new ApiResponse(null, "Admin demoted to Student successfully"));
  }

  // Fallback check ONLY if update failed
  const existingUser = await User.findById(userId).select("role");

  if (!existingUser) {
    throw new ApiError(404, "User not found");
  }

  if (existingUser.role === "Student") {
    throw new ApiError(409, "User is already a Student");
  }

  throw new ApiError(403, "Only Admin can be demoted to Student");
});

export const removeMultipleAsAdmin = asyncHandler(async (req, res) => {
  const { jerseyNumbers } = req.body;

  if (!Array.isArray(jerseyNumbers) || jerseyNumbers.length === 0) {
    throw new ApiError(400, "Jersey numbers array is required");
  }

  // Fetch users once
  const users = await User.find({
    jerseyNumber: { $in: jerseyNumbers },
  }).select("_id jerseyNumber role");

  if (!users.length) {
    throw new ApiError(404, "No users found for given jersey numbers");
  }

  // Split users by role state
  const alreadyStudents = users
    .filter((u) => u.role === "Student")
    .map((u) => u.jerseyNumber);

  const eligibleAdmins = users
    .filter((u) => u.role === "Admin")
    .map((u) => u._id);

  // Demote only eligible admins
  let modifiedCount = 0;

  if (eligibleAdmins.length > 0) {
    const updateResult = await User.updateMany(
      { _id: { $in: eligibleAdmins } },
      { $set: { role: "Student" } }
    );

    modifiedCount = updateResult.modifiedCount;
  }

  return res.status(200).json(
    new ApiResponse(
      {
        totalRequested: jerseyNumbers.length,
        demotedCount: modifiedCount,
        alreadyStudentCount: alreadyStudents.length,
        alreadyStudents, // jersey numbers list
      },
      `${modifiedCount} demoted to Student, ${alreadyStudents.length} already Student`
    )
  );
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
    const result = await User.updateMany(
      { isUserDetailsComplete: "false" }, // only false users
      { $set: { isUserDetailsComplete: "partial" } }
    );

    return res.status(200).json(
      new ApiResponse(
        {
          matchedCount: result.matchedCount,
          modifiedCount: result.modifiedCount,
        },
        "Only users with 'false' status marked as partial successfully"
      )
    );
  }
);

// just for testing in postman
export const showEventsStatus = asyncHandler(async (req, res) => {
  const events = await Event.find({})
    .select("_id name category studentsCount")
    .lean();
  let i = 1;
  const formattedData = events.map(
    (event) =>
      `${i++}. name: ${event.name},category: ${event.category}, { present: ${event.studentsCount.present}, absent: ${event.studentsCount.absent}, notMarked: ${event.studentsCount.notMarked} }`
  );

  return res
    .status(200)
    .json(new ApiResponse(formattedData, "Events status fetched successfully"));
});

export const previewCertificate = asyncHandler(async (req, res) => {
  const user = req.user;
  const { eventId, type } = req.params;

  if (!user) {
    throw new ApiError(401, "Not authenticated");
  }

  if (user.role !== "Manager") {
    throw new ApiError(403, "Access denied. Manager role required.");
  }

  /* ---------- GET STUDENT ENROLLMENT ---------- */
  // Note: For preview, we often want to preview for ANY student or the current manager's view.
  // The system uses student-specific logic.
  // If the manager is previewing their own (if they participated) or we just use their profile.
  // Actually, the user's frontend passes the certificate object.
  // Let's just use the current user (Manager) for the preview data to show the layout.

  const student = await User.findById(user._id).lean();
  if (!student) throw new ApiError(404, "User not found");

  /* ---------- FETCH EVENT DETAILS ---------- */
  const event = await Event.findById(eventId).lean();
  if (!event) throw new ApiError(404, "Event not found");

  const userEvent = student.selectedEvents?.find(
    (e) => e.eventId?.toString() === eventId
  ) || {
    eventName: event.name,
    position: type === "winner" ? 1 : 0,
    status: "present",
  };

  // Ensure eventName is always the actual one from DB
  userEvent.eventName = event.name;

  const { pdfBytes } = await generateCertificatePDF({
    user: student,
    userEvent,
    type,
  });

  res.setHeader("Content-Type", "application/pdf");
  res.send(Buffer.from(pdfBytes));
});

export const getAnalytics = asyncHandler(async (req, res) => {
  const user = req.user;

  if (!user) {
    throw new ApiError(401, "Not authenticated");
  }

  if (user.role !== "Manager") {
    throw new ApiError(403, "Access denied. Manager role required.");
  }

  // Run aggregations in parallel for better performance
  const [userStats, eventStats, config] = await Promise.all([
    // 1. User Statistics
    User.aggregate([
      {
        $facet: {
          total: [{ $count: "count" }],
          byRole: [
            { $group: { _id: "$role", count: { $sum: 1 } } },
            { $sort: { _id: 1 } },
          ],
          byGender: [
            { $match: { gender: { $exists: true, $ne: null } } },
            { $group: { _id: "$gender", count: { $sum: 1 } } },
          ],
          byCourse: [
            { $match: { course: { $exists: true, $ne: null } } },
            { $group: { _id: "$course", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
          ],
          byYear: [
            { $match: { year: { $exists: true, $ne: null } } },
            { $group: { _id: "$year", count: { $sum: 1 } } },
            { $sort: { _id: 1 } },
          ],
          detailsComplete: [
            { $group: { _id: "$isUserDetailsComplete", count: { $sum: 1 } } },
          ],
          totalEnrollments: [
            { $unwind: "$selectedEvents" },
            { $count: "count" },
          ],
          attendanceBreakdown: [
            { $unwind: "$selectedEvents" },
            { $group: { _id: "$selectedEvents.status", count: { $sum: 1 } } },
          ],
          positionBreakdown: [
            { $unwind: "$selectedEvents" },
            { $match: { "selectedEvents.position": { $gt: 0 } } },
            { $group: { _id: "$selectedEvents.position", count: { $sum: 1 } } },
            { $sort: { _id: 1 } },
          ],
        },
      },
    ]),

    // 2. Event Statistics
    Event.aggregate([
      {
        $facet: {
          total: [{ $count: "count" }],
          byType: [
            { $group: { _id: "$type", count: { $sum: 1 } } },
            { $sort: { _id: 1 } },
          ],
          byCategory: [{ $group: { _id: "$category", count: { $sum: 1 } } }],
          byDay: [
            { $group: { _id: "$day", count: { $sum: 1 } } },
            { $sort: { _id: 1 } },
          ],
          activeStatus: [{ $group: { _id: "$isActive", count: { $sum: 1 } } }],
          attendanceTotals: [
            {
              $group: {
                _id: null,
                totalPresent: { $sum: "$studentsCount.present" },
                totalAbsent: { $sum: "$studentsCount.absent" },
                totalNotMarked: { $sum: "$studentsCount.notMarked" },
              },
            },
          ],
          eventWiseAttendance: [
            {
              $project: {
                _id: 1,
                name: 1,
                category: 1,
                present: "$studentsCount.present",
                absent: "$studentsCount.absent",
                notMarked: "$studentsCount.notMarked",
              },
            },
            { $sort: { name: 1 } },
          ],
        },
      },
    ]),

    // 3. Certificate Status
    SystemConfig.findById("GLOBAL").lean(),
  ]);

  return res.status(200).json(
    new ApiResponse(
      {
        users: userStats[0],
        events: eventStats[0],
        certificatesLocked: config?.areCertificatesLocked ?? true,
      },
      "Analytics fetched successfully"
    )
  );
});
