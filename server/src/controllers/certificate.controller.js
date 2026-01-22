import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { User } from "../models/User.model.js";
import { SystemConfig } from "../models/SystemConfig.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateCertificate = asyncHandler(async (req, res) => {
  const currentUser = req.user;
  const { eventId, type } = req.params; // type = "winner" | "participation"

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
  if (!user) throw new ApiError(404, "User not found");

  /* ---------- VALIDATE EVENT ENROLLMENT (from user.selectedEvents) ---------- */
  const userEvent = user.selectedEvents?.find(
    (e) => e.eventId?.toString() === eventId
  );
  
  if (!userEvent) {
    throw new ApiError(400, "You are not enrolled in this event");
  }
  
  if (userEvent.status !== "present") {
    throw new ApiError(400, "Certificate allowed only for attended events");
  }

  /* ---------- WINNER VALIDATION ---------- */
  if (type === "winner" && (!userEvent.position || userEvent.position === 0)) {
    throw new ApiError(400, "Winner certificate requires a valid position");
  }

  /* ---------- GET EVENT INFO FROM selectedEvents ---------- */
  const eventName = String(userEvent.eventName || "Event");

  /* ---------- CHOOSE TEMPLATE ---------- */
  const templateFileName =
    type === "winner"
      ? "winnersCertificate.png"
      : "participationCertificate.png";

  const templatePath = path.join(
    __dirname,
    "..",
    "..",
    "public",
    "Certificates",
    templateFileName
  );

  if (!fs.existsSync(templatePath)) {
    throw new ApiError(500, "Certificate template not found");
  }

  const templateBytes = fs.readFileSync(templatePath);

  /* ---------- CREATE PDF ---------- */
  const pdfDoc = await PDFDocument.create();
  const templateImage = await pdfDoc.embedPng(templateBytes);

  const { width, height } = templateImage.scale(1);
  const page = pdfDoc.addPage([width, height]);

  page.drawImage(templateImage, {
    x: 0,
    y: 0,
    width,
    height,
  });

  /* ---------- FONTS ---------- */
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const textColor = rgb(0.1, 0.15, 0.3);
  const centerX = width / 2;

  /* ---------- TEXT DATA ---------- */
  const studentName = String(user.fullname || user.username);
  const courseBranch = user.branch
    ? `${user.course} - ${user.branch}`
    : user.course;

  const urn = String(user.urn || "N/A");

  // Position text for winner certificate
  const positionText =
    type === "winner"
      ? userEvent.position === 1
        ? "1st Position"
        : userEvent.position === 2
          ? "2nd Position"
          : "3rd Position"
      : null;

  /* ---------- DRAW NAME ---------- */
  const nameFontSize = 48;
  const nameWidth = fontBold.widthOfTextAtSize(studentName, nameFontSize);

  page.drawText(studentName, {
    x: centerX - nameWidth / 2,
    y: height - 770,
    size: nameFontSize,
    font: fontBold,
    color: textColor,
  });

  /* ---------- DRAW COURSE/BRANCH (after "of") ---------- */
  page.drawText(courseBranch, {
    x: 105,
    y: height - 350,
    size: 14,
    font: fontRegular,
    color: textColor,
  });

  /* ---------- DRAW URN (after "Roll Number") ---------- */
  page.drawText(urn, {
    x: width / 2 + 50,
    y: height - 350,
    size: 14,
    font: fontRegular,
    color: textColor,
  });

  /* ---------- DRAW TYPE-SPECIFIC TEXT ---------- */
  if (type === "winner") {
    // Winner certificate: "won ___ in ___"
    // Position after "won"
    page.drawText(positionText, {
      x: 105,
      y: height - 395,
      size: 14,
      font: fontBold,
      color: textColor,
    });

    // Event name after "in"
    page.drawText(eventName, {
      x: 230,
      y: height - 395,
      size: 14,
      font: fontRegular,
      color: textColor,
    });
  } else {
    // Participation certificate: "participated in ___"
    // Event name after "participated in"
    page.drawText(eventName, {
      x: 195,
      y: height - 395,
      size: 14,
      font: fontRegular,
      color: textColor,
    });
  }

  /* ---------- EXPORT PDF ---------- */
  const pdfBytes = await pdfDoc.save();

  const safeFileName = `Certificate_${eventName.replace(/\s+/g, "_")}_${studentName.replace(/\s+/g, "_")}_${type}.pdf`;

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${safeFileName}"`
  );
  res.send(Buffer.from(pdfBytes));
});
