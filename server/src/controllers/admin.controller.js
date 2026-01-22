import { Session } from "../models/Session.model.js";
import { User } from "../models/User.model.js";
import { SystemConfig } from "../models/SystemConfig.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { courseBranchMap } from "../utils/courseBranchMap.js";
import { Event } from "../models/Events.model.js";
import mongoose from "mongoose";

const roleAccessPoints = (role) => {
  if (role === "Manager") return 3;
  if (role === "Admin") return 2;
  if (role === "Student") return 1;
  else 0;
};

const canModifyDetails = (
  { headId, headRole },
  { userId, userRole = null }
) => {
  if (headId === userId && (headRole === "Manager" || headRole === "Admin"))
    return true;
  if (
    roleAccessPoints(headRole) > roleAccessPoints(userRole) &&
    userRole !== null &&
    headRole !== "Student"
  )
    return true;
  return false;
};

const canDeleteUser = (headRole, userRole = null) => {
  if (roleAccessPoints(headRole) > roleAccessPoints(userRole)) return true;
  return false;
};

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
  const head = req.user;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await User.findById(userId).session(session);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    const userSelectedEventsIdArray = user.selectedEvents.map((ev) =>
      ev.eventId.toString()
    );

    if (
      !canModifyDetails(
        { headId: head.id || head._id.toString(), headRole: head.role },
        { userId: user.id, userRole: user.role }
      )
    ) {
      throw new ApiError(403, "You are not allowed to lock this user's events");
    }

    if (user.isEventsLocked) {
      await session.commitTransaction();
      return res
        .status(200)
        .json(new ApiResponse(null, "Events already locked"));
    }

    if (user.selectedEvents.length > 0) {
      const eventIds = user.selectedEvents.map((e) => e.eventId);

      await Event.updateMany(
        { _id: { $in: eventIds } },
        { $inc: { "studentsCount.notMarked": 1 } },
        { session }
      );

      user.selectedEvents.forEach((ev) => {
        ev.status = "notMarked";
      });
    }

    user.isEventsLocked = true;
    await user.save({ session });

    const eventsArrayFromEventsDB = await Event.find({
      _id: { $in: userSelectedEventsIdArray },
    });
    const formattedUserEventsData = eventsArrayFromEventsDB.map((ev) => {
      return {
        eventId: ev._id,
        eventName: ev.name,
        eventType: ev.type,
        eventDay: ev.day,
        attendanceStatus: "notMarked",
      };
    });

    await session.commitTransaction();
    return res
      .status(200)
      .json(
        new ApiResponse(formattedUserEventsData, "Events locked successfully")
      );
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});

export const unlockUserEvents = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const head = req.user;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await User.findById(userId).session(session);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    if (
      !canModifyDetails(
        { headId: head.id || head._id.toString(), headRole: head.role },
        { userId: user.id, userRole: user.role }
      )
    ) {
      throw new ApiError(
        403,
        "You are not allowed to unlock this user's events"
      );
    }

    if (!user.isEventsLocked) {
      await session.commitTransaction();
      return res
        .status(200)
        .json(new ApiResponse(null, "Events already unlocked"));
    }

    if (user.selectedEvents.length > 0) {
      for (const selectedEvent of user.selectedEvents) {
        const status = selectedEvent.status || "notMarked";
        const decrementField = `studentsCount.${status}`;

        await Event.updateOne(
          { _id: selectedEvent.eventId },
          { $inc: { [decrementField]: -1 } },
          { session }
        );
      }
    }

    user.isEventsLocked = false;
    user.selectedEvents = [];
    await user.save({ session });

    await session.commitTransaction();

    return res
      .status(200)
      .json(new ApiResponse(null, "Events unlocked successfully"));
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});

