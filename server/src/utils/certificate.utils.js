// ============================================================
//  certificate.utils.js  –  rewritten with node-canvas + PDFKit
// ============================================================
import { createCanvas, loadImage, registerFont } from "canvas";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ========================
//  DIMENSIONS
// ========================
const WIDTH = 900;
const HEIGHT = 635;

// ========================
//  FONT REGISTRATION
// ========================
const FONTS_DIR = path.join(__dirname, "..", "..", "public", "fonts");

const safeRegisterFont = (fileName, opts) => {
  const fullPath = path.join(FONTS_DIR, fileName);
  if (fs.existsSync(fullPath)) {
    registerFont(fullPath, opts);
  } else {
    console.warn(`⚠️  Font not found, skipping: ${fileName}`);
  }
};

// -------------------------------------------------------
//  ALL YOUR AVAILABLE FONTS (matched to your actual files)
// -------------------------------------------------------
safeRegisterFont("NewRocker-Regular.ttf", {
  family: "New Rocker",
});

// ========================
//  FONT OPTIONS
// ========================
//
//  ┌─────────────────────────┬──────────────────────────────────────┐
//  │  Font Name              │  Style / Best For                    │
//  ├─────────────────────────┼──────────────────────────────────────┤
//  │  "Dancing Script"       │  Cursive, elegant (great for names)  │
//  │  "Playfair Display"     │  Serif, formal, classic              │
//  │  "Merriweather"         │  Serif, readable, traditional        │
//  │  "League Spartan"       │  Bold, modern, clean                 │
//  │  "Nunito"               │  Rounded, friendly, clean            │
//  └─────────────────────────┴──────────────────────────────────────┘
//
//  HOW TO CHANGE FONT:
//  Just change the family name in FONT_PRESETS below.
//  Example:  'bold 32px "Dancing Script"'
//            '700 22px "Playfair Display"'
//            'bold 20px "Nunito"'

// ========================
//  ACTIVE FONT PRESETS
//  ↓↓↓ CHANGE FONT HERE ↓↓↓
// ========================
// const ACTIVE_FONT = "Dancing Script";       // cursive, elegant
// const ACTIVE_FONT = "Playfair Display";  // serif, formal
// const ACTIVE_FONT = "Merriweather";      // serif, traditional
// const ACTIVE_FONT = "League Spartan";    // bold, modern
// const ACTIVE_FONT = "Nunito";            // rounded, friendly
// const ACTIVE_FONT = "Open Sans";  // ← Change to this
const ACTIVE_FONT = "New Rocker";

// ← Change this one value to switch ALL fonts

const FONT_PRESETS = {
  name: { font: `700 32px "${ACTIVE_FONT}"`, color: "#000000" },
  primary: { font: `700 24px "${ACTIVE_FONT}"`, color: "#000000" },
};

// ========================
//  LAYOUT CONFIG
// ========================
const CERTIFICATE_LAYOUT = {
  participation: {
    name: {
      align: "page-center",
      y: HEIGHT - 290,
      ...FONT_PRESETS.name,
    },
    courseBranch: {
      startX: 80,
      endX: 550,
      y: HEIGHT - 240,
      align: "center-between",
      ...FONT_PRESETS.primary,
    },
    urn: {
      startX: 690,
      endX: 850,
      y: HEIGHT - 240,
      align: "center-between",
      ...FONT_PRESETS.primary,
    },
    eventName: {
      startX: 290,
      endX: 535,
      y: HEIGHT - 183,
      align: "center-between",
      ...FONT_PRESETS.primary,
    },
  },

  winner: {
    name: {
      align: "page-center",
      y: HEIGHT - 290,
      ...FONT_PRESETS.name,
    },
    courseBranch: {
      startX: 85,
      endX: 555,
      y: HEIGHT - 235,
      align: "center-between",
      ...FONT_PRESETS.primary,
    },
    urn: {
      startX: 690,
      endX: 850,
      y: HEIGHT - 235,
      align: "center-between",
      ...FONT_PRESETS.primary,
    },
    position: {
      startX: 130,
      endX: 300,
      y: HEIGHT - 175,
      align: "center-between",
      ...FONT_PRESETS.primary,
    },
    eventName: {
      startX: 330,
      endX: 500,
      y: HEIGHT - 175,
      align: "center-between",
      ...FONT_PRESETS.primary,
    },
  },
};

// ========================
//  DRAW HELPER
// ========================
const drawTextField = (
  ctx,
  { text, x, y, startX, endX, font, color, align }
) => {
  ctx.font = font;
  ctx.fillStyle = color;

  let drawX = x ?? 0;

  if (align === "page-center") {
    const measured = ctx.measureText(text);
    drawX = WIDTH / 2 - measured.width / 2;
  }

  if (align === "center-between") {
    const boxWidth = endX - startX;
    const measured = ctx.measureText(text);
    drawX = startX + (boxWidth - measured.width) / 2;
  }

  ctx.fillText(text, drawX, y);
};

// ========================
//  MAIN GENERATOR
// ========================
export const generateCertificatePDF = async ({ user, userEvent, type }) => {
  const layout = CERTIFICATE_LAYOUT[type];
  const eventName = String(userEvent.eventName || "Event");

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

  const templateImage = await loadImage(templatePath);

  // Step 1: Create canvas and draw certificate with text
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(templateImage, 0, 0, WIDTH, HEIGHT);

  const studentName = String(user.fullname || user.username);
  const courseBranch = user.branch
    ? `${user.course} - ${user.branch}`
    : user.course;
  const urn = String(user.urn || "N/A");

  drawTextField(ctx, { text: studentName, ...layout.name });
  drawTextField(ctx, { text: courseBranch, ...layout.courseBranch });
  drawTextField(ctx, { text: urn, ...layout.urn });

  if (type === "winner") {
    const positionText =
      userEvent.position === 1
        ? "1st Position"
        : userEvent.position === 2
          ? "2nd Position"
          : "3rd Position";

    drawTextField(ctx, { text: positionText, ...layout.position });
  }

  drawTextField(ctx, { text: eventName, ...layout.eventName });

  // Step 2: Convert canvas to PNG buffer
  const pngBuffer = canvas.toBuffer("image/png");

  // Step 3: Create PDF and embed the PNG image
  const pdf = new PDFDocument({
    size: [WIDTH, HEIGHT],
    margins: { top: 0, bottom: 0, left: 0, right: 0 }
  });

  const chunks = [];
  
  return new Promise((resolve, reject) => {
    pdf.on('data', (chunk) => chunks.push(chunk));
    pdf.on('end', () => {
      const pdfBytes = Buffer.concat(chunks);
      resolve({ pdfBytes, studentName, eventName });
    });
    pdf.on('error', reject);

    // Embed the certificate image into the PDF
    pdf.image(pngBuffer, 0, 0, {
      width: WIDTH,
      height: HEIGHT
    });

    pdf.end();
  });
};