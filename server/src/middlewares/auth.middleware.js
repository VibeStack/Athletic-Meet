import { Session } from "../models/Session.model.js";
import { User } from "../models/User.model.js";
import { ApiError } from "../utils/ApiError.js";

export const checkAuth = async (req, res, next) => {
  try {
    const { sid } = req.signedCookies;

    if (!sid) {
      throw new ApiError(401, "Not logged in (checkAuth)");
    }

    const session = await Session.findById(sid);
    if (!session) {
      res.clearCookie("sid");
      throw new ApiError(401, "Session expired or invalid");
    }

    const user = await User.findById(session.userId).lean();
    if (!user) {
      res.clearCookie("sid");
      throw new ApiError(401, "User not found");
    }
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return next(new ApiError(401, "Unauthorized: User not authenticated"));
  }
  if (req.user.role === "Admin" || req.user.role === "Manager") {
    next();
  } else {
    next(new ApiError(403, "Access denied: Admin privileges required"));
  }
};