export const updateUserEvents = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const head = req.user;
  const { updatedEventsIdsArray } = req.body;

  if (!Array.isArray(updatedEventsIdsArray)) {
    throw new ApiError(400, "updatedEventsIdsArray must be an array");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await User.findById(userId).session(session);
    if (!user) throw new ApiError(404, "User not found");

    if (
      !canModifyDetails(
        { headId: head.id || head._id.toString(), headRole: head.role },
        { userId: user.id, userRole: user.role }
      )
    ) {
      throw new ApiError(
        403,
        "You are not allowed to update this user's events"
      );
    }

    user.selectedEvents = updatedEventsIdsArray.map((eid) => {
      return {
        eventId: eid,
      };
    });
    await user.save({ session });

    /* ---------- RESPONSE DATA ---------- */
    const events = await Event.find(
      { _id: { $in: [...updatedEventsIdsArray] } },
      "name type day",
      { session }
    ).lean();

    const formattedData = events.map((e) => ({
      eventId: e._id.toString(),
      eventName: e.name,
      eventType: e.type,
      eventDay: e.day,
      attendanceStatus: "notMarked",
    }));

    await session.commitTransaction();

    return res
      .status(200)
      .json(new ApiResponse(formattedData, "User events updated successfully"));
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
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

export const markAttendance = asyncHandler(async (req, res) => {
  const { jerseyNumber, eventId, status } = req.body;
  const head = req.user;

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

    if (
      !(
        head.role === "Manager" ||
        (head.role === "Admin" && user.role !== "Manager")
      )
    ) {
      throw new ApiError(
        403,
        "You are not allowed to mark attendance for this user"
      );
    }
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

export const markAttendanceByQr = asyncHandler(async (req, res) => {
  const athleteData = req.body;

  if (athleteData.recognitionId !== "GNDEC Athletix 2026") {
    throw new ApiError(404, "Invalid QR Code");
  }

  const { sid } = req.signedCookies;
  if (!sid) throw new ApiError(401, "Session missing");

  const sessionDoc = await Session.findById(sid);
  if (!sessionDoc) throw new ApiError(401, "Invalid session");

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await User.findById(sessionDoc.userId)
      .select("role selectedEvents isEventsLocked")
      .session(session);

    if (!user) throw new ApiError(404, "User not found");

    if (user.role === "Student") {
      throw new ApiError(403, "Unauthorized Access");
    }

    const targetUser = await User.findOne({
      jerseyNumber: athleteData.jerseyNumber,
    });

    if (!targetUser.isEventsLocked) {
      throw new ApiError(400, "Events are not locked for this user");
    }

    const targetUserEvent = targetUser.selectedEvents.find(
      (ev) => ev.eventId.toString() === athleteData.eventId
    );

    if (!targetUserEvent) {
      throw new ApiError(404, "User not registered for this event");
    }

    if (targetUserEvent.status === "present") {
      throw new ApiError(400, "Attendance already marked");
    }

    if (targetUserEvent.status !== "notMarked") {
      throw new ApiError(400, "Invalid attendance state");
    }

    targetUserEvent.status = "present";
    await targetUser.save({ session });

    const updatedTargetedUserEvent = await Event.findByIdAndUpdate(
      athleteData.eventId,
      {
        $inc: {
          "studentsCount.notMarked": -1,
          "studentsCount.present": 1,
        },
      },
      { new: true, session }
    );

    if (!updatedTargetedUserEvent) {
      throw new ApiError(404, "Event not found");
    }

    await session.commitTransaction();

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { eventId: athleteData.eventId, status: "present" },
          "Attendance marked successfully"
        )
      );
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
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
  const head = req.user;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await User.findById(userId).session(session);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (!canDeleteUser(head.role, user.role)) {
      throw new ApiError(403, "You are not allowed to delete this user");
    }

    await User.deleteOne({ _id: user._id }).session(session);

    await Session.deleteMany({ userId: user._id }).session(session);

    if (user.jerseyNumber !== null && user.jerseyNumber !== undefined) {
      await SystemConfig.findByIdAndUpdate(
        "GLOBAL",
        {
          $push: {
            freeJerseyNumbers: {
              $each: [user.jerseyNumber],
              $sort: 1,
            },
          },
        },
        { session }
      );
    }

    await session.commitTransaction();
    session.endSession();

    return res
      .status(200)
      .json(new ApiResponse(null, "User deleted successfully"));
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
});
