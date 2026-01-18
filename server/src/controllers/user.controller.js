import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/User.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Event } from "../models/Events.model.js";
import { Session } from "../models/Session.model.js";
import { SystemConfig } from "../models/SystemConfig.model.js";
import mongoose from "mongoose";

const getNextJerseyNumber = async (session) => {
  let counter = await SystemConfig.findById("GLOBAL").session(session);

  if (!counter) {
    const created = await SystemConfig.create(
      [
        {
          _id: "GLOBAL",
          lastAssignedJerseyNumber: 1,
          freeJerseyNumbers: [],
          areCertificatesLocked: false,
        },
      ],
      { session }
    );

    return created[0].lastAssignedJerseyNumber;
  }

  if (counter.freeJerseyNumbers.length > 0) {
    const reused = counter.freeJerseyNumbers[0];

    await SystemConfig.updateOne(
      { _id: "GLOBAL" },
      { $pull: { freeJerseyNumbers: reused } },
      { session }
    );

    return reused;
  }

  counter.lastAssignedJerseyNumber += 1;
  await counter.save({ session });

  return counter.lastAssignedJerseyNumber;
};

export const registerUser = asyncHandler(async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

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

    const user = await User.findOne({
      $or: [{ email }, { username }],
    }).session(session);

    if (!user) {
      throw new ApiError(400, "Invalid registration attempt");
    }

    if (user.isUserDetailsComplete === "false") {
      throw new ApiError(403, "Please verify OTP first");
    }

    if (user.isUserDetailsComplete === "true") {
      await session.commitTransaction();
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

    return res
      .status(200)
      .json(new ApiResponse(null, "Registration completed successfully"));
  } catch (error) {
    console.log(JSON.stringify(error.errInfo, null, 2));
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    throw error;
  } finally {
    session.endSession();
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
  const { sid } = req.signedCookies;
  const { events: userSelectedEventsIdArray } = req.body;

  if (!sid) {
    throw new ApiError(401, "Session not found");
  }

  if (
    !Array.isArray(userSelectedEventsIdArray) ||
    userSelectedEventsIdArray.length === 0
  ) {
    throw new ApiError(400, "Events must be a non-empty array");
  }

  if (userSelectedEventsIdArray.length > 5) {
    throw new ApiError(400, "Maximum 5 events can be selected");
  }

  const mongoSession = await mongoose.startSession();
  mongoSession.startTransaction();

  try {
    const sessionDoc = await Session.findById(sid).session(mongoSession);
    if (!sessionDoc) {
      throw new ApiError(401, "Invalid session");
    }

    const user = await User.findById(sessionDoc.userId).session(mongoSession);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (user.isEventsLocked) {
      throw new ApiError(
        409,
        "Events already locked. Contact admin to unlock."
      );
    }

    const eventObjectIds = userSelectedEventsIdArray.map(
      (id) => new mongoose.Types.ObjectId(id)
    );

    const validEvents = await Event.find({
      _id: { $in: eventObjectIds },
      isActive: true,
    }).session(mongoSession);

    if (validEvents.length !== userSelectedEventsIdArray.length) {
      throw new ApiError(400, "One or more events are invalid or inactive");
    }

    const selectedEventsPayload = eventObjectIds.map((eventId) => ({
      eventId,
      position: 0,
      status: "notMarked",
    }));

    const updatedData = await User.findOneAndUpdate(
      { _id: user._id },
      {
        $set: {
          selectedEvents: selectedEventsPayload,
          isEventsLocked: true,
        },
      },
      { session: mongoSession }
    );

    await Event.updateMany(
      { _id: { $in: eventObjectIds } },
      {
        $inc: {
          "studentsCount.notMarked": 1,
        },
      },
      { session: mongoSession }
    );

    const events = await Event.find({
      _id: { $in: eventObjectIds },
    });
    const returningEventsData = events.map((e) => {
      return {
        eventId: e._id,
        eventName: e.name,
        eventType: e.type,
        eventDay: e.day,
        isEventActive: e.isActive,
        userEventAttendance: "notMarked",
      };
    });

    await mongoSession.commitTransaction();
    mongoSession.endSession();

    return res
      .status(200)
      .json(new ApiResponse(returningEventsData, "Events Locked Successfully"));
  } catch (error) {
    await mongoSession.abortTransaction();
    mongoSession.endSession();
    throw error;
  }
});

export const unlockEvents = asyncHandler(async (req, res) => {
  const { sid } = req.signedCookies;

  if (!sid) {
    throw new ApiError(401, "Session not found");
  }

  const mongoSession = await mongoose.startSession();
  mongoSession.startTransaction();

  try {
    const sessionDoc = await Session.findById(sid).session(mongoSession);
    if (!sessionDoc) {
      throw new ApiError(401, "Invalid session");
    }

    const user = await User.findById(sessionDoc.userId).session(mongoSession);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (user.isEventsLocked && user.role === "Student") {
      throw new ApiError(
        409,
        "Events already locked. Contact admin to unlock."
      );
    }

    const eventObjectIds = user.selectedEvents.map(({ eventId }) => eventId);

    const validEvents = await Event.find({
      _id: { $in: eventObjectIds },
      isActive: true,
    }).session(mongoSession);

    if (validEvents.length !== user.selectedEvents.length) {
      throw new ApiError(400, "One or more events are invalid or inactive");
    }

    // console.log(validEvents);

    const updatedUser = await User.findOneAndUpdate(
      { _id: user._id },
      {
        $set: {
          selectedEvents: [],
          isEventsLocked: false,
        },
      },
      { new: true, session: mongoSession }
    );

    // console.log(updatedUser);

    await Event.updateMany(
      { _id: { $in: eventObjectIds }, "studentsCount.notMarked": { $gt: 0 } },
      {
        $inc: {
          "studentsCount.notMarked": -1,
        },
      },
      { session: mongoSession }
    );
    const updatedEvents = await Event.find({
      _id: { $in: eventObjectIds },
    }).session(mongoSession);

    // console.log(
    //   updatedEvents,
    //   updatedEvents.map((e) => e.studentsCount)
    // );

    await mongoSession.commitTransaction();
    mongoSession.endSession();

    return res
      .status(200)
      .json(new ApiResponse(null, "Events Unlocked successfully"));
  } catch (error) {
    await mongoSession.abortTransaction();
    mongoSession.endSession();
    throw error;
  }
});

// Get user certificates
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
    eventName: event.eventId?.name || "Unknown Event",
    eventType: event.eventId?.type || "Unknown",
    eventDay: event.eventId?.day || "Unknown",
    status: event.status,
    // Position from event results (if applicable)
    // For now, assuming participation. Winner logic can be added later.
    position: null, // 1, 2, 3 for winners or null for participation
    certificateType: "Participation", // "Winner" if position is 1,2,3
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
