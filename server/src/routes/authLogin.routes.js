import { Router } from "express";
import {
  loginUser,
  logoutAllUserDevices,
  logoutUser,
} from "../controllers/authLogin.controller.js";
import { checkAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/login").post(loginUser);
router.route("/logout").post(checkAuth, logoutUser);
router.route("/logout-all").post(checkAuth, logoutAllUserDevices);

export default router;
