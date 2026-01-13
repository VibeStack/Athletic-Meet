import { Router } from "express";
import {
  getAllUsers,
  deleteUser,
  changeUserDetails,
  markAttendance,
  lockUserEvents,
  unlockUserEvents,
  getUserDetails,
} from "../controllers/admin.controller.js";

const router = Router();

router.route("/users").get(getAllUsers);
router.route("/user/:userId").get(getUserDetails);
router.route("/user/event/attendance").post(markAttendance);

router.post("/users/:userId/events/lock", lockUserEvents);
router.post("/users/:userId/events/unlock", unlockUserEvents);

router.route("/user/:userId").delete(deleteUser);

router.route("/user/:userId").patch(changeUserDetails);
// router.route("/attendance/event/:eventId").get(getAttendanceStats);

export default router;
