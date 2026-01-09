import { Router } from "express";
import { getAllUsers, deleteUser, changeUserDetails, markAttendance, unlockEvents } from "../controllers/admin.controller.js";

const router = Router();

router.route("/user/:userId").patch(changeUserDetails);
router.route("/user/jersyNumber").patch(markAttendance);
router.route("/user/:userId").delete(deleteUser);
router.route("/user/events/unlock").post(unlockEvents);

router.route("/users").get(getAllUsers);

export default router;

