import { Session } from "../models/Session.model.js";
import { User } from "../models/User.model.js";
import { SystemConfig } from "../models/SystemConfig.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { courseBranchMap } from "../utils/courseBranchMap.js";
import { Event } from "../models/Events.model.js";
import mongoose from "mongoose";
import { userGenderIsToEventCategory } from "./user.controller.js";

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

export const unlockMyEvents = asyncHandler(async (req, res) => {
  const user = req.user;

  if (!user.isEventsLocked) {
    throw new ApiError(409, "Events are already unlocked");
  }
  if (!user.selectedEvents || user.selectedEvents.length === 0) {
    throw new ApiError(400, "No events to unlock");
  }

  const hasMarkedEvent = user.selectedEvents.some(
    (event) =>
      event.userEventAttendance && event.userEventAttendance !== "notMarked"
  );

  if (hasMarkedEvent) {
    throw new ApiError(
      403,
      "You cannot unlock events because attendance has already been marked."
    );
  }

  const mongoSession = await mongoose.startSession();
  mongoSession.startTransaction();

  try {
    const eventObjectIds = user.selectedEvents.map(
      (e) => new mongoose.Types.ObjectId(e.eventId)
    );

    // Decrement only notMarked count (since all are notMarked)
    const eventUpdateResult = await Event.updateMany(
      {
        _id: { $in: eventObjectIds },
        "studentsCount.notMarked": { $gt: 0 },
        isActive: true,
        category: userGenderIsToEventCategory(user.gender),
      },
      { $inc: { "studentsCount.notMarked": -1 } },
      { session: mongoSession }
    );

    if (eventUpdateResult.modifiedCount !== eventObjectIds.length) {
      throw new ApiError(
        400,
        "Unlock failed. One or more events are invalid, inactive, or count is inconsistent."
      );
    }

    // Atomic unlock
    const updateResult = await User.updateOne(
      { _id: user._id, isEventsLocked: true },
      {
        $set: {
          isEventsLocked: false,
          selectedEvents: [],
        },
      },
      { session: mongoSession }
    );

    if (updateResult.modifiedCount === 0) {
      throw new ApiError(409, "Unlock failed — events already unlocked.");
    }

    await mongoSession.commitTransaction();
    mongoSession.endSession();

    return res
      .status(200)
      .json(new ApiResponse(null, "Events unlocked successfully"));
  } catch (error) {
    await mongoSession.abortTransaction();
    mongoSession.endSession();
    throw error;
  }
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

  const user = await User.findById(userId).select(
    "role isEventsLocked selectedEvents"
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (
    !canModifyDetails(
      { headId: head._id.toString(), headRole: head.role },
      { userId: user._id.toString(), userRole: user.role }
    )
  ) {
    throw new ApiError(403, "You are not allowed to lock this user's events");
  }

  if (user.isEventsLocked) {
    throw new ApiError(409, "Events are already locked");
  }

  if (!user.selectedEvents?.length) {
    await User.updateOne(
      { _id: user._id, isEventsLocked: false },
      { $set: { isEventsLocked: true } }
    );

    return res
      .status(200)
      .json(new ApiResponse([], "Events locked successfully"));
  }

  const eventIds = user.selectedEvents.map(
    (e) => new mongoose.Types.ObjectId(e.eventId)
  );

  const eventUpdate = await Event.updateMany(
    {
      _id: { $in: eventIds },
      isActive: true,
    },
    {
      $inc: { "studentsCount.notMarked": 1 },
    }
  );

  if (eventUpdate.modifiedCount !== eventIds.length) {
    throw new ApiError(
      409,
      "Some events are inactive or missing — lock aborted"
    );
  }

  const updateResult = await User.updateOne(
    { _id: user._id, isEventsLocked: false },
    { $set: { isEventsLocked: true } }
  );

  if (!updateResult.modifiedCount) {
    throw new ApiError(409, "Failed to lock events — retry");
  }

  // Load event details for response
  const events = await Event.find({ _id: { $in: eventIds } }).lean();

  const formatted = events.map((e) => ({
    eventId: e._id.toString(),
    eventName: e.name,
    eventType: e.type,
    eventDay: e.day,
    attendanceStatus: "notMarked",
  }));

  return res
    .status(200)
    .json(new ApiResponse(formatted, "Events locked successfully"));
});

export const unlockUserEvents = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const head = req.user;

  const user = await User.findById(userId).select(
    "role isEventsLocked selectedEvents"
  );
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Permission check
  if (
    !canModifyDetails(
      { headId: head._id.toString(), headRole: head.role },
      { userId: user._id.toString(), userRole: user.role }
    )
  ) {
    throw new ApiError(403, "You are not allowed to unlock this user's events");
  }

  // Must be locked first
  if (!user.isEventsLocked) {
    throw new ApiError(409, "Events are already unlocked. Lock them first.");
  }

  const selectedEvents = user.selectedEvents || [];

  // If no events, just unlock
  if (selectedEvents.length === 0) {
    await User.updateOne(
      { _id: user._id, isEventsLocked: true },
      { $set: { isEventsLocked: false, selectedEvents: [] } }
    );

    return res
      .status(200)
      .json(new ApiResponse(null, "Events unlocked successfully"));
  }

  // Build bulk decrement operations
  const bulkUpdates = selectedEvents.map((ev) => {
    const status = ev.status || "notMarked";

    return {
      updateOne: {
        filter: {
          _id: new mongoose.Types.ObjectId(ev.eventId),
          [`studentsCount.${status}`]: { $gt: 0 },
        },
        update: {
          $inc: { [`studentsCount.${status}`]: -1 },
        },
      },
    };
  });

  await Event.bulkWrite(bulkUpdates);

  // Unlock user + clear selected events
  await User.updateOne(
    { _id: user._id, isEventsLocked: true },
    {
      $set: {
        isEventsLocked: false,
        selectedEvents: [],
      },
    }
  );

  return res
    .status(200)
    .json(new ApiResponse(null, "Events unlocked successfully"));
});

