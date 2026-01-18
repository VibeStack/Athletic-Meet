import { Router } from "express";
import { generateCertificate } from "../controllers/certificate.controller.js";

const router = Router();

// Generate and download certificate for specific event
// :eventId - the event ID
// :type - 'participation' or 'winner'
router.route("/download/:eventId/:type").get(generateCertificate);

export default router;
