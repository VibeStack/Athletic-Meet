import { Session } from "../models/Session.model.js";
import { User } from "../models/User.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Cookie options based on environment
const isProduction = process.env.NODE_ENV === "production";
const cookieOptions = {
  httpOnly: true,
  signed: true,
  path: "/",
  sameSite: isProduction ? "none" : "lax",
  secure: isProduction,
  ...(isProduction && { partitioned: true }),
};

export const loginUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  const existingSid = req.signedCookies?.sid;
  if (existingSid) {
    await Session.findByIdAndDelete(existingSid);
    res.clearCookie("sid", cookieOptions);
  }

  const user = await User.findOne({ email, isUserDetailsComplete: "true" });

  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid || user.username !== username.toLowerCase()) {
    throw new ApiError(401, "Invalid credentials");
  }

  const allUserSessions = await Session.find({
    userId: user._id,
  }).sort({
    createdAt: 1,
  });

  const sessionLimit = user.role === "Manager" ? 3 : 1;
  if (allUserSessions.length >= sessionLimit) {
    await allUserSessions[0].deleteOne();
  }

  const session = await Session.create({ userId: user._id });
  res.cookie("sid", session.id, {
    ...cookieOptions,
    maxAge: 1 * 24 * 60 * 60 * 1000,
  });

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
    .json(new ApiResponse(userResponse, "Login successful!"));
});

export const logoutUser = asyncHandler(async (req, res) => {
  const { sid } = req.signedCookies;
  if (!sid) {
    throw new ApiError(401, "Not authenticated");
  }

  await Session.findByIdAndDelete(sid);
  res.clearCookie("sid", cookieOptions);

  return res.status(200).json(new ApiResponse(null, "Logged out successfully"));
});
