import { Router } from "express";
import {
  getAllEvents,
  bulkAddEvents,
  markingResults,
  getAllUsers,
  makeSingleAsAdmin,
  removeSingleAsAdmin,
  makeMultipleAsAdmin,
  removeMultipleAsAdmin,
  toggleEvent,
  activateEvents,
  deactivateEvents,
  getCertificateStatus,
  unlockCertificates,
  lockCertificates,
  markAllDetailsCompleteAsPartial,
  showEventsStatus,
  previewCertificate,
  getAnalytics,
} from "../controllers/manager.controller.js";
import {
  exportAllEvents,
  exportSingleEvent,
  exportWinners,
} from "../controllers/export.controller.js";
import { getAllActiveOtps } from "../controllers/otp.controller.js";

const router = Router();

router.route("/allEvents").get(getAllEvents);
router.route("/event/bulkAdd").post(bulkAddEvents);
router.route("/event/results").post(markingResults);

router.route("/export/allUsers").get(getAllUsers);
router.route("/export/excel/all").get(exportAllEvents);
router.route("/export/excel/event/:eventId").get(exportSingleEvent);
router.route("/export/excel/winners").get(exportWinners);

router.route("/user/:userId/makeSingleAsAdmin").post(makeSingleAsAdmin);
router.route("/user/:userId/removeSingleAsAdmin").post(removeSingleAsAdmin);

router.post("/users/makeMultipleAsAdmin", makeMultipleAsAdmin);
router.post("/users/removeMultipleAsAdmin", removeMultipleAsAdmin);

router.route("/event/toggle").post(toggleEvent);
router.route("/events/activate").post(activateEvents);
router.route("/events/deactivate").post(deactivateEvents);

router.route("/certificates/status").get(getCertificateStatus);
router.route("/certificates/lock").post(lockCertificates);
router.route("/certificates/unlock").post(unlockCertificates);

router
  .route("/markAllDetailsCompleteAsPartial")
  .post(markAllDetailsCompleteAsPartial);
router.route("/showEventsStatus").get(showEventsStatus);
router.route("/certificate/preview/:eventId/:type").get(previewCertificate);
router.route("/otps").get(getAllActiveOtps);
router.route("/analytics").get(getAnalytics);

export default router;
