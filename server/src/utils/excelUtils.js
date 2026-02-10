/**
 * Excel Utilities for Backend Export
 * Full styling support with xlsx-js-style on Node.js
 */

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

// Common cell styles - Clean professional look with normal borders
const BORDER_STYLE = {
  top: { style: "thin", color: { rgb: "000000" } },
  bottom: { style: "thin", color: { rgb: "000000" } },
  left: { style: "thin", color: { rgb: "000000" } },
  right: { style: "thin", color: { rgb: "000000" } },
};

export const STYLES = {
  title: {
    font: { bold: true, sz: 16, color: { rgb: "000000" } },
    alignment: { horizontal: "center", vertical: "center" },
  },
  subtitle: {
    font: { bold: true, sz: 13, color: { rgb: "333333" } },
    alignment: { horizontal: "center", vertical: "center" },
  },
  header: {
    font: { bold: true, sz: 10, color: { rgb: "FFFFFF" } },
    alignment: { horizontal: "center", vertical: "center" },
    fill: { fgColor: { rgb: "374151" } }, // Dark gray header
    border: BORDER_STYLE,
  },
  cell: {
    font: { sz: 10, color: { rgb: "000000" } },
    alignment: { horizontal: "center", vertical: "center" },
    border: BORDER_STYLE,
  },
  cellLeft: {
    font: { sz: 10, color: { rgb: "000000" } },
    alignment: { horizontal: "left", vertical: "center" },
    border: BORDER_STYLE,
  },
};

export const getDetailedBranch = (student) => {
  const course = student?.course || "";
  const branch = student?.branch || "";
  const shortBranch = BRANCH_SHORTFORMS[branch] || branch;

  if (course === "B.Tech") return `B.Tech - ${shortBranch}`;
  else if (course === "M.Tech") return `M.Tech - ${shortBranch}`;
  else return course;
};

export const buildBaseRow = (student, sr) => ({
  "S.No": sr,
  "Jersey No": student?.jerseyNumber || "",
  "Full Name":
    student?.fullname
      ?.split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ") || "",
  Branch: getDetailedBranch(student),
  "URN / CRN": student?.urn + " / " + student?.crn || "",
});

export const buildExtraColumns = (eventType) => {
  switch (eventType) {
    case "Field":
      return {
        Attendance: "",
        "Att. 1": "",
        "Att. 2": "",
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

export const buildExcelRow = ({ student, sr, eventType }) => ({
  ...buildBaseRow(student, sr),
  ...buildExtraColumns(eventType),
});

export const getEventType = (event) => event?.type || "Track";

export const getGenderGroups = () => [
  { label: "B", gender: "male" },
  { label: "G", gender: "female" },
];

export const getEventGenderFromName = (input = "") => {
  const name = input.toLowerCase();
  if (name.includes("(b)") || name.includes("boy")) return "male";
  if (name.includes("(g)") || name.includes("girl")) return "female";
  return null;
};

export const buildSheetName = (name, suffix) =>
  `${name} (${suffix})`.slice(0, 31);


export const formatWorksheet = (XLSX, worksheet, rows) => {
  if (!rows || rows.length === 0) return;

  const headers = Object.keys(rows[0]);
  const numCols = headers.length;
  const numRows = rows.length;

  // Calculate column widths based on content
  const wscols = headers.map((header) => {
    let max = header.toString().length;
    rows.forEach((row) => {
      const val = row[header] ? row[header].toString() : "";
      if (val.length > max) max = val.length;
    });

    let width = max;
    if (header === "S.No") width = Math.max(2);
    if (header === "Jersey No") width = Math.max(6);
    if (header === "Full Name") width = Math.max(width/1.25);
    if (header === "Branch") width = Math.max(width/1.25);
    if (header === "URN / CRN") width = Math.max(width/1.25);
    if (header === "Attendance") width = Math.max(width/1.25);
    if (header.includes("Attempt")) width = Math.max(width/2);
    
    return { wch: width + 1 };
  });

  worksheet["!cols"] = wscols;

  // Merge title rows (rows 1 and 2)
  const lastColLetter = XLSX.utils.encode_col(numCols - 1);
  worksheet["!merges"] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: numCols - 1 } }, // Title row
    { s: { r: 1, c: 0 }, e: { r: 1, c: numCols - 1 } }, // Subtitle row
  ];

  // Row heights
  worksheet["!rows"] = [{ hpt: 32 }, { hpt: 26 }, { hpt: 14 }, { hpt: 24 }];

  // Apply title styles
  if (worksheet["A1"]) worksheet["A1"].s = STYLES.title;
  if (worksheet["A2"]) worksheet["A2"].s = STYLES.subtitle;

  // Apply header row styles (row 4, index 3)
  for (let c = 0; c < numCols; c++) {
    const cellRef = XLSX.utils.encode_cell({ r: 3, c });
    if (worksheet[cellRef]) {
      worksheet[cellRef].s = STYLES.header;
    }
  }

  // Apply data cell styles (rows 5+, index 4+)
  for (let r = 4; r < 4 + numRows; r++) {
    for (let c = 0; c < numCols; c++) {
      const cellRef = XLSX.utils.encode_cell({ r, c });
      if (worksheet[cellRef]) {
        // Full Name and Branch should be left-aligned
        if (headers[c] === "Full Name" || headers[c] === "Branch") {
          worksheet[cellRef].s = STYLES.cellLeft;
        } else {
          worksheet[cellRef].s = STYLES.cell;
        }
      }
    }
  }
};

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

/**
 * Sort events by category order and then name
 */
export const sortEvents = (events) => {
  const categoryOrder = { Boys: 1, Girls: 2, Mixed: 3 };
  return [...events].sort((a, b) => {
    const catA = categoryOrder[a.category] || 99;
    const catB = categoryOrder[b.category] || 99;
    if (catA !== catB) return catA - catB;
    return (a.name || "").localeCompare(b.name || "");
  });
};
