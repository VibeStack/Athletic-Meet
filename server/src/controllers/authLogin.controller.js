import { Session } from "../models/Session.model.js";
import { User } from "../models/User.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const loginUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid && user.username !== username) {
    throw new ApiError(401, "Invalid credentials");
  }

  const allUserSessions = await Session.find({ userId: user.id });
  const sessionLimit = user.role === "Admin" || user.role === "Manager" ? 2 : 1;
  if (allUserSessions.length >= sessionLimit) {
    await allUserSessions[0].deleteOne();
  }

  const session = await Session.create({ userId: user._id });
  res.cookie("sid", session.id, {
    httpOnly: true,
    signed: true,
    sameSite: "none",
    secure: true,
    path: "/",
    maxAge: 1 * 24 * 60 * 60 * 1000,
  });

  return res.status(200).json(new ApiResponse(200, null, "Login successful!"));
});

export const logoutUser = asyncHandler(async (req, res) => {
  const { sid } = req.signedCookies;
  await Session.findByIdAndDelete(sid);
  res.clearCookie("sid");
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Logged out successfully"));
});

export const logoutAllUserDevices = asyncHandler(async (req, res) => {
  const { sid } = req.signedCookies;
  const session = await Session.findById(sid);
  await Session.deleteMany({ userId: session.userId });

  res.clearCookie("sid");
  return res
    .status(200)
    .json(
      new ApiResponse(200, null, "Logged out from all devices successfully")
    );
});
