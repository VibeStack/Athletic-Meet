import { Router } from "express";
import {
  getAllUsers,
  deleteUser,
  changeUserDetails,
  markAttendance,
  lockUserEvents,
  unlockUserEvents,
  getUserDetails,
  updateUserEvents,
  markAttendanceByQr,
} from "../controllers/admin.controller.js";

const router = Router();

router.route("/users").get(getAllUsers);
router.route("/user/:userId").get(getUserDetails);

router.route("/user/event/attendance").post(markAttendance);
router.route("/user/event/qrAttendance").post(markAttendanceByQr);

router.route("/users/:userId/events/lock").post(lockUserEvents);
router.route("/users/:userId/events/unlock").post(unlockUserEvents);
router.route("/users/:userId/updateEvents").post(updateUserEvents);

router.route("/user/:userId").delete(deleteUser);

router.route("/user/:userId").patch(changeUserDetails);

export default router;
