import { useNavigate } from "react-router-dom";

export default function DashboardSidebar() {
  const navigate = useNavigate();

  const HomeIcon = () => (
    <svg
      viewBox="0 0 24 24"
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 9.75L12 3l9 6.75V21a.75.75 0 01-.75.75H3.75A.75.75 0 013 21V9.75z"
      />
    </svg>
  );

  const ChartIcon = () => (
    <svg
      viewBox="0 0 24 24"
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 3v18h18M9 17V9m4 8V5m4 12v-6"
      />
    </svg>
  );

  const CalendarIcon = () => (
    <svg
      viewBox="0 0 24 24"
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.75 3v2.25M17.25 3v2.25M3 8.25h18M4.5 21h15A1.5 1.5 0 0021 19.5V8.25H3V19.5A1.5 1.5 0 004.5 21z"
      />
    </svg>
  );

  const SettingsIcon = () => (
    <svg
      viewBox="0 0 24 24"
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.5 6h3l.7 2.1 2.1.7v3l-2.1.7-.7 2.1h-3l-.7-2.1L7.5 12V9.9l2.3-.7L10.5 6z"
      />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  );

  const BackArrowIcon = () => (
    <svg
      viewBox="0 0 24 24"
      className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 6l-6 6 6 6" />
    </svg>
  );

  const navItems = [
    { label: "Dashboard", icon: <HomeIcon /> },
    { label: "Participants", icon: <ChartIcon /> },
    { label: "Results", icon: <ChartIcon /> },
    { label: "Schedule", icon: <CalendarIcon /> },
    { label: "Events", icon: <CalendarIcon /> },
    { label: "Settings", icon: <SettingsIcon /> },
  ];

  return (
    <aside className="w-64 bg-slate-900 p-6 border-r border-slate-800 flex flex-col justify-between h-screen fixed">
      <div>
        <div className="flex items-center gap-3 mb-8">
          <img
            src="/images/dark_mode_logo.png"
            alt="Logo"
            className="h-9 w-9 rounded-xl"
          />
          <div>
            <p className="font-semibold text-slate-100">Athletix</p>
            <p className="text-xs text-slate-400">Admin Console</p>
          </div>
        </div>

        <nav className="flex flex-col gap-2">
          {navItems.map((item, i) => (
            <button
              key={item.label}
              className={`flex items-center gap-3 text-left px-3 py-2 rounded-xl hover:bg-slate-800 transition ${
                i === 0 ? "bg-slate-800" : ""
              }`}
            >
              <span className="w-5 h-5">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <button
        onClick={() => navigate("/")}
        className="group flex items-center gap-3 text-slate-300 hover:text-white px-3 py-2 
        rounded-xl border border-slate-700 hover:border-slate-500 transition"
      >
        <BackArrowIcon />
        Back to Home
      </button>
    </aside>
  );
}
