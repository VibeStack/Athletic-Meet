import { Router } from "express";
import {
  registerUser,
  getCurrentUser,
  getEvents,
  lockEvents,
  getCertificates,
} from "../controllers/user.controller.js";
import { checkAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/profile").get(checkAuth, getCurrentUser);
router.route("/events").get(checkAuth, getEvents);
router.route("/events/lock").post(checkAuth, lockEvents);
router.route("/certificates").get(checkAuth, getCertificates);

export default router;
