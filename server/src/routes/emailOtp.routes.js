import { Router } from "express";
import {
  registerOtpSender,
  registerOtpVerifier,
} from "../controllers/otp.controller.js";

const router = Router();

router.route("/registerOtpSender").post(registerOtpSender);
router.route("/registerOtpVerifier").post(registerOtpVerifier);

export default router;