export const updateUserEvents = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const head = req.user;
  const { updatedEventsIdsArray } = req.body;

  if (!Array.isArray(updatedEventsIdsArray)) {
    throw new ApiError(400, "updatedEventsIdsArray must be an array");
  }

  if (updatedEventsIdsArray.length === 0) {
    throw new ApiError(400, "At least one event must be selected");
  }

  if (updatedEventsIdsArray.length > 3) {
    throw new ApiError(400, "You can select a maximum of 3 events");
  }

  // Deduplicate early
  const uniqueEventIds = [...new Set(updatedEventsIdsArray.map(String))];

  // Fetch user + permission check
  const user = await User.findById(userId).select("role isEventsLocked");
  if (!user) throw new ApiError(404, "User not found");

  if (
    !canModifyDetails(
      { headId: head._id.toString(), headRole: head.role },
      { userId: user._id.toString(), userRole: user.role }
    )
  ) {
    throw new ApiError(403, "You are not allowed to update this user's events");
  }

  // Block update if locked
  if (user.isEventsLocked) {
    throw new ApiError(
      409,
      "User events are locked. Unlock events before modifying."
    );
  }

  // Fetch event metadata once
  const events = await Event.find(
    { _id: { $in: uniqueEventIds }, isActive: true },
    "name type day"
  ).lean();

  if (events.length !== uniqueEventIds.length) {
    throw new ApiError(
      400,
      "One or more selected events are invalid or inactive"
    );
  }

  // Single-pass validation
  let trackCount = 0;
  let fieldCount = 0;

  for (const e of events) {
    if (e.type === "Team") {
      throw new ApiError(
        403,
        "Team events cannot be added here. Use Manager panel."
      );
    }

    if (e.type === "Track") trackCount++;
    if (e.type === "Field") fieldCount++;
  }

  if (trackCount > 2) {
    throw new ApiError(400, "You can select a maximum of 2 Track events");
  }

  if (fieldCount > 2) {
    throw new ApiError(400, "You can select a maximum of 2 Field events");
  }

  if (trackCount + fieldCount > 3) {
    throw new ApiError(400, "You can select a maximum of 3 events");
  }

  // Build selectedEvents payload
  const newSelectedEvents = uniqueEventIds.map((eventId) => ({
    eventId: new mongoose.Types.ObjectId(eventId),
    status: "notMarked",
    position: 0,
  }));

  // Atomic user update (NO TRANSACTION NEEDED)
  await User.updateOne(
    { _id: user._id, isEventsLocked: false },
    { $set: { selectedEvents: newSelectedEvents } }
  );

  // Build response from already-fetched events (no second DB call)
  const formattedData = events.map((e) => ({
    eventId: e._id.toString(),
    eventName: e.name,
    eventType: e.type,
    eventDay: e.day,
    attendanceStatus: "notMarked",
  }));

  return res
    .status(200)
    .json(
      new ApiResponse(
        formattedData,
        "Events updated successfully. Lock events to confirm."
      )
    );
});

