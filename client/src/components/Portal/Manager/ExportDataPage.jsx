import { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { useTheme } from "../../../context/ThemeContext";
import { sortEvents } from "../../../utils/eventSort.js";
import LoadingComponent from "../LoadingComponent";
import {
  DownloadIcon,
  ExcelIcon,
  FilterIcon,
  EventIcon,
  UsersIcon,
  AttendanceIcon,
  TrophyIcon,
  BranchIcon,
  GenderIcon,
  YearIcon,
  CourseIcon,
  ResetIcon,
  ChevronDownIcon,
} from "../../../icons/Portal/Manager/ExportDataIcons";

import {
  getEventType,
  getGenderGroups,
  getEventGenderFromName,
  getDetailedBranch,
  getEventEntry,
  buildSheetName,
  formatWorksheet,
  buildBaseRow,
  buildExtraColumns,
  buildExcelRow,
  formatEventName,
} from "../../../utils/portalUtils.js";

/* -------------------- SVG Icons -------------------- */
const ICONS = {
  download: <DownloadIcon className="w-5 h-5 fill-current" />,
  excel: <ExcelIcon className="w-5 h-5 fill-current" />,
  filter: <FilterIcon className="w-5 h-5 fill-current" />,
  event: <EventIcon className="w-5 h-5 fill-current" />,
  users: <UsersIcon className="w-5 h-5 fill-current" />,
  attendance: <AttendanceIcon className="w-5 h-5 fill-current" />,
  trophy: <TrophyIcon className="w-5 h-5 fill-current" />,
  branch: <BranchIcon className="w-5 h-5 fill-current" />,
  gender: <GenderIcon className="w-5 h-5 fill-current" />,
  year: <YearIcon className="w-5 h-5 fill-current" />,
  course: <CourseIcon className="w-5 h-5 fill-current" />,
  reset: <ResetIcon className="w-4 h-4 fill-current" />,
  chevronDown: <ChevronDownIcon className="w-4 h-4 fill-current" />,
};

/* -------------------- Static Data Constants -------------------- */
// No additional static data needed for the simplified view.

export default function ExportDataPage() {
  const { darkMode } = useTheme();
  const API_URL = import.meta.env.VITE_API_URL;

  // Filter State
  const [selectedEvent, setSelectedEvent] = useState("");

  // Data States
  const [events, setEvents] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [exporting, setExporting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch initial data on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [eventsRes, usersRes] = await Promise.all([
          axios.get(`${API_URL}/manager/allEvents`, { withCredentials: true }),
          axios.get(`${API_URL}/manager/export/allUsers`, {
            withCredentials: true,
          }),
        ]);

        // Extract events and users from the response
        const eventsData =
          eventsRes.data?.data?.events || eventsRes.data?.data || [];
        const usersData =
          usersRes.data?.data?.users || usersRes.data?.data || [];

        const sortedStudents = usersData
          .filter((u) => u.isUserDetailsComplete === "true")
          .sort((a, b) => {
            const numA = parseInt(a.jerseyNumber) || 0;
            const numB = parseInt(b.jerseyNumber) || 0;
            return numA - numB;
          });

        setEvents(sortEvents(eventsData));
        setAllStudents(sortedStudents);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch initial data", err);
        setError("Failed to sync database. Please refresh or try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [API_URL]);

  // Clean & Simple Filter for UI Preview
  const filteredStudents = selectedEvent
    ? allStudents.filter((student) =>
        student.selectedEvents?.some((se) => se.eventId === selectedEvent),
      )
    : allStudents;

  // Get current event details
  const currentEvent = events.find((e) => (e.id || e._id) === selectedEvent);
  const currentEventType = currentEvent?.type || "Track";
  const isFieldEvent = currentEventType === "Field";
  const isTeamEvent = currentEventType === "Team";

  const resetFilters = () => {
    setSelectedEvent("");
  };

  const handleExport = () => {
    setExporting(true);

    try {
      const workbook = XLSX.utils.book_new();
      const sheetNames = new Set(); // To tracking duplicate sheet names

      // 1. Create Master List Sheet - Only if no event is filtered
      // Filter for complete profiles only and sort by jersey number
      const completeStudents = allStudents
        .filter((s) => s.isUserDetailsComplete === "true")
        .sort((a, b) => {
          const numA = parseInt(a.jerseyNumber) || 0;
          const numB = parseInt(b.jerseyNumber) || 0;
          return numA - numB;
        });

      if (!selectedEvent) {
        const masterRows = completeStudents.map((student, idx) => ({
          ...buildBaseRow(student, idx + 1),
          Attendance: "",
        }));

        if (masterRows.length > 0) {
          const masterWs = XLSX.utils.aoa_to_sheet([
            ["Annual Athletic Meet 2026"],
            ["All Users"],
            [],
          ]);
          XLSX.utils.sheet_add_json(masterWs, masterRows, { origin: "A4" });
          formatWorksheet(masterWs, masterRows);
          XLSX.utils.book_append_sheet(workbook, masterWs, "Master List");
          sheetNames.add("Master List");
        }
      }

      // 2. Loop through events (filter if one is selected)
      const eventsToExport = selectedEvent
        ? events.filter((e) => (e.id || e._id) === selectedEvent)
        : events;

      eventsToExport.forEach((event) => {
        const eventId = event._id || event.id;
        const eventName = event.name || "Event";
        const eventType = getEventType(event);

        // Detect gender from event name - if (B) or (G) is in name, only create one sheet
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

          // Filter students for this event AND this gender
          completeStudents.forEach((student) => {
            // Check gender match
            if (student.gender?.toLowerCase() !== gender.toLowerCase()) return;

            // Check if registered for event
            const isRegistered = student.selectedEvents?.some(
              (se) => (se.eventId || se._id) === eventId,
            );
            if (!isRegistered) return;

            rows.push(
              buildExcelRow({
                student,
                sr: sr++,
                eventType,
              }),
            );
          });

          if (rows.length === 0) return;

          let finalSheetName = buildSheetName(eventName, label);

          // Handle duplicate sheet names (XLSX limitation)
          let counter = 1;
          const originalName = finalSheetName;
          while (sheetNames.has(finalSheetName)) {
            const suffix = ` (${counter++})`;
            finalSheetName = originalName.slice(0, 31 - suffix.length) + suffix;
          }
          sheetNames.add(finalSheetName);

          const worksheet = XLSX.utils.aoa_to_sheet([
            ["Annual Athletic Meet 2026"],
            [`Event Name : ${eventName} (${genderLabelFull})`],
            [],
          ]);
          XLSX.utils.sheet_add_json(worksheet, rows, { origin: "A4" });
          formatWorksheet(worksheet, rows);
          XLSX.utils.book_append_sheet(workbook, worksheet, finalSheetName);
        });
      });

      // 3. Safety check - prevent empty workbook error
      if (workbook.SheetNames.length === 0) {
        alert("No students found for export");
        setExporting(false);
        return;
      }

      // 4. One Workbook Download
      const fileName = selectedEvent
        ? `${currentEvent?.name || "Event"}_${new Date().toISOString().split("T")[0]}.xlsx`
        : `Athletic_Meet_${new Date().toISOString().split("T")[0]}.xlsx`;

      XLSX.writeFile(workbook, fileName);
    } catch (err) {
      console.error("Excel export failed", err);
      alert("Failed to export Excel file: " + err.message);
    } finally {
      setExporting(false);
    }
  };

  // Export All Winners - separate workbook with only winners (position 1, 2, 3)
  const handleExportWinners = () => {
    setExporting(true);

    try {
      const workbook = XLSX.utils.book_new();

      // Loop through all events to create worksheets
      events.forEach((event) => {
        const eventId = event._id || event.id;
        const eventName = event.name || "Event";
        const category = event.category || "";

        // Build sheet name: "EventName (Category)" e.g. "100m (Boys)"
        const sheetName = `${eventName} (${category})`.slice(0, 31);

        // Find all users who won in this event (position 1, 2, or 3)
        const winners = [];
        allStudents.forEach((student) => {
          const eventEntry = student.selectedEvents?.find(
            (se) => (se.eventId || se._id) === eventId && se.position > 0,
          );

          if (eventEntry) {
            winners.push({
              student,
              position: eventEntry.position,
            });
          }
        });

        // Sort by position (1st, 2nd, 3rd)
        winners.sort((a, b) => a.position - b.position);

        // Build rows for this event
        const rows = winners.map((w, idx) => ({
          "S.No": idx + 1,
          "Jersey No": w.student.jerseyNumber || "",
          "Full Name": w.student.fullname || w.student.username || "",
          URN: w.student.urn || "",
          Position: w.position === 1 ? "1st" : w.position === 2 ? "2nd" : "3rd",
        }));

        // Create worksheet with header
        const worksheet = XLSX.utils.aoa_to_sheet([
          ["Annual Athletic Meet 2026"],
          [`Event: ${eventName} (${category})`],
          [],
        ]);
        XLSX.utils.sheet_add_json(worksheet, rows, { origin: "A4" });

        // Apply formatting
        if (rows.length > 0) {
          formatWorksheet(worksheet, rows);
        }

        // Add worksheet to workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
      });

      // Safety check - prevent empty workbook error
      if (workbook.SheetNames.length === 0) {
        alert("No events found for export");
        setExporting(false);
        return;
      }

      // Download workbook
      const fileName = `Athletic_Meet_Winners_${new Date().toISOString().split("T")[0]}.xlsx`;
      XLSX.writeFile(workbook, fileName);
    } catch (err) {
      console.error("Excel export failed", err);
      alert("Failed to export Excel file");
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
              key={opt.id || opt._id || opt}
              value={opt.id || opt._id || String(opt)}
            >
              {formatEventName(opt)}
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

  // Show loading OR if we're technically "done" but have no data yet (prevents flicker/empty state)
  if (loading || (allStudents.length === 0 && !error)) {
    return (
      <LoadingComponent
        title="Export Sheets"
        message={
          allStudents.length === 0 && !loading
            ? "Waiting for student data..."
            : "Syncing student database..."
        }
        darkMode={darkMode}
      />
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-emerald-500 text-white rounded-lg"
          >
            Retry Sync
          </button>
        </div>
      </div>
    );
  }

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
                Generate event-wise Excel sheets
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Selection & Preview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Select Section */}
        <div
          className={`rounded-2xl flex flex-col ${
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
                  Select Event
                </h2>
                <p
                  className={`text-xs ${darkMode ? "text-slate-500" : "text-slate-500"}`}
                >
                  Choose to preview and export
                </p>
              </div>
            </div>

            {selectedEvent && (
              <button
                onClick={resetFilters}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  darkMode
                    ? "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {ICONS.reset}
                Reset
              </button>
            )}
          </div>

          {/* Option Grid */}
          <div className="p-5 flex-1 flex flex-col justify-center">
            <SelectField
              label="Event (Required)"
              icon={ICONS.event}
              value={selectedEvent}
              onChange={setSelectedEvent}
              options={events}
              placeholder="Select an event..."
            />
          </div>
        </div>

        {/* Export Preview & Button */}
        <div
          className={`rounded-2xl flex flex-col overflow-hidden ${
            darkMode
              ? "bg-linear-to-br from-emerald-950/40 to-slate-900 ring-1 ring-emerald-500/20"
              : "bg-linear-to-br from-emerald-50 to-teal-50/50 ring-1 ring-emerald-200 shadow-lg"
          }`}
        >
          <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between gap-4">
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
                  <strong>Output:</strong> One Excel file with{" "}
                  {selectedEvent ? "selected event" : "multiple sheets"}
                </p>
                <p
                  className={`text-[10px] mt-2 ${darkMode ? "text-emerald-400/50" : "text-emerald-600/50"}`}
                >
                  {selectedEvent
                    ? `Exporting: ${formatEventName(currentEvent)}`
                    : "Sheets: 100m (B), 100m (G), Long Jump (B)..."}
                </p>
                <p
                  className={`text-[10px] ${darkMode ? "text-emerald-400/50" : "text-emerald-600/50"}`}
                >
                  Track/Team: Attendance | Field: Attendance + 2 Attempts
                </p>
              </div>
            </div>

            {/* Export Buttons */}
            <div className="flex justify-center items-center gap-3 w-full">
              <button
                onClick={handleExport}
                disabled={exporting || loading}
                className={`flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-white transition-all shadow-lg w-full ${
                  darkMode
                    ? "bg-linear-to-r from-emerald-500 to-teal-600 hover:brightness-110 shadow-emerald-500/25"
                    : "bg-linear-to-r from-emerald-500 to-teal-600 hover:brightness-110 shadow-emerald-500/30"
                } ${exporting || loading ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                {exporting ? (
                  <>
                    <span className="animate-spin h-5 w-5 border-2 border-white/30 rounded-full border-t-white" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    {ICONS.download}
                    <span>
                      {selectedEvent
                        ? `Export ${formatEventName(currentEvent)}`
                        : "Export All Events"}
                    </span>
                  </>
                )}
              </button>

              <button
                onClick={handleExportWinners}
                disabled={exporting || loading}
                className={`flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm transition-all shadow-lg w-full ${
                  darkMode
                    ? "bg-slate-800 text-emerald-400 hover:bg-slate-700 ring-1 ring-emerald-500/20 shadow-emerald-950/20"
                    : "bg-white text-emerald-600 hover:bg-emerald-50 ring-1 ring-emerald-200 shadow-emerald-100/50"
                } ${exporting || loading ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                {ICONS.team}
                <span>Export All Winners</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Students Preview Table */}
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
                {selectedEvent ? "Event Preview" : "Global Student List"} (
                {filteredStudents.length})
              </h2>
              <p
                className={`text-xs ${darkMode ? "text-slate-500" : "text-slate-500"}`}
              >
                {filteredStudents.length > 0
                  ? selectedEvent
                    ? "Students registered for this event"
                    : "All students registered in the system"
                  : "No students found"}
              </p>
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          {filteredStudents.length > 0 ? (
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
                    S.no
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
                  <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider w-24">
                    Attendance
                  </th>
                  {isFieldEvent && (
                    <>
                      <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider w-24">
                        Attempt 1
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider w-24">
                        Attempt 2
                      </th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody
                className={`divide-y ${
                  darkMode ? "divide-white/5" : "divide-slate-100"
                }`}
              >
                {filteredStudents.map((student, index) => {
                  const studentEvents = student.selectedEvents || [];
                  const eventData = selectedEvent
                    ? studentEvents.find(
                        (se) =>
                          (se.eventId || se._id) === selectedEvent ||
                          se === selectedEvent,
                      ) || {}
                    : null;

                  return (
                    <tr
                      key={student.id || student._id || index}
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
                        {getDetailedBranch(student) || "—"}
                      </td>
                      <td
                        className={`px-4 py-3 text-sm font-mono ${
                          darkMode ? "text-slate-400" : "text-slate-600"
                        }`}
                      >
                        {student.urn || "—"}
                      </td>
                      <td className="px-4 py-3 text-center text-sm font-medium text-slate-400">
                        —
                      </td>
                      {isFieldEvent && (
                        <>
                          <td className="px-4 py-3 text-center text-sm font-medium text-slate-400">
                            —
                          </td>
                          <td className="px-4 py-3 text-center text-sm font-medium text-slate-400">
                            —
                          </td>
                        </>
                      )}
                    </tr>
                  );
                })}
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
                Selected event has no registrations yet
              </p>
            </div>
          )}
        </div>
      </div>

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
            Export Note
          </p>
          <p
            className={`text-[10px] sm:text-[11px] mt-0.5 ${darkMode ? "text-slate-500" : "text-slate-500"}`}
          >
            <strong>Track/Team:</strong> 1 blank column &nbsp;|&nbsp;{" "}
            <strong>Field:</strong> 2 blank columns (for attempts)
          </p>
        </div>
      </div>
    </div>
  );
}
