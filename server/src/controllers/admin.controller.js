import { Session } from "../models/Session.model.js";
import { User } from "../models/User.model.js";
import { JerseyCounter } from "../models/JerseyCounter.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { courseBranchMap } from "../utils/courseBranchMap.js";
import { Event } from "../models/Events.model.js";
import mongoose from "mongoose";

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find(
    {},
    {
      fullname: 1,
      username: 1,
      email: 1,
      role: 1,
      jerseyNumber: 1,
      course: 1,
      year: 1,
      branch: 1,
      crn: 1,
      urn: 1,
      gender: 1,
      selectedEvents: 1,
    }
  );

  const formattedUsers = users
    .map((u) => ({
      id: u._id,
      fullname: u.fullname,
      username: u.username,
      email: u.email,
      role: u.role,
      jerseyNumber: u.jerseyNumber || null,
      year: u.year || null,
      course: u.course || null,
      branch: u.branch || null,
      crn: u.crn || null,
      urn: u.urn || null,
      gender: u.gender || null,
      eventsCount: u.selectedEvents?.length || 0,
    }))
    .filter((user) => {
      if (req.user.role === "Admin" && user.role === "Manager") {
        return false;
      }
      return true;
    });

  return res.status(200).json(
    new ApiResponse(
      {
        usersCount: formattedUsers.length,
        users: formattedUsers,
      },
      "Users fetched successfully"
    )
  );
});

export const getUserDetails = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId, {
    fullname: 1,
    username: 1,
    email: 1,
    role: 1,
    isUserDetailsComplete: 1,
    branch: 1,
    course: 1,
    crn: 1,
    gender: 1,
    jerseyNumber: 1,
    phone: 1,
    urn: 1,
    year: 1,
    isEventsLocked: 1,
    selectedEvents: 1,
    createdAt: 1,
  })
    .populate({
      path: "selectedEvents.eventId",
      select: "name type category day",
    })
    .lean();

  if (!user) {
    return res.status(404).json(new ApiResponse(404, null, "User not found"));
  }

  if (req.user.role === "Admin" && user.role === "Manager") {
  }

  const formattedUser = {
    id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
    isUserDetailsComplete: user.isUserDetailsComplete,
    fullname: user.fullname || null,
    jerseyNumber: user.jerseyNumber || null,
    course: user.course || null,
    branch: user.branch || null,
    gender: user.gender || null,
    year: user.year || null,
    crn: user.crn || null,
    urn: user.urn || null,
    phone: user.phone || null,
    isEventsLocked: Boolean(user.isEventsLocked),
    selectedEvents: user.selectedEvents.map(({ eventId, status }) => ({
      eventId: eventId?._id,
      eventName: eventId?.name,
      eventType: eventId?.type,
      eventDay: eventId?.day,
      attendanceStatus: status,
    })),
    createdAt: user.createdAt,
  };

  return res
    .status(200)
    .json(new ApiResponse(formattedUser, "User details fetched successfully"));
});

export const changeUserDetails = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const changedDetails = req.body;
  const user = await User.findById(userId);
  if (!user) {
    throw ApiResponse(404, "User not found");
  }
  if (changedDetails.course) {
    const allowedBranches = courseBranchMap[changedDetails.course];
    if (!allowedBranches) {
      throw new ApiError(400, "Invalid course selected");
    }
    if (
      changedDetails.branch &&
      !allowedBranches.includes(changedDetails.branch)
    ) {
      throw new ApiError(
        400,
        `Invalid branch for course ${changedDetails.course}`
      );
    }
  }
  const restrictedFields = ["password", "email", "jerseyNumber"];
  restrictedFields.forEach((field) => delete changedDetails[field]);

  Object.assign(user, changedDetails);
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "User details updated successfully"));
});

export const lockUserEvents = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await User.findById(userId).session(session);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (user.isEventsLocked) {
      return res
        .status(200)
        .json(new ApiResponse(null, "Events already locked"));
    }

    const selectedEvents = user.selectedEvents || [];

    if (selectedEvents.length === 0) {
      user.isEventsLocked = true;
      await user.save({ session });

      await session.commitTransaction();
      session.endSession();

      return res
        .status(200)
        .json(new ApiResponse(null, "Events locked successfully"));
    }

    const eventIdsToInit = [];

    for (const ev of selectedEvents) {
      if (!ev.status || ev.status !== "notMarked") {
        ev.status = "notMarked";
        eventIdsToInit.push(ev.eventId);
      }
    }

    if (eventIdsToInit.length > 0) {
      await Event.updateMany(
        { _id: { $in: eventIdsToInit } },
        { $inc: { "studentsCount.notMarked": 1 } },
        { session }
      );
    }

    user.isEventsLocked = true;
    await user.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res
      .status(200)
      .json(new ApiResponse(null, "Events locked successfully"));
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
});