export const markAttendance = asyncHandler(async (req, res) => {
  const { jerseyNumber, clickedEventId, prevStatus, newStatus } = req.body;
  const head = req.user;

  if (!jerseyNumber || !clickedEventId || !prevStatus || !newStatus) {
    throw new ApiError(400, "Missing required attendance fields");
  }

  const allowed = ["present", "absent", "notMarked"];
  if (!allowed.includes(prevStatus) || !allowed.includes(newStatus)) {
    throw new ApiError(400, "Invalid attendance status");
  }

  // Step 1: Fetch user role + event entry (light query)
  const user = await User.findOne({ jerseyNumber }).select(
    "role isEventsLocked selectedEvents"
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Step 2: Role authorization
  if (
    !(
      head.role === "Manager" ||
      (head.role === "Admin" && user.role !== "Manager")
    )
  ) {
    throw new ApiError(403, "Unauthorized");
  }

  // Step 3: Events must be locked
  if (!user.isEventsLocked) {
    throw new ApiError(400, "User events not locked");
  }

  // Step 4: Find event entry
  const eventEntry = user.selectedEvents.find(
    (e) => e.eventId.toString() === clickedEventId
  );

  if (!eventEntry) {
    throw new ApiError(400, "Event not selected by user");
  }

  const userUpdate = await User.updateOne(
    {
      jerseyNumber,
      "selectedEvents.eventId": clickedEventId,
      "selectedEvents.status": prevStatus,
      isEventsLocked: true,
    },
    {
      $set: { "selectedEvents.$.status": newStatus },
    }
  );

  if (!userUpdate.modifiedCount) {
    throw new ApiError(409, "Attendance state has already changed");
  }

  const eventUpdate = await Event.updateOne(
    {
      _id: clickedEventId,
      [`studentsCount.${prevStatus}`]: { $gt: 0 },
    },
    {
      $inc: {
        [`studentsCount.${prevStatus}`]: -1,
        [`studentsCount.${newStatus}`]: 1,
      },
    }
  );

  if (!eventUpdate.modifiedCount) {
    // rollback user update
    await User.updateOne(
      {
        jerseyNumber,
        "selectedEvents.eventId": clickedEventId,
        "selectedEvents.status": newStatus,
      },
      {
        $set: { "selectedEvents.$.status": prevStatus },
      }
    );

    throw new ApiError(409, "Event counter conflict");
  }

  return res
    .status(200)
    .json(new ApiResponse(null, "Attendance marked successfully"));
});

export const markAttendanceByQr = asyncHandler(async (req, res) => {
  const { recognitionId, jerseyNumber, eventId } = req.body;

  if (!recognitionId || !jerseyNumber || !eventId) {
    throw new ApiError(400, "Missing required QR fields");
  }

  if (recognitionId !== "GNDEC SprintSync 2026") {
    throw new ApiError(404, "Invalid QR Code");
  }

  const eventObjectId = new mongoose.Types.ObjectId(eventId);

  // Step 1: Check if already marked (FAST EXIT)
  const alreadyMarked = await User.findOne({
    jerseyNumber,
    selectedEvents: {
      $elemMatch: {
        eventId: eventObjectId,
        status: "present",
      },
    },
  }).select("_id");

  if (alreadyMarked) {
    throw new ApiError(400, "Attendance already marked for this event");
  }

  // Step 2: Mark attendance atomically
  const updatedUser = await User.findOneAndUpdate(
    {
      jerseyNumber,
      isEventsLocked: true,
      "selectedEvents.eventId": eventObjectId,
      "selectedEvents.status": "notMarked",
    },
    {
      $set: { "selectedEvents.$.status": "present" },
    },
    { new: true }
  );

  if (!updatedUser) {
    throw new ApiError(400, "User not eligible or event mismatch");
  }

  // Step 3: Update event counters safely
  const counterUpdate = await Event.updateOne(
    {
      _id: eventObjectId,
      isActive: true,
      "studentsCount.notMarked": { $gt: 0 },
    },
    {
      $inc: {
        "studentsCount.notMarked": -1,
        "studentsCount.present": 1,
      },
    }
  );

  if (!counterUpdate.modifiedCount) {
    // revert user update ONLY if we changed it
    await User.updateOne(
      {
        jerseyNumber,
        "selectedEvents.eventId": eventObjectId,
        "selectedEvents.status": "present",
      },
      {
        $set: { "selectedEvents.$.status": "notMarked" },
      }
    );

    throw new ApiError(409, "Event counter out of sync. Contact admin.");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        { eventId, status: "present" },
        "Attendance marked successfully"
      )
    );
});

