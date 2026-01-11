import { Router } from "express";
import {
  getAllUsers,
  deleteUser,
  changeUserDetails,
  markAttendance,
  unlockEvents,
  getUserDetails,
} from "../controllers/admin.controller.js";

const router = Router();

router.route("/users").get(getAllUsers);

router.route("/user/:userId").patch(changeUserDetails);
router.route("/user/jersyNumber").patch(markAttendance);
router.route("/user/:userId").delete(deleteUser);
router.route("/user/events/unlock").post(unlockEvents);

router.route("/user/:userId").get(getUserDetails);
router.route("/users/attendance").post(markAttendance);
// router.route("/attendance/event/:eventId").get(getAttendanceStats);

export default router;
