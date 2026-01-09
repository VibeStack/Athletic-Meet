import { useMemo, useState } from "react";
import eventsData from "./data/events.json";
import upcomingData from "./data/upcoming.json";
import meta from "./data/meta.json";

import StatCard from "./cards/StatCard";
import FilterCard from "./cards/FilterCard";
import GenderChartCard from "./cards/GenderChartCard";
import EventTypeChartCard from "./cards/EventTypeChartCard";
import EventsTable from "./cards/EventsTable";
import UpcomingEventsCard from "./cards/UpcomingEventsCard";
import QuickActionsCard from "./cards/QuickActionsCard";
import LiveStatusCard from "./cards/LiveStatusCard";

export default function DashboardMainContent() {
  const [genderFilter, setGenderFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [minParticipants, setMinParticipants] = useState(0);

  const filteredEvents = useMemo(() => {
    return eventsData.filter((e) => {
      const total = e.b + e.g;
      const byGender =
        genderFilter === "all"
          ? true
          : genderFilter === e.gender ||
            (genderFilter === "boys" && e.gender === "boys") ||
            (genderFilter === "girls" && e.gender === "girls");
      const byType = typeFilter === "all" ? true : e.type === typeFilter;
      const byMin = total >= Number(minParticipants || 0);
      return byGender && byType && byMin;
    });
  }, [genderFilter, typeFilter, minParticipants]);

  const totals = useMemo(() => {
    const boys = filteredEvents.reduce((acc, e) => acc + e.b, 0);
    const girls = filteredEvents.reduce((acc, e) => acc + e.g, 0);
    const participants = boys + girls;
    const events = filteredEvents.length;
    return { boys, girls, participants, events };
  }, [filteredEvents]);

  const byType = useMemo(() => {
    const groups = { Track: 0, Field: 0, Relay: 0, Fun: 0 };
    filteredEvents.forEach((e) => {
      groups[e.type] += e.b + e.g;
    });
    return Object.entries(groups).map(([name, value]) => ({ name, value }));
  }, [filteredEvents]);


  const liveStatus = {
    meetTitle: "Annual Athletics Meet",
    eventsToday: 12,
    runningEvent: "100m Heats",
    nextEvent: "Long Jump Final",
    ground: "Ground A",
    nextEta: "in 15 mins",
    alert: "Reporting: 400m participants assemble near Track Gate."
  };

  return (
    <main className="flex-1 p-6 md:p-16 space-y-6 absolute right-0 bg-black">

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold">Athletix Dashboard</h1>
          <p className="text-slate-400 text-sm">Analytics overview for the annual athletics meet (admin-only)</p>
        </div>
        <div className="w-full sm:w-auto">
          <QuickActionsCard />
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Participants" value={totals.participants} hint="After filters" />
        <StatCard label="Events" value={totals.events} hint={`Filtered / ${eventsData.length} total`} />
        <StatCard label="Teams" value={meta.teams} hint="Registered" />
        <StatCard label="Departments" value={meta.departments} hint="Participating" />
      </div>

      <FilterCard
        genderFilter={genderFilter}
        setGenderFilter={setGenderFilter}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        minParticipants={minParticipants}
        setMinParticipants={setMinParticipants}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <GenderChartCard boys={totals.boys} girls={totals.girls} />
        <EventTypeChartCard data={byType} />
      </div>
      <LiveStatusCard status={liveStatus} />
      <EventsTable events={filteredEvents} />
      <UpcomingEventsCard events={upcomingData} />

      <p className="text-xs text-slate-500 text-center py-6">
        © {new Date().getFullYear()} Athletix • Minimal Elegant Sports Admin
      </p>
    </main>
  );
}
