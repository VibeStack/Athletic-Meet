import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * PDF COORDINATE SYSTEM (pdf-lib)
 * ------------------------------
 * Origin (0,0) is BOTTOM-LEFT.
 * x -> left to right
 * y -> bottom to top
 */

const CERTIFICATE_WIDTH = 900;
const CERTIFICATE_HEIGHT = 635;

const SHARED_TEXT_COLOR = rgb(0, 0, 0);

/* ===========================
   CERTIFICATE LAYOUT CONFIG
   (ALL VALUES NOW RELATIVE
    TO 900 x 635)
   =========================== */

const CERTIFICATE_LAYOUT = {
  participation: {
    // Student name (centered on full page)
    name: {
      align: "page-center",
      y: 290,
      font: StandardFonts.HelveticaBold,
      size: 28,
      color: SHARED_TEXT_COLOR,
    },

    // Course / Branch
    courseBranch: {
      startX: 80,
      endX: 550,
      y: 240,
      font: StandardFonts.HelveticaBold,
      size: 20,
      color: SHARED_TEXT_COLOR,
      align: "center-between",
    },

    // Roll number
    urn: {
      startX: 690,
      endX: 850,
      y: 240,
      font: StandardFonts.HelveticaBold,
      size: 20,
      color: SHARED_TEXT_COLOR,
      align: "center-between",
    },

    // Event name
    eventName: {
      startX: 290,
      endX: 535,
      y: 183,
      font: StandardFonts.HelveticaBold,
      size: 20,
      color: SHARED_TEXT_COLOR,
      align: "center-between",
    },
  },

  winner: {
    name: {
      align: "page-center",
      y: 290,
      font: StandardFonts.HelveticaBold,
      size: 28,
      color: SHARED_TEXT_COLOR,
    },

    // Course / Branch
    courseBranch: {
      startX: 85,
      endX: 555,
      y: 235,
      font: StandardFonts.HelveticaBold,
      size: 20,
      color: SHARED_TEXT_COLOR,
      align: "center-between",
    },

    // Roll number
    urn: {
      startX: 690,
      endX: 850,
      y: 235,
      font: StandardFonts.HelveticaBold,
      size: 20,
      color: SHARED_TEXT_COLOR,
      align: "center-between",
    },

    position: {
      startX: 130,
      endX: 300,
      y: 175,
      font: StandardFonts.HelveticaBold,
      size: 20,
      color: SHARED_TEXT_COLOR,
      align: "center-between",
    },

    eventName: {
      startX: 330,
      endX: 500,
      y: 175,
      font: StandardFonts.HelveticaBold,
      size: 20,
      color: SHARED_TEXT_COLOR,
      align: "center-between",
    },
  },
};

/* ===========================
   TEXT DRAW HELPER
   =========================== */

const drawTextField = ({
  page,
  text,
  x,
  y,
  startX,
  endX,
  font,
  size,
  color,
  align,
  pageWidth,
}) => {
  let drawX = x ?? 0;

  // Center across full page
  if (align === "page-center") {
    const textWidth = font.widthOfTextAtSize(text, size);
    drawX = pageWidth / 2 - textWidth / 2;
  }

  // Center inside a defined horizontal range
  if (align === "center-between") {
    const boxWidth = endX - startX;
    const textWidth = font.widthOfTextAtSize(text, size);
    drawX = startX + (boxWidth - textWidth) / 2;
  }

  page.drawText(text, {
    x: drawX,
    y,
    size,
    font,
    color,
  });
};

/* ===========================
   MAIN PDF GENERATOR
   =========================== */

export const generateCertificatePDF = async ({ user, userEvent, type }) => {
  const layout = CERTIFICATE_LAYOUT[type];
  const eventName = String(userEvent.eventName || "Event");

  /* ---------- LOAD TEMPLATE ---------- */
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
    throw new Error("Certificate template not found");
  }

  const pdfDoc = await PDFDocument.create();

  const templateImage = await pdfDoc.embedPng(fs.readFileSync(templatePath));

  /* ---------- FIXED PAGE SIZE ---------- */
  const page = pdfDoc.addPage([CERTIFICATE_WIDTH, CERTIFICATE_HEIGHT]);

  /* ---------- SCALE IMAGE TO FIT PAGE ---------- */
  page.drawImage(templateImage, {
    x: 0,
    y: 0,
    width: CERTIFICATE_WIDTH,
    height: CERTIFICATE_HEIGHT,
  });

  /* ---------- EMBED FONTS ---------- */
  const fonts = {
    [StandardFonts.Helvetica]: await pdfDoc.embedFont(StandardFonts.Helvetica),
    [StandardFonts.HelveticaBold]: await pdfDoc.embedFont(
      StandardFonts.HelveticaBold
    ),
  };

  /* ---------- DATA ---------- */
  const studentName = String(user.fullname || user.username);
  const courseBranch = user.branch
    ? `${user.course} - ${user.branch}`
    : user.course;
  const urn = String(user.urn || "N/A");

  /* ---------- DRAW TEXT ---------- */

  // Name
  drawTextField({
    page,
    text: studentName,
    ...layout.name,
    font: fonts[layout.name.font],
    pageWidth: CERTIFICATE_WIDTH,
  });

  if (type === "participation") {
    drawTextField({
      page,
      text: courseBranch,
      ...layout.courseBranch,
      font: fonts[layout.courseBranch.font],
      pageWidth: CERTIFICATE_WIDTH,
    });

    drawTextField({
      page,
      text: urn,
      ...layout.urn,
      font: fonts[layout.urn.font],
      pageWidth: CERTIFICATE_WIDTH,
    });

    drawTextField({
      page,
      text: eventName,
      ...layout.eventName,
      font: fonts[layout.eventName.font],
      pageWidth: CERTIFICATE_WIDTH,
    });
  }

  if (type === "winner") {
    const positionText =
      userEvent.position === 1
        ? "1st Position"
        : userEvent.position === 2
          ? "2nd Position"
          : "3rd Position";

    // ✅ Course / Branch
    drawTextField({
      page,
      text: courseBranch,
      ...layout.courseBranch,
      font: fonts[layout.courseBranch.font],
      pageWidth: CERTIFICATE_WIDTH,
    });

    // ✅ Roll Number
    drawTextField({
      page,
      text: urn,
      ...layout.urn,
      font: fonts[layout.urn.font],
      pageWidth: CERTIFICATE_WIDTH,
    });

    // Position
    drawTextField({
      page,
      text: positionText,
      ...layout.position,
      font: fonts[layout.position.font],
      pageWidth: CERTIFICATE_WIDTH,
    });

    // Event Name
    drawTextField({
      page,
      text: eventName,
      ...layout.eventName,
      font: fonts[layout.eventName.font],
      pageWidth: CERTIFICATE_WIDTH,
    });
  }

  const pdfBytes = await pdfDoc.save();
  return { pdfBytes, studentName, eventName };
};
