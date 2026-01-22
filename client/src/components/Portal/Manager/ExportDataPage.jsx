import { useState, useEffect } from "react";
import axios from "axios";
import { useTheme } from "../../../context/ThemeContext";

/* -------------------- SVG Icons -------------------- */
const ICONS = {
  download: (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
      <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
    </svg>
  ),
  excel: (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
      <path d="M21.17 3.25Q21.5 3.25 21.76 3.5 22 3.74 22 4.08V19.92Q22 20.26 21.76 20.5 21.5 20.75 21.17 20.75H7.83Q7.5 20.75 7.24 20.5 7 20.26 7 19.92V17H2.83Q2.5 17 2.24 16.76 2 16.5 2 16.17V7.83Q2 7.5 2.24 7.24 2.5 7 2.83 7H7V4.08Q7 3.74 7.24 3.5 7.5 3.25 7.83 3.25M7 13.06L8.18 15.28H9.97L8 12.06L9.93 8.89H8.22L7.13 10.9L7.09 10.96L7.06 11.03Q6.8 10.5 6.5 9.96 6.25 9.43 5.97 8.89H4.16L6.05 12.08L4 15.28H5.78M13.88 19.5V17H8.25V19.5M13.88 15.75V12.63H12V15.75M13.88 11.38V8.25H12V11.38M13.88 7V4.5H8.25V7M20.75 19.5V17H15.13V19.5M20.75 15.75V12.63H15.13V15.75M20.75 11.38V8.25H15.13V11.38M20.75 7V4.5H15.13V7Z" />
    </svg>
  ),
  filter: (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
      <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z" />
    </svg>
  ),
  event: (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
      <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11zM9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm-8 4H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z" />
    </svg>
  ),
  users: (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
    </svg>
  ),
  attendance: (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
    </svg>
  ),
  trophy: (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
      <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2z" />
    </svg>
  ),
  branch: (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
      <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z" />
    </svg>
  ),
  gender: (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
    </svg>
  ),
  year: (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
      <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
    </svg>
  ),
  course: (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
      <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9h-4v4h-2v-4H9V9h4V5h2v4h4v2z" />
    </svg>
  ),
  reset: (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
      <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
    </svg>
  ),
  chevronDown: (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
      <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
    </svg>
  ),
};

/* -------------------- Static Data Constants -------------------- */
// Course-branch mapping (matching backend courseBranchMap)
const COURSE_BRANCH_MAP = {
  "B.Tech": [
    { id: "cse", name: "Computer Science & Engineering" },
    { id: "it", name: "Information Technology" },
    { id: "ee", name: "Electrical Engineering" },
    { id: "me", name: "Mechanical Engineering" },
    { id: "ce", name: "Civil Engineering" },
    { id: "ece", name: "Electronics & Communication Engineering" },
    { id: "rai", name: "Robotics & AI" },
  ],
  "M.Tech": [
    { id: "cse", name: "Computer Science & Engineering" },
    { id: "ee", name: "Electronics Engineering" },
    { id: "me", name: "Mechanical Engineering" },
    { id: "pe", name: "Production Engineering" },
    { id: "gte", name: "Geo Technical Engineering" },
    { id: "se", name: "Structural Engineering" },
    { id: "ese", name: "Environmental Science & Engineering" },
  ],
  MBA: [
    { id: "fin", name: "Finance" },
    { id: "mkt", name: "Marketing" },
    { id: "hr", name: "Human Resource" },
  ],
  MCA: [{ id: "ca", name: "Computer Applications" }],
  "B.Voc.": [{ id: "id", name: "Interior Design" }],
  "B.Com": [{ id: "ent", name: "Entrepreneurship" }],
  BBA: [],
  BCA: [],
  "B.Arch": [],
};

const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year"];
const GENDERS = ["Male", "Female"];
const ATTENDANCE_OPTIONS = ["Present", "Absent", "Not Marked"];

