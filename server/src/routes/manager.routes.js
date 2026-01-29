import { Router } from "express";
import {
  getAllEvents,
  bulkAddEvents,
  markingResults,
  getAllUsers,
  makeSingleAsAdmin,
  removeSingleAsAdmin,
  toggleEvent,
  activateEvents,
  deactivateEvents,
  getCertificateStatus,
  unlockCertificates,
  lockCertificates,
  markAllDetailsCompleteAsPartial,
  showEventsStatus,
} from "../controllers/manager.controller.js";

const router = Router();

// GET all events
router.route("/allEvents").get(getAllEvents);
router.route("/event/bulkAdd").post(bulkAddEvents);
router.route("/event/results").post(markingResults);

router.route("/export/allUsers").get(getAllUsers);

router.route("/user/:userId/makeSingleAsAdmin").post(makeSingleAsAdmin);
router.route("/user/:userId/removeSingleAsAdmin").post(removeSingleAsAdmin);

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

router.route("/markAllDetailsCompleteAsPartial").post(markAllDetailsCompleteAsPartial);
router.route("/showEventsStatus").get(showEventsStatus);



export default router;
