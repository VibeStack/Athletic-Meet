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
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ") || "",
  Branch: getDetailedBranch(student),
  URN: student?.urn || "",
});

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

export const getEventEntry = (student, eventId) =>
  (student.selectedEvents || []).find(
    (se) => (se.eventId || se._id) === eventId,
  );

export const buildSheetName = (name, suffix) =>
  `${name} (${suffix})`.slice(0, 31);

export const formatWorksheet = (worksheet, rows) => {
  if (!rows || rows.length === 0) return;

  const headers = Object.keys(rows[0]);
  const wscols = headers.map((header) => {
    let max = header.toString().length;
    rows.forEach((row) => {
      const val = row[header] ? row[header].toString() : "";
      if (val.length > max) max = val.length;
    });

    let width = max;
    if (header === "Full Name") width = Math.max(20,max);
    if (header === "S.No") width = Math.max(6, width);

    return { wch: width + 1 };
  });

  worksheet["!cols"] = wscols;

  // Merge title rows
  const lastColIdx = headers.length - 1;
  worksheet["!merges"] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: lastColIdx } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: lastColIdx } },
  ];

  // Row heights
  worksheet["!rows"] = [{ hpt: 28 }, { hpt: 22 }];

  // Title styles
  worksheet["A1"].s = {
    alignment: { horizontal: "center", vertical: "center" },
    font: { bold: true, sz: 16 },
  };

  worksheet["A2"].s = {
    alignment: { horizontal: "center", vertical: "center" },
    font: { bold: true, sz: 13 },
  };
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
