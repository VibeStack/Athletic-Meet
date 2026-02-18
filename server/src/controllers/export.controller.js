import XLSX from "xlsx-js-style";
import { User } from "../models/User.model.js";
import { Event } from "../models/Events.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {
  buildExcelRow,
  buildBaseRow,
  getEventType,
  getGenderGroups,
  getEventGenderFromName,
  buildSheetName,
  formatWorksheet,
  sortEvents,
} from "../utils/excelUtils.js";

export const exportAllEvents = asyncHandler(async (req, res) => {
  // 1️⃣ Fetch users
  const users = await User.find({ isUserDetailsComplete: "true" })
    .select(
      "fullname course branch year jerseyNumber crn urn gender selectedEvents"
    )
    .lean();

  if (!users || users.length === 0) {
    throw new ApiError(404, "No students found");
  }

  // 2️⃣ Sort students by jersey number
  const completeStudents = users.sort((a, b) => {
    const numA = parseInt(a.jerseyNumber) || 0;
    const numB = parseInt(b.jerseyNumber) || 0;
    return numA - numB;
  });

  // 3️⃣ Create workbook
  const workbook = XLSX.utils.book_new();

  // 4️⃣ Build master rows
  const masterRows = completeStudents.map((student, idx) => ({
    ...buildBaseRow(student, idx + 1),
    Attendance: "",
  }));

  // 5️⃣ Create worksheet with title rows
  const worksheet = XLSX.utils.aoa_to_sheet([
    ["GNDEC Athletic Championship 2026"],
    ["All Registered Students"],
    [],
  ]);

  // 6️⃣ Insert data starting from A4
  XLSX.utils.sheet_add_json(worksheet, masterRows, {
    origin: "A4",
    skipHeader: false,
  });

  // 7️⃣ Apply formatting (columns, merges, styles, borders)
  formatWorksheet(XLSX, worksheet, masterRows);

  // 8️⃣ Append sheet
  XLSX.utils.book_append_sheet(workbook, worksheet, "Master List");

  // 9️⃣ Generate buffer
  const buffer = XLSX.write(workbook, {
    type: "buffer",
    bookType: "xlsx",
  });

  // 🔟 Send response
  const fileName = `GNDEC_Athletic_Championship_${
    new Date().toISOString().split("T")[0]
  }.xlsx`;

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

  res.send(buffer);
});



export const exportSingleEvent = asyncHandler(async (req, res) => {
  const { eventId } = req.params;

  if (!eventId) {
    throw new ApiError(400, "Event ID is required");
  }

  // Fetch event and users
  const [event, users] = await Promise.all([
    Event.findById(eventId).lean(),
    User.find({ isUserDetailsComplete: "true" })
      .select(
        "fullname course branch year jerseyNumber crn urn gender selectedEvents isUserDetailsComplete"
      )
      .lean(),
  ]);

  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  const completeStudents = users.sort((a, b) => {
    const numA = parseInt(a.jerseyNumber) || 0;
    const numB = parseInt(b.jerseyNumber) || 0;
    return numA - numB;
  });

  const eventName = event.name || "Event";
  const eventType = getEventType(event);
  const workbook = XLSX.utils.book_new();
  const sheetNames = new Set();

  // Detect gender from event name
  const eventGenderInput = getEventGenderFromName(eventName);
  const genderGroups = eventGenderInput
    ? [
        {
          label: eventGenderInput === "male" ? "B" : "G",
          gender: eventGenderInput,
        },
      ]
    : getGenderGroups();

  genderGroups.forEach(({ label, gender }) => {
    const genderLabelFull = gender === "male" ? "Male" : "Female";
    let sr = 1;
    const rows = [];

    completeStudents.forEach((student) => {
      if (student.gender?.toLowerCase() !== gender.toLowerCase()) return;

      const isRegistered = student.selectedEvents?.some(
        (se) => se.eventId?.toString() === eventId
      );
      if (!isRegistered) return;

      rows.push(
        buildExcelRow({
          student,
          sr: sr++,
          eventType,
        })
      );
    });

    if (rows.length === 0) return;

    let finalSheetName = buildSheetName(eventName, label);

    let counter = 1;
    const originalName = finalSheetName;
    while (sheetNames.has(finalSheetName)) {
      const suffix = ` (${counter++})`;
      finalSheetName = originalName.slice(0, 31 - suffix.length) + suffix;
    }
    sheetNames.add(finalSheetName);

    const worksheet = XLSX.utils.aoa_to_sheet([
      ["65th GNDEC Annual Athletic Championship 2026"],
      [`Event Name : ${eventName} (${genderLabelFull})`],
      [],
    ]);
    XLSX.utils.sheet_add_json(worksheet, rows, { origin: "A4" });
    formatWorksheet(XLSX, worksheet, rows);
    XLSX.utils.book_append_sheet(workbook, worksheet, finalSheetName);
  });

  if (workbook.SheetNames.length === 0) {
    throw new ApiError(404, "No students found for this event");
  }

  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
  const fileName = `${eventName}_${new Date().toISOString().split("T")[0]}.xlsx`;

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
  res.send(buffer);
});



