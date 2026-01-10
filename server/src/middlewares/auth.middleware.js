import { Session } from "../models/Session.model.js";
import { User } from "../models/User.model.js";
import { ApiError } from "../utils/ApiError.js";

export const checkAuth = async (req, res, next) => {
  try {
    const { sid } = req.signedCookies;

    if (!sid) {
      throw new ApiError(401, "Not logged in");
    }

    const session = await Session.findById(sid);
    if (!session) {
      res.clearCookie("sid", {
        httpOnly: true,
        signed: true,
        sameSite: "none",
        secure: true,
      });
      throw new ApiError(401, "Session expired or invalid");
    }

    const user = await User.findById(session.userId);
    if (!user) {
      res.clearCookie("sid", {
        httpOnly: true,
        signed: true,
        sameSite: "none",
        secure: true,
      });
      throw new ApiError(401, "User not found");
    }

    req.user = user;
    return next();
  } catch (error) {
    return next(error);
  }
};

export const requireAdminAccess = (req, res, next) => {
  if (!req.user) {
    return next(new ApiError(401, "Unauthorized"));
  }

  if (req.user.role === "Admin" || req.user.role === "Manager") {
    return next();
  }

  return next(new ApiError(403, "Admin access required"));
};

export const requireManagerAccess = (req, res, next) => {
  if (!req.user) {
    return next(new ApiError(401, "Unauthorized"));
  }

  if (req.user.role === "Manager") {
    return next();
  }

  return next(new ApiError(403, "Manager access required"));
};
