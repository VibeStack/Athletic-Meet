import { useNavigate } from "react-router-dom";

import {
  ExportIcon,
  ResultsIcon,
  UserAddIcon,
  ChevronRightIcon,
} from "../../../../../icons/Portal/Manager/Analytics/QuickActionsIcons";

export default function QuickActionsCard({ darkMode }) {
  const navigate = useNavigate();

  const actions = [
    {
      label: "Export Data",
      icon: <ExportIcon className="w-5 h-5" />,
      path: "/portal/manager/export",
      color: "emerald",
    },
    {
      label: "Event Results",
      icon: <ResultsIcon className="w-5 h-5" />,
      path: "/portal/manager/event-results",
      color: "blue",
    },
    {
      label: "See All Users",
      icon: <UserAddIcon className="w-5 h-5" />,
      path: "/portal/admin/users",
      color: "amber",
    },
  ];

  return (
    <div
      className={`rounded-2xl p-6 ${
        darkMode
          ? "bg-slate-900/80 border border-slate-800/50"
          : "bg-white border border-slate-200/50 shadow-lg"
      }`}
    >
      <h3
        className={`text-lg font-semibold mb-6 ${darkMode ? "text-white" : "text-slate-900"}`}
      >
        Quick Manager Actions
      </h3>

      <div className="grid grid-cols-1 gap-3">
        {actions.map((action, idx) => (
          <button
            key={idx}
            onClick={() => navigate(action.path)}
            className={`flex items-center gap-4 p-4 rounded-xl transition-transform group ${
              darkMode
                ? "bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-white"
                : "bg-slate-50 hover:bg-white hover:shadow-md text-slate-600 hover:text-slate-900 border border-transparent hover:border-slate-200"
            }`}
          >
            <div
              className={`p-2 rounded-lg ${
                darkMode
                  ? `bg-${action.color}-500/10 text-${action.color}-400 group-hover:bg-${action.color}-500/20`
                  : `bg-${action.color}-100 text-${action.color}-600 group-hover:bg-${action.color}-200`
              }`}
            >
              {action.icon}
            </div>
            <span className="font-semibold text-sm">{action.label}</span>
            <ChevronRightIcon className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        ))}
      </div>
    </div>
  );
}
