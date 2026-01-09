import { useState } from "react";
import axios from "axios";

export default function ExportDataPage() {
  const [exportType, setExportType] = useState("all");
  const [filterEvent, setFilterEvent] = useState("All Events");
  const [filterBranch, setFilterBranch] = useState("All Branches");
  const [filterYear, setFilterYear] = useState("All Years");
  const [exporting, setExporting] = useState(false);
  const [exportHistory, setExportHistory] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL;

  const events = [
    "All Events",
    "100m Sprint",
    "200m Sprint",
    "400m Race",
    "Long Jump",
    "High Jump",
    "Shot Put",
  ];
  const branches = [
    "All Branches",
    "Computer Science",
    "Electronics",
    "Mechanical",
    "Civil",
  ];
  const years = ["All Years", "1st Year", "2nd Year", "3rd Year", "4th Year"];

  const exportOptions = [
    {
      id: "all",
      label: "All Students",
      description: "Complete student list",
      icon: "👥",
    },
    {
      id: "event",
      label: "By Event",
      description: "Students in specific event",
      icon: "🏃",
    },
    {
      id: "attendance",
      label: "Attendance",
      description: "Attendance status",
      icon: "✓",
    },
    {
      id: "certificates",
      label: "Certificates",
      description: "Certificate eligible",
      icon: "🏆",
    },
  ];

  const handleExport = async () => {
    setExporting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setExportHistory((prev) => [
      { type: exportType, time: new Date(), count: 45 },
      ...prev.slice(0, 4),
    ]);
    setExporting(false);
    alert("Export completed!");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Export Data</h1>
        <p className="text-gray-500 mt-1">
          Generate Excel sheets of student data
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {exportOptions.map((opt) => (
          <button
            key={opt.id}
            onClick={() => setExportType(opt.id)}
            className={`p-4 rounded-xl border-2 text-left transition-all ${
              exportType === opt.id
                ? "bg-cyan-50 border-cyan-400"
                : "bg-white border-gray-200 hover:border-gray-300"
            }`}
          >
            <span className="text-2xl">{opt.icon}</span>
            <p className="font-semibold text-gray-900 mt-2">{opt.label}</p>
            <p className="text-gray-500 text-xs">{opt.description}</p>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-gray-900 font-semibold mb-4">Filters</h3>
        <div className="grid grid-cols-3 gap-4">
          <select
            value={filterEvent}
            onChange={(e) => setFilterEvent(e.target.value)}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
          >
            {events.map((e) => (
              <option key={e}>{e}</option>
            ))}
          </select>
          <select
            value={filterBranch}
            onChange={(e) => setFilterBranch(e.target.value)}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
          >
            {branches.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
          <select
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
          >
            {years.map((y) => (
              <option key={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={handleExport}
        disabled={exporting}
        className="px-6 py-3 bg-linear-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg flex items-center gap-2 disabled:opacity-50"
      >
        {exporting ? "Generating..." : "📥 Export to Excel"}
      </button>

      {exportHistory.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-gray-900 font-semibold mb-3">Recent Exports</h3>
          {exportHistory.map((item, i) => (
            <div key={i} className="flex justify-between py-2 text-sm">
              <span className="text-gray-700">
                {item.type} • {item.count} records
              </span>
              <span className="text-gray-400">
                {item.time.toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