export const exportWinners = asyncHandler(async (req, res) => {
  const [events, users] = await Promise.all([
    Event.find({}).lean(),
    User.find({ isUserDetailsComplete: "true" })
      .select(
        "fullname course branch year jerseyNumber crn urn gender selectedEvents isUserDetailsComplete"
      )
      .lean(),
  ]);

  const sortedEvents = sortEvents(events);
  const workbook = XLSX.utils.book_new();
  const sheetNames = new Set();

  // Define the winners column structure (used for all sheets)
  const winnerHeaders = ["S.No", "Jersey No", "Full Name","Course", "Branch", "Year", "URN", "CRN", "Position"];

  sortedEvents.forEach((event) => {
    const eventId = event._id.toString();
    const eventName = event.name || "Event";
    const category = event.category || "";

    // Build unique sheet name
    let sheetName = `${eventName} (${category})`.slice(0, 31);
    let counter = 1;
    const originalName = sheetName;
    while (sheetNames.has(sheetName)) {
      const suffix = ` ${counter++}`;
      sheetName = originalName.slice(0, 31 - suffix.length) + suffix;
    }
    sheetNames.add(sheetName);

    // Find all winners (position 1, 2, or 3)
    const winners = [];
    users.forEach((student) => {
      const eventEntry = student.selectedEvents?.find(
        (se) => se.eventId?.toString() === eventId && se.position > 0
      );

      if (eventEntry) {
        winners.push({
          student,
          position: eventEntry.position,
        });
      }
    });

    // Sort by position
    winners.sort((a, b) => a.position - b.position);

    // Build rows (may be empty if no winners)
    const rows = winners.map((w, idx) => ({
      "S.No": idx + 1,
      "Jersey No": w.student.jerseyNumber || "",
      "Full Name":
        w.student.fullname
          ?.split(" ")
          .map(
            (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          )
          .join(" ") || "",
      Course: w.student.course || "",
      Branch: w.student.branch || "",
      Year: w.student.year || "",
      URN: w.student.urn || "",
      CRN: w.student.crn || "",
      Position: w.position === 1 ? "1st" : w.position === 2 ? "2nd" : "3rd",
    }));

    // Create worksheet with title rows
    const worksheet = XLSX.utils.aoa_to_sheet([
      ["65th GNDEC Annual Athletic Championship 2026"],
      [`Event: ${eventName} (${category})`],
      [],
    ]);

    if (rows.length > 0) {
      // Has winners — add data rows
      XLSX.utils.sheet_add_json(worksheet, rows, { origin: "A4" });
      formatWorksheet(XLSX, worksheet, rows);
    } else {
      // No winners — add just the header row frame
      const headerRow = winnerHeaders.map((h) => h);
      XLSX.utils.sheet_add_aoa(worksheet, [headerRow], { origin: "A4" });

      // Build a dummy row structure for formatWorksheet to calculate cols
      const dummyRows = [Object.fromEntries(winnerHeaders.map((h) => [h, ""]))];
      formatWorksheet(XLSX, worksheet, dummyRows);
    }

    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  });

  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
  const fileName = `Athletic_Meet_Winners_${new Date().toISOString().split("T")[0]}.xlsx`;

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
  res.send(buffer);
});
