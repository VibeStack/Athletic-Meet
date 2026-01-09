import { Session } from "../models/Session.model.js";
import { User } from "../models/User.model.js";
import { JerseyCounter } from "../models/JerseyCounter.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { courseBranchMap } from "../utils/courseBranchMap.js";

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password");
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { count: users.length, users },
        "Users fetched successfully."
      )
    );
});

const changeUserDetails = asyncHandler(async (req, res) => {
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

const unlockEvents = asyncHandler(async (req, res) => {
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

const markAttendance = asyncHandler(async (req, res) => {
  const { jerseyNumber } = req.params;
  const user = await User.findOne({ jerseyNumber });
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  user.attendance = "Present";
  await user.save();
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Attendance marked successfully"));
});

const deleteUser = asyncHandler(async (req, res) => {
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

export {
  getAllUsers,
  changeUserDetails,
  markAttendance,
  deleteUser,
  unlockEvents,
};
