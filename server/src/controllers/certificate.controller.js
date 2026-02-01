import { User } from "../models/User.model.js";
import { Event } from "../models/Events.model.js";
import { SystemConfig } from "../models/SystemConfig.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { generateCertificatePDF } from "../utils/certificate.utils.js";

export const generateCertificate = asyncHandler(async (req, res) => {
  const currentUser = req.user;
  const { eventId, type } = req.params; // "winner" | "participation"

  if (!currentUser) {
    throw new ApiError(401, "Not authenticated");
  }

  /* ---------- SYSTEM CHECK ---------- */
  const systemConfig = await SystemConfig.findById("GLOBAL").lean();
  if (systemConfig?.areCertificatesLocked) {
    throw new ApiError(403, "Certificates are currently locked");
  }

  /* ---------- LOAD USER ---------- */
  const user = await User.findById(currentUser._id).lean();
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Normalize optional fields
  user.course = user.course ?? "";
  user.branch = user.branch ?? "";
  user.urn = user.urn ?? "";

  /* ---------- VALIDATE EVENT ---------- */
  const userEvent = user.selectedEvents?.find(
    (e) => e.eventId?.toString() === eventId
  );

  if (!userEvent) {
    throw new ApiError(400, "You are not enrolled in this event");
  }

  if (userEvent.status !== "present") {
    throw new ApiError(400, "Certificate allowed only for attended events");
  }

  if (type === "winner" && (!userEvent.position || userEvent.position === 0)) {
    throw new ApiError(400, "Winner certificate requires a valid position");
  }

  /* ---------- REFRESH EVENT NAME FROM DB ---------- */
  const event = await Event.findById(eventId).lean();
  if (event) {
    userEvent.eventName = event.name;
  }

  /* ---------- GENERATE PDF VIA UTILITY ---------- */
  const { pdfBytes, studentName, eventName } = await generateCertificatePDF({
    user,
    userEvent,
    type,
  });

  /* ---------- SEND PDF ---------- */
  const safeFileName = `Certificate_${eventName.replace(
    /\s+/g,
    "_"
  )}_${studentName.replace(/\s+/g, "_")}_${type}.pdf`;

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${safeFileName}"`
  );

  res.send(Buffer.from(pdfBytes));
});