export default function ExportDataPage() {
  const { darkMode } = useTheme();
  const API_URL = import.meta.env.VITE_API_URL;

  // Filter States
  const [selectedEvent, setSelectedEvent] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [attendanceFilter, setAttendanceFilter] = useState("");

  // Data States
  const [events, setEvents] = useState([]);
  const [branches, setBranches] = useState([]);
  const [exporting, setExporting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [fetchingPreview, setFetchingPreview] = useState(false);

  // Fetch events on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/user/events`, {
          withCredentials: true,
        });
        setEvents(response.data.data || []);
      } catch (err) {
        console.error("Failed to fetch events", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [API_URL]);

  // Update branches when course changes
  useEffect(() => {
    if (selectedCourse) {
      setBranches(COURSE_BRANCH_MAP[selectedCourse] || []);
      setSelectedBranch("");
    } else {
      setBranches([]);
      setSelectedBranch("");
    }
  }, [selectedCourse]);

  // Fetch filtered students preview when filters change
  useEffect(() => {
    const fetchFilteredStudents = async () => {
      if (!selectedEvent) {
        setFilteredStudents([]);
        return;
      }

      setFetchingPreview(true);
      try {
        const params = new URLSearchParams();
        params.append("eventId", selectedEvent);
        if (selectedGender) params.append("gender", selectedGender);
        if (selectedCourse) params.append("course", selectedCourse);
        if (selectedBranch) {
          // Find branch name from the id
          const branchObj = branches.find((b) => b.id === selectedBranch);
          params.append("branch", branchObj?.name || selectedBranch);
        }
        if (selectedYear) params.append("year", selectedYear);
        if (attendanceFilter)
          params.append("attendance", attendanceFilter.toLowerCase());

        const response = await axios.get(
          `${API_URL}/admin/export/preview?${params.toString()}`,
          { withCredentials: true },
        );
        setFilteredStudents(response.data.data || []);
      } catch (err) {
        console.error("Failed to fetch preview", err);
        setFilteredStudents([]);
      } finally {
        setFetchingPreview(false);
      }
    };

    fetchFilteredStudents();
  }, [
    selectedEvent,
    selectedGender,
    selectedCourse,
    selectedBranch,
    selectedYear,
    attendanceFilter,
    API_URL,
  ]);

  const resetFilters = () => {
    setSelectedEvent("");
    setSelectedGender("");
    setSelectedCourse("");
    setSelectedBranch("");
    setSelectedYear("");
    setAttendanceFilter("");
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (selectedEvent) count++;
    if (selectedGender) count++;
    if (selectedCourse) count++;
    if (selectedBranch) count++;
    if (selectedYear) count++;
    if (attendanceFilter) count++;
    return count;
  };

  const handleExport = async () => {
    if (!selectedEvent) {
      alert("Please select an event to export.");
      return;
    }

    setExporting(true);
    try {
      const params = new URLSearchParams();
      if (selectedEvent) params.append("eventId", selectedEvent);
      if (selectedGender) params.append("gender", selectedGender);
      if (selectedCourse) params.append("course", selectedCourse);
      if (selectedBranch) {
        // Find branch name from the id
        const branchObj = branches.find((b) => b.id === selectedBranch);
        params.append("branch", branchObj?.name || selectedBranch);
      }
      if (selectedYear) params.append("year", selectedYear);
      if (attendanceFilter)
        params.append("attendance", attendanceFilter.toLowerCase());

      const response = await axios.get(
        `${API_URL}/admin/export/event?${params.toString()}`,
        {
          withCredentials: true,
          responseType: "blob",
        },
      );

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      const eventName =
        events.find((e) => e.id === selectedEvent)?.name || "export";
      link.setAttribute(
        "download",
        `${eventName.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.xlsx`,
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export failed", err);
      alert("Failed to export data. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  // Custom Select Component
  const SelectField = ({
    label,
    icon,
    value,
    onChange,
    options,
    placeholder,
    disabled = false,
  }) => (
    <div className="space-y-1.5">
      <label
        className={`flex items-center gap-1.5 text-xs font-semibold ${
          darkMode ? "text-slate-400" : "text-slate-500"
        }`}
      >
        <span className={darkMode ? "text-slate-500" : "text-slate-400"}>
          {icon}
        </span>
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`w-full appearance-none px-4 py-3 pr-10 rounded-xl text-sm font-medium transition-all cursor-pointer ${
            darkMode
              ? "bg-slate-800/80 text-white border border-white/10 focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20"
              : "bg-white text-slate-800 border border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${
            value ? (darkMode ? "border-cyan-500/40" : "border-slate-400") : ""
          }`}
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option
              key={typeof opt === "string" ? opt : opt.id}
              value={typeof opt === "string" ? opt : opt.id}
            >
              {typeof opt === "string" ? opt : opt.name}
            </option>
          ))}
        </select>
        <div
          className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${darkMode ? "text-slate-500" : "text-slate-400"}`}
        >
          {ICONS.chevronDown}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div
        className={`relative overflow-hidden rounded-2xl p-5 sm:p-6 ${
          darkMode
            ? "bg-linear-to-br from-[#0c1929] via-[#0f172a] to-[#0c1525] ring-1 ring-white/8 shadow-[0_0_80px_-20px_rgba(56,189,248,0.25)]"
            : "bg-linear-to-br from-slate-50 via-white to-slate-100 ring-1 ring-slate-200 shadow-lg"
        }`}
      >
        {darkMode && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full blur-3xl opacity-20 bg-emerald-500" />
            <div className="absolute -bottom-32 -left-32 w-72 h-72 rounded-full blur-3xl opacity-15 bg-cyan-600" />
          </div>
        )}

        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${
                darkMode
                  ? "bg-linear-to-br from-emerald-500 to-teal-600"
                  : "bg-slate-900"
              }`}
            >
              {ICONS.excel}
            </div>
            <div>
              <h1
                className={`text-xl sm:text-2xl font-black tracking-tight ${
                  darkMode
                    ? "bg-linear-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent"
                    : "text-slate-800"
                }`}
              >
                Export Data
              </h1>
              <p
                className={`text-xs sm:text-sm ${darkMode ? "text-slate-500" : "text-slate-500"}`}
              >
                Generate event-wise Excel sheets with custom filters
              </p>
            </div>
          </div>

          {/* Active Filters Badge */}
          {getActiveFilterCount() > 0 && (
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${
                darkMode
                  ? "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30"
                  : "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-300"
              }`}
            >
              {ICONS.filter}
              {getActiveFilterCount()} filter
              {getActiveFilterCount() > 1 ? "s" : ""} active
            </div>
          )}
        </div>
      </div>

      {/* Filters Section */}
      <div
        className={`rounded-2xl overflow-hidden ${
          darkMode
            ? "bg-slate-900/80 ring-1 ring-white/8"
            : "bg-white ring-1 ring-slate-200 shadow-lg"
        }`}
      >
        {/* Section Header */}
        <div
          className={`px-5 py-4 flex items-center justify-between border-b ${
            darkMode ? "border-white/5" : "border-slate-100"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                darkMode
                  ? "bg-slate-800 text-slate-400"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {ICONS.filter}
            </div>
            <div>
              <h2
                className={`font-bold text-sm ${darkMode ? "text-white" : "text-slate-800"}`}
              >
                Filter Options
              </h2>
              <p
                className={`text-xs ${darkMode ? "text-slate-500" : "text-slate-500"}`}
              >
                Customize your export data
              </p>
            </div>
          </div>

          {getActiveFilterCount() > 0 && (
            <button
              onClick={resetFilters}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                darkMode
                  ? "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {ICONS.reset}
              Reset All
            </button>
          )}
        </div>

        {/* Filter Grid */}
        <div className="p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Event Filter - Required */}
            <div className="sm:col-span-2 lg:col-span-3">
              <SelectField
                label="Event (Required)"
                icon={ICONS.event}
                value={selectedEvent}
                onChange={setSelectedEvent}
                options={events}
                placeholder="Select an event..."
              />
            </div>

            {/* Gender Filter */}
            <SelectField
              label="Gender"
              icon={ICONS.gender}
              value={selectedGender}
              onChange={setSelectedGender}
              options={GENDERS}
              placeholder="All Genders"
            />

            {/* Course Filter */}
            <SelectField
              label="Course"
              icon={ICONS.course}
              value={selectedCourse}
              onChange={setSelectedCourse}
              options={Object.keys(COURSE_BRANCH_MAP)}
              placeholder="All Courses"
            />

            {/* Branch Filter */}
            <SelectField
              label="Branch"
              icon={ICONS.branch}
              value={selectedBranch}
              onChange={setSelectedBranch}
              options={branches}
              placeholder={
                selectedCourse ? "Select Branch" : "Select Course First"
              }
              disabled={!selectedCourse}
            />

            {/* Year Filter */}
            <SelectField
              label="Year"
              icon={ICONS.year}
              value={selectedYear}
              onChange={setSelectedYear}
              options={YEARS}
              placeholder="All Years"
            />

            {/* Attendance Filter */}
            <SelectField
              label="Attendance Status"
              icon={ICONS.attendance}
              value={attendanceFilter}
              onChange={setAttendanceFilter}
              options={ATTENDANCE_OPTIONS}
              placeholder="All Statuses"
            />
          </div>
        </div>
      </div>

      {/* Export Preview & Button */}
      <div
        className={`rounded-2xl overflow-hidden ${
          darkMode
            ? "bg-linear-to-br from-emerald-950/40 to-slate-900 ring-1 ring-emerald-500/20"
            : "bg-linear-to-br from-emerald-50 to-teal-50/50 ring-1 ring-emerald-200 shadow-lg"
        }`}
      >
        <div className="p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Preview Info */}
            <div className="flex-1">
              <h3
                className={`font-bold text-sm mb-2 ${darkMode ? "text-emerald-100" : "text-emerald-800"}`}
              >
                Export Preview
              </h3>
              <div
                className={`text-xs space-y-1 ${darkMode ? "text-emerald-300/70" : "text-emerald-700/80"}`}
              >
                <p>
                  <strong>Event:</strong>{" "}
                  {selectedEvent
                    ? events.find((e) => e.id === selectedEvent)?.name ||
                      "Selected"
                    : "Not selected"}
                </p>
                <p>
                  <strong>Filters:</strong>{" "}
                  {getActiveFilterCount() > 1
                    ? `${getActiveFilterCount() - 1} additional filter${getActiveFilterCount() > 2 ? "s" : ""} applied`
                    : "No additional filters"}
                </p>
                <p
                  className={`text-[10px] mt-2 ${darkMode ? "text-emerald-400/50" : "text-emerald-600/50"}`}
                >
                  Columns: Sr.No, Jersey No., Name, Branch, URN, Attendance
                </p>
              </div>
            </div>

            {/* Export Button */}
            <button
              onClick={handleExport}
              disabled={exporting || !selectedEvent}
              className={`flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-white transition-all shadow-lg min-w-[180px] ${
                selectedEvent
                  ? darkMode
                    ? "bg-linear-to-r from-emerald-500 to-teal-600 hover:brightness-110 shadow-emerald-500/25"
                    : "bg-linear-to-r from-emerald-500 to-teal-600 hover:brightness-110 shadow-emerald-500/30"
                  : "bg-slate-500 cursor-not-allowed opacity-60"
              } ${exporting ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              {exporting ? (
                <>
                  <span className="animate-spin h-5 w-5 border-2 border-white/30 rounded-full border-t-white" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  {ICONS.download}
                  <span>Export to Excel</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Students Preview Table */}
      {selectedEvent && (
        <div
          className={`rounded-2xl overflow-hidden ${
            darkMode
              ? "bg-slate-900/80 ring-1 ring-white/8"
              : "bg-white ring-1 ring-slate-200 shadow-lg"
          }`}
        >
          {/* Table Header */}
          <div
            className={`px-5 py-4 flex items-center justify-between border-b ${
              darkMode ? "border-white/5" : "border-slate-100"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                  darkMode
                    ? "bg-slate-800 text-slate-400"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {ICONS.users}
              </div>
              <div>
                <h2
                  className={`font-bold text-sm ${darkMode ? "text-white" : "text-slate-800"}`}
                >
                  Preview ({filteredStudents.length} students)
                </h2>
                <p
                  className={`text-xs ${darkMode ? "text-slate-500" : "text-slate-500"}`}
                >
                  {fetchingPreview
                    ? "Loading students..."
                    : filteredStudents.length > 0
                      ? "Students matching your filters"
                      : "No students match the selected filters"}
                </p>
              </div>
            </div>
          </div>

          {/* Table Content */}
          <div className="overflow-x-auto">
            {fetchingPreview ? (
              <div className="flex items-center justify-center py-16">
                <span
                  className={`animate-spin h-8 w-8 border-3 rounded-full ${
                    darkMode
                      ? "border-slate-700 border-t-emerald-500"
                      : "border-slate-200 border-t-emerald-600"
                  }`}
                />
              </div>
            ) : filteredStudents.length > 0 ? (
              <table className="w-full">
                <thead>
                  <tr
                    className={`${
                      darkMode
                        ? "bg-slate-800/50 text-slate-400"
                        : "bg-slate-50 text-slate-600"
                    }`}
                  >
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">
                      Sr. No.
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">
                      Jersey No.
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">
                      Branch
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">
                      URN
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider">
                      Attendance
                    </th>
                  </tr>
                </thead>
                <tbody
                  className={`divide-y ${
                    darkMode ? "divide-white/5" : "divide-slate-100"
                  }`}
                >
                  {filteredStudents.map((student, index) => (
                    <tr
                      key={student.id || index}
                      className={`transition-colors ${
                        darkMode ? "hover:bg-slate-800/30" : "hover:bg-slate-50"
                      }`}
                    >
                      <td
                        className={`px-4 py-3 text-sm font-medium ${
                          darkMode ? "text-slate-400" : "text-slate-500"
                        }`}
                      >
                        {index + 1}
                      </td>
                      <td
                        className={`px-4 py-3 text-sm font-bold ${
                          darkMode ? "text-emerald-400" : "text-emerald-600"
                        }`}
                      >
                        {student.jerseyNumber || "—"}
                      </td>
                      <td
                        className={`px-4 py-3 text-sm font-semibold ${
                          darkMode ? "text-white" : "text-slate-800"
                        }`}
                      >
                        {student.fullname || student.username || "—"}
                      </td>
                      <td
                        className={`px-4 py-3 text-sm ${
                          darkMode ? "text-slate-300" : "text-slate-700"
                        }`}
                      >
                        {student.branch || "—"}
                      </td>
                      <td
                        className={`px-4 py-3 text-sm font-mono ${
                          darkMode ? "text-slate-400" : "text-slate-600"
                        }`}
                      >
                        {student.urn || "—"}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-flex items-center justify-center w-20 px-2 py-1 rounded-md text-xs font-bold ${
                            student.attendance === "present"
                              ? darkMode
                                ? "bg-emerald-500/15 text-emerald-400"
                                : "bg-emerald-100 text-emerald-700"
                              : student.attendance === "absent"
                                ? darkMode
                                  ? "bg-red-500/15 text-red-400"
                                  : "bg-red-100 text-red-700"
                                : darkMode
                                  ? "bg-amber-500/15 text-amber-400"
                                  : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {student.attendance === "present"
                            ? "✓"
                            : student.attendance === "absent"
                              ? "✗"
                              : "○"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 px-4">
                <div
                  className={`w-16 h-16 rounded-xl flex items-center justify-center mb-4 ${
                    darkMode
                      ? "bg-slate-800 text-slate-600"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {ICONS.users}
                </div>
                <p
                  className={`text-sm font-semibold mb-1 ${
                    darkMode ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  No students found
                </p>
                <p
                  className={`text-xs ${
                    darkMode ? "text-slate-600" : "text-slate-400"
                  }`}
                >
                  Try adjusting your filters to see results
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Info Card */}
      <div
        className={`rounded-xl p-4 flex items-start gap-3 ${
          darkMode
            ? "bg-slate-800/50 ring-1 ring-white/5"
            : "bg-slate-50 ring-1 ring-slate-200"
        }`}
      >
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
            darkMode
              ? "bg-cyan-500/15 text-cyan-400"
              : "bg-cyan-100 text-cyan-600"
          }`}
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
            <path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
          </svg>
        </div>
        <div>
          <p
            className={`text-xs font-semibold ${darkMode ? "text-slate-300" : "text-slate-700"}`}
          >
            Export Tips
          </p>
          <ul
            className={`text-xs mt-1 space-y-0.5 ${darkMode ? "text-slate-500" : "text-slate-500"}`}
          >
            <li>• Select an event first - this is required for export</li>
            <li>• Use filters to narrow down the data you need</li>
            <li>
              • The exported Excel file will include all registered students
              matching your filters
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
