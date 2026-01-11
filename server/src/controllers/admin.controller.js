import { Session } from "../models/Session.model.js";
import { User } from "../models/User.model.js";
import { JerseyCounter } from "../models/JerseyCounter.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { courseBranchMap } from "../utils/courseBranchMap.js";
import { Event } from "../models/Events.model.js";

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

  const formattedUsers = users.map((u) => ({
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
  }));

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
    gender: 1,
    phone: 1,
    course: 1,
    branch: 1,
    year: 1,
    crn: 1,
    urn: 1,
    jerseyNumber: 1,
    attendance: 1,
    isUserDetailsComplete: 1,
    isEventsLocked: 1,
    selectedEvents: 1,
    createdAt: 1,
  })
    .populate({
      path: "selectedEvents",
      select: "eventname eventType eventDay",
    })
    .lean();

  if (!user) {
    return res.status(404).json(new ApiResponse(404, null, "User not found"));
  }

  const formattedUser = {
    id: user._id,
    fullname: user.fullname,
    username: user.username,
    email: user.email,
    role: user.role,
    gender: user.gender || null,
    phone: user.phone || null,
    course: user.course || null,
    branch: user.branch || null,
    year: user.year || null,
    crn: user.crn || null,
    urn: user.urn || null,
    jerseyNumber: user.jerseyNumber || null,
    attendance: user.attendance || "Not Marked",
    isUserDetailsComplete: Boolean(user.isUserDetailsComplete),
    isEventsLocked: Boolean(user.isEventsLocked),
    selectedEvents:
      user.selectedEvents?.map((e) => ({
        id: e._id,
        name: e.eventname,
        type: e.eventType,
        day: e.eventDay,
      })) || [],
    createdAt: user.createdAt,
  };

  return res
    .status(200)
    .json(
      new ApiResponse(200, formattedUser, "User details fetched successfully")
    );
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

export const unlockEvents = asyncHandler(async (req, res) => {
  const { sid } = req.signedCookies;

  const session = await Session.findById(sid);
  if (!session) {
    throw new ApiError(401, "Session not found");
  }

  const user = await User.findById(session.userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.selectedEvents = [];
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Events unlocked successfully"));
});

export const markAttendance = asyncHandler(async (req, res) => {
  const { jerseyNumber, eventId } = req.body;
  const user = await User.findOne({ jerseyNumber });
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const event = await Event.findById(eventId);
  if (!event) {
    throw new ApiError(404, "Event not found");
  }
  user.selectedEvents = user.selectedEvents.map((e) => {
    if (e.eventId.toString() === eventId.toString()) {
      return { ...e, status: "Present" };
    }
    return e;
  });
  await user.save();
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Attendance marked successfully"));
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

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  await Session.deleteMany({ userId: user.id });

  if (user.jerseyNumber != null) {
    await JerseyCounter.findOneAndUpdate(
      {},
      { $push: { freeJersyNumbers: user.jerseyNumber } },
      { new: true }
    );
  }

  await user.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "User deleted successfully"));
});
