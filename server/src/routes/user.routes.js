import { Router } from "express";
import {
  registerUser,
  getCurrentUser,
  getEvents,
  lockEvents,
  unlockEvents,
} from "../controllers/user.controller.js";
import {
  checkAuth,
  requireAdminAccess,
} from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/profile").get(checkAuth, getCurrentUser);
router.route("/events").get(checkAuth, getEvents);
router.route("/events/lock").post(checkAuth, lockEvents);
router.route("/events/unlock").post(checkAuth, requireAdminAccess, unlockEvents);

export default router;