export const unlockUserEvents = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await User.findById(userId).session(session);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const selectedEvents = user.selectedEvents || [];

    if (selectedEvents.length === 0) {
      user.isEventsLocked = false;
      await user.save({ session });

      await session.commitTransaction();
      session.endSession();

      return res
        .status(200)
        .json(new ApiResponse(null, "Events unlocked successfully"));
    }

    const allNotMarked = selectedEvents.every(
      (ev) => ev.status === "notMarked"
    );

    if (allNotMarked) {
      await Event.updateMany(
        { _id: { $in: selectedEvents.map((e) => e.eventId) } },
        { $inc: { "studentsCount.notMarked": -1 } },
        { session }
      );
    } else {
      const statusBuckets = {
        notMarked: [],
        present: [],
        absent: [],
      };

      for (const ev of selectedEvents) {
        if (statusBuckets[ev.status]) {
          statusBuckets[ev.status].push(ev.eventId);
        }
      }

      const bulkOps = [];

      for (const [status, ids] of Object.entries(statusBuckets)) {
        if (ids.length === 0) continue;

        bulkOps.push({
          updateMany: {
            filter: { _id: { $in: ids } },
            update: { $inc: { [`studentsCount.${status}`]: -1 } },
          },
        });
      }

      if (bulkOps.length > 0) {
        await Event.bulkWrite(bulkOps, { session });
      }
    }

    user.isEventsLocked = false;
    user.selectedEvents = [];
    await user.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res
      .status(200)
      .json(new ApiResponse(null, "Events unlocked successfully"));
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
});

export const markAttendance = asyncHandler(async (req, res) => {
  const { jerseyNumber, eventId, status } = req.body;

  if (!jerseyNumber || !eventId || !status) {
    throw new ApiError(400, "jerseyNumber, eventId and status are required");
  }

  const allowedStatuses = ["present", "absent", "notMarked"];
  if (!allowedStatuses.includes(status)) {
    throw new ApiError(400, "Invalid attendance status");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await User.findOne({ jerseyNumber }).session(session);
    if (!user) throw new ApiError(404, "User not found");

    if (!user.isEventsLocked) {
      throw new ApiError(400, "User events are not locked");
    }

    const selectedEvent = user.selectedEvents.find(
      (e) => e.eventId.toString() === eventId
    );
    if (!selectedEvent) {
      throw new ApiError(400, "Event not selected by user");
    }

    const prevStatus = selectedEvent.status;
    if (prevStatus === status) {
      await session.abortTransaction();
      return res.status(200).json(new ApiResponse(null, "No state changed"));
    }

    if (!allowedStatuses.includes(prevStatus)) {
      throw new ApiError(400, "Corrupted attendance data");
    }

    const event = await Event.findById(eventId).session(session);
    if (!event) throw new ApiError(404, "Event not found");

    if (event.studentsCount[prevStatus] <= 0) {
      throw new ApiError(400, "Invalid attendance transition");
    }

    await Event.updateOne(
      { _id: eventId },
      {
        $inc: {
          [`studentsCount.${prevStatus}`]: -1,
          [`studentsCount.${status}`]: 1,
        },
      },
      { session }
    );

    await User.updateOne(
      { jerseyNumber, "selectedEvents.eventId": eventId },
      { $set: { "selectedEvents.$.status": status } },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return res
      .status(200)
      .json(new ApiResponse(null, "Attendance marked successfully"));
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
});

export const getAttendanceStats = asyncHandler(async (req, res) => {
  const users = await User.find(
    {},
    {
      fullname: 1,
      username: 1,
      email: 1,
      role: 1,
      jerseyNumber: 1,
      course: 1,
      year: 1,
      branch: 1,
      attendance: 1,
      selectedEvents: 1,
    }
  ).lean();

  const formattedUsers = users.map((u) => ({
    id: u._id,
    fullname: u.fullname,
    username: u.username,
    email: u.email,
    role: u.role,
    jerseyNumber: u.jerseyNumber || null,
    course: u.course || null,
    year: u.year || null,
    branch: u.branch || null,
    attendance: u.attendance || "Not Marked",
    eventsCount: u.selectedEvents?.length || 0,
  }));

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        count: formattedUsers.length,
        users: formattedUsers,
      },
      "Users fetched successfully"
    )
  );
});

export const deleteUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findByIdAndDelete(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }
  await Session.deleteMany({ userId: user._id });

  if (user.jerseyNumber !== null && user.jerseyNumber !== undefined) {
    await JerseyCounter.findByIdAndUpdate(
      "GLOBAL",
      { $push: { freeJerseyNumbers: user.jerseyNumber } },
      { new: true }
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(null, "User deleted successfully"));
});
