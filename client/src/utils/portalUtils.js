/* -------------------- Shared Portal Metadata & Utilities -------------------- */

// Branch shortforms for better Excel/UI fit
export const BRANCH_SHORTFORMS = {
  "Computer Science & Engineering": "CSE",
  "Information Technology": "IT",
  "Electrical Engineering": "EE",
  "Mechanical Engineering": "ME",
  "Civil Engineering": "CE",
  "Electronics & Communication Engineering": "ECE",
  "Robotics & AI": "RAI",
  "Electronics Engineering": "ELE",
  "Production Engineering": "PE",
  "Geo Technical Engineering": "GTE",
  "Structural Engineering": "SE",
  "Environmental Science & Engineering": "ESE",
  "Computer Applications": "CA",
  "Interior Design": "ID",
  Finance: "FIN",
  Marketing: "MKT",
  "Human Resource": "HR",
  Entrepreneurship: "ENT",
};

/**
 * Returns a detailed branch string based on course and branch.
 * @param {Object} student - Student object containing course and branch.
 * @returns {string} - Formatted branch string.
 */
export const getDetailedBranch = (student) => {
  const course = student?.course || "";
  const branch = student?.branch || "";
  const shortBranch = BRANCH_SHORTFORMS[branch] || branch;

  if (course === "B.Tech") return `B.Tech ${shortBranch}`;
  if (course === "M.Tech") return `M.Tech ${shortBranch}`;
  if (course === "B.Arch") return "B_ARCH";
  if (course === "B.Voc.") return "BVOC";
  if (course === "B.Com") return "BCOM";
  if (course === "MBA") return "MBA";
  if (course === "MCA") return "MCA";
  if (course === "BBA") return "BBA";
  if (course === "BCA") return "BCA";

  return shortBranch || course || "";
};

/**
 * Builds base row columns (common for all event types).
 * @param {Object} student - Student object.
 * @param {number} sr - Serial number.
 * @returns {Object} - Base row object.
 */
export const buildBaseRow = (student, sr) => ({
  "S.no": sr,
  "Jersey No": student?.jerseyNumber || "",
  Name: student?.fullname || student?.username || "",
  Branch: getDetailedBranch(student),
  URN: student?.urn || "",
});

/**
 * Builds extra columns based on event type (all blank for manual filling).
 * @param {string} eventType - "Track", "Field", or "Team".
 * @returns {Object} - Extra columns object.
 */
export const buildExtraColumns = (eventType) => {
  switch (eventType) {
    case "Field":
      return {
        Attendance: "",
        "Attempt 1": "",
        "Attempt 2": "",
      };
    case "Team":
      return {
        Attendance: "",
      };
    default: // Track
      return {
        Attendance: "",
      };
  }
};

/**
 * Builds complete Excel row for a student.
 * @param {Object} params - Object containing student, sr, and eventType.
 * @returns {Object} - Complete Excel row.
 */
export const buildExcelRow = ({ student, sr, eventType }) => ({
  ...buildBaseRow(student, sr),
  ...buildExtraColumns(eventType),
});

/**
 * Normalizes event type (Track/Field/Team).
 * @param {Object} event - Event object.
 * @returns {string} - Event type.
 */
export const getEventType = (event) => event?.type || "Track";

/**
 * Returns standard gender groups for sheet separation.
 * @returns {Array} - Array of gender group objects.
 */
export const getGenderGroups = () => [
  { label: "B", gender: "male" },
  { label: "G", gender: "female" },
];

/**
 * Detects gender from event name or category.
 * @param {string} input - Event name or category string.
 * @returns {string|null} - "male", "female", or null.
 */
export const getEventGenderFromName = (input = "") => {
  const name = input.toLowerCase();
  if (name.includes("(b)") || name.includes("boy")) return "male";
  if (name.includes("(g)") || name.includes("girl")) return "female";
  return null;
};

/**
 * Finds a student's entry for a specific event.
 * @param {Object} student - Student object.
 * @param {string} eventId - ID of the event.
 * @returns {Object|undefined} - Event entry if found.
 */
export const getEventEntry = (student, eventId) =>
  (student.selectedEvents || []).find(
    (se) => (se.eventId || se._id) === eventId,
  );

/**
 * Generates a sanitized sheet name for Excel (max 31 chars).
 * @param {string} name - Event name.
 * @param {string} suffix - e.g., "(B)" or "(G)".
 * @returns {string} - Sanitized name.
 */
export const buildSheetName = (name, suffix) =>
  `${name} (${suffix})`.slice(0, 31);

/**
 * Formats a worksheet with dynamic column widths and merges.
 * @param {Object} worksheet - XLSX worksheet object.
 * @param {Array} rows - Data rows in the sheet.
 */
export const formatWorksheet = (worksheet, rows) => {
  if (!rows || rows.length === 0) return;

  const headers = Object.keys(rows[0]);
  const wscols = headers.map((header) => {
    let max = header.toString().length;
    rows.forEach((row) => {
      const val = row[header] ? row[header].toString() : "";
      if (val.length > max) max = val.length;
    });

    let width = max + 2;
    if (header === "Name" || header === "Full Name")
      width = Math.max(15, max + 2);
    if (header === "S.no" || header === "S.No") width = Math.max(6, width);

    return { wch: width };
  });

  worksheet["!cols"] = wscols;

  const lastColIdx = headers.length - 1;
  worksheet["!merges"] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: lastColIdx } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: lastColIdx } },
  ];
};

/**
 * Formats event name with gender suffix (B) or (G).
 * @param {Object|string} event - Event object or name.
 * @returns {string} - Formatted name.
 */
export const formatEventName = (event) => {
  if (!event || typeof event === "string") return event;
  const name = event.name || "";
  const genderStr = (event.category || event.gender || "").toLowerCase();
  let suffix = "";
  if (
    genderStr.includes("girl") ||
    genderStr.includes("female") ||
    genderStr.includes("(g)")
  ) {
    suffix = " (G)";
  } else if (
    genderStr.includes("boy") ||
    genderStr.includes("male") ||
    genderStr.includes("(b)")
  ) {
    suffix = " (B)";
  }
  return name + suffix;
};