export const markAttendanceByGivingJerseyArray = asyncHandler(
  async (req, res) => {
    const { jerseysArray, selectedEventId } = req.body;

    if (!Array.isArray(jerseysArray) || jerseysArray.length === 0) {
      throw new ApiError(400, "Jersey numbers must be a non-empty array");
    }

    const uniqueJerseys = [...new Set(jerseysArray)];
    const eventId = new mongoose.Types.ObjectId(selectedEventId);

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // 1️⃣ Load event once
      const event = await Event.findById(eventId)
        .select("category studentsCount")
        .session(session);

      if (!event) throw new ApiError(404, "Event not found");

      // 2️⃣ Resolve event gender rule
      const category = event.category?.toLowerCase();
      const eventGender = category?.includes("girl")
        ? "Female"
        : category?.includes("boy")
          ? "Male"
          : event.category;

      // 3️⃣ Atomically update eligible users
      const userUpdate = await User.updateMany(
        {
          jerseyNumber: { $in: uniqueJerseys },
          gender: eventGender,
          isEventsLocked: true,
          selectedEvents: {
            $elemMatch: {
              eventId,
              status: "notMarked",
              position: 0,
            },
          },
        },
        {
          $set: { "selectedEvents.$[ev].status": "present" },
        },
        {
          session,
          arrayFilters: [
            {
              "ev.eventId": eventId,
              "ev.status": "notMarked",
              "ev.position": 0,
            },
          ],
        }
      );

      // 4️⃣ Ensure all jerseys updated
      if (userUpdate.modifiedCount !== uniqueJerseys.length) {
        throw new ApiError(
          400,
          "Some jerseys invalid, wrong gender, unlocked, not enrolled, or already marked"
        );
      }

      // 5️⃣ Atomic event counter update
      const eventUpdate = await Event.updateOne(
        {
          _id: eventId,
          "studentsCount.notMarked": { $gte: uniqueJerseys.length },
        },
        {
          $inc: {
            "studentsCount.present": uniqueJerseys.length,
            "studentsCount.notMarked": -uniqueJerseys.length,
          },
        },
        { session }
      );

      if (!eventUpdate.modifiedCount) {
        throw new ApiError(409, "Event counter conflict — retry");
      }

      await session.commitTransaction();

      return res
        .status(200)
        .json(
          new ApiResponse(
            { markedCount: uniqueJerseys.length },
            `Attendance marked for ${uniqueJerseys.length} athletes`
          )
        );
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }
  }
);

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

    // Decrement event counts for user's enrolled events (if locked)
    if (user.isEventsLocked && user.selectedEvents.length > 0) {
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
