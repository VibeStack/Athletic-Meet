import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { User } from "../models/User.model.js";
import { Event } from "../models/Events.model.js";
import { SystemConfig } from "../models/SystemConfig.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateCertificate = asyncHandler(async (req, res) => {
  const user = req.user;
  const { eventId, type } = req.params; // type can be 'participation' or 'winner'

  if (!user) {
    throw new ApiError(401, "Not authenticated");
  }

  // Check if certificates are locked
  const config = await SystemConfig.findById("GLOBAL");
  if (config?.areCertificatesLocked) {
    throw new ApiError(403, "Certificates are currently locked");
  }

  // Get user with full details
  const userDoc = await User.findById(user._id).lean();
  if (!userDoc) {
    throw new ApiError(404, "User not found");
  }

  // Verify user is enrolled in this event AND is marked present
  const enrolledEvent = userDoc.selectedEvents?.find(
    (e) => e.eventId?.toString() === eventId
  );
  if (!enrolledEvent) {
    throw new ApiError(400, "You are not enrolled in this event");
  }

  // Check if student is marked present
  if (enrolledEvent.status !== "present") {
    throw new ApiError(
      400,
      "You can only download certificate for events where you were present"
    );
  }

  // Get event details
  const event = await Event.findById(eventId).lean();
  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  // Load the certificate template image
  const templatePath = path.join(
    __dirname,
    "..",
    "..",
    "public",
    "Certificates",
    "Certificates.png"
  );

  if (!fs.existsSync(templatePath)) {
    throw new ApiError(500, "Certificate template not found");
  }

  const templateBytes = fs.readFileSync(templatePath);

  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();

  // Embed the PNG image
  const templateImage = await pdfDoc.embedPng(templateBytes);
  const { width: imgWidth, height: imgHeight } = templateImage.scale(1);

  // Add a page with the same size as the image
  const page = pdfDoc.addPage([imgWidth, imgHeight]);

  // Draw the template as background
  page.drawImage(templateImage, {
    x: 0,
    y: 0,
    width: imgWidth,
    height: imgHeight,
  });

  // Embed fonts
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Define text color (dark blue to match the certificate style)
  const textColor = rgb(0.1, 0.15, 0.3);

  // Calculate positions based on the certificate template
  const centerX = imgWidth / 2;

  // User's Full Name - positioned after "THIS IS TO CERTIFY THAT"
  // IMPORTANT: Convert all values to strings to avoid pdf-lib errors
  const userName = String(userDoc.fullname || userDoc.username || "Student");
  const nameWidth = helveticaBold.widthOfTextAtSize(userName, 28);
  page.drawText(userName, {
    x: centerX - nameWidth / 2,
    y: imgHeight - 285,
    size: 28,
    font: helveticaBold,
    color: textColor,
  });

  // "of" line - Degree and Branch
  const course = String(userDoc.course || "B.Tech");
  const branch = String(userDoc.branch || "");
  const degreeText = branch ? `${course} - ${branch}` : course;
  page.drawText(degreeText, {
    x: 170,
    y: imgHeight - 336,
    size: 16,
    font: helvetica,
    color: textColor,
  });

  // Roll Number (URN) - Convert to string
  const urnText = String(userDoc.urn || "N/A");
  page.drawText(urnText, {
    x: imgWidth / 2 + 80,
    y: imgHeight - 336,
    size: 16,
    font: helvetica,
    color: textColor,
  });

  // "participated in" - Event Name
  const eventName = String(event.name || "Event");
  page.drawText(eventName, {
    x: 230,
    y: imgHeight - 380,
    size: 16,
    font: helvetica,
    color: textColor,
  });

  // Session
  const sessionText = "2025-2026";
  page.drawText(sessionText, {
    x: imgWidth / 2 + 90,
    y: imgHeight - 380,
    size: 16,
    font: helvetica,
    color: textColor,
  });

  // Serialize the PDF
  const pdfBytes = await pdfDoc.save();

  // Set response headers for PDF download
  const filename = `Certificate_${eventName.replace(/\s+/g, "_")}_${userName.replace(/\s+/g, "_")}.pdf`;

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  res.setHeader("Content-Length", pdfBytes.length);

  // Send the PDF
  res.send(Buffer.from(pdfBytes));
});
