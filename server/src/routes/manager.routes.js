import { Router } from "express";
import {
  getAllEvents,
  makeAsAdmin,
  removeAsAdmin,
  toggleEvent,
  activateEvents,
  deactivateEvents,
  getCertificateStatus,
  lockCertificates,
  unlockCertificates,
} from "../controllers/manager.controller.js";

const router = Router();

// GET all events
router.route("/allEvents").get(getAllEvents);

router.route("/user/:userId/makeAsAdmin").post(makeAsAdmin);
router.route("/user/:userId/removeAsAdmin").post(removeAsAdmin);

// Toggle single event
router.route("/event/toggle").post(toggleEvent);

// Activate multiple events
router.route("/events/activate").post(activateEvents);

// Deactivate multiple events
router.route("/events/deactivate").post(deactivateEvents);

// Certificate controls
router.route("/certificates/status").get(getCertificateStatus);
router.route("/certificates/lock").post(lockCertificates);
router.route("/certificates/unlock").post(unlockCertificates);

export default router;
