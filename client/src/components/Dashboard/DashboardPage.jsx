import DashboardSidebar from "./DashboardSidebar";
import DashboardMainContent from "./DashboardMainContent";

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex bg-slate-950 text-white relative">
      <DashboardSidebar />
      <DashboardMainContent />
    </div>
  );
}
