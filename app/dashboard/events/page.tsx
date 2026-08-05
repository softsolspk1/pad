"use client";

import { useEffect, useMemo, useState } from "react";
import { Calendar, Clock, MapPin, Loader2 } from "lucide-react";

type Event = {
  id: number;
  title: string;
  description: string | null;
  event_type: string;
  event_date: string;
  location: string | null;
  banner_url: string | null;
};

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [when, setWhen] = useState<"upcoming" | "past">("upcoming");
  const [type, setType] = useState<"all" | "conference" | "workshop">("all");

  useEffect(() => {
    fetch("/api/events")
      .then((res) => res.json())
      .then((data) => setEvents(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const now = Date.now();
    return events
      .filter((e) => (when === "upcoming" ? new Date(e.event_date).getTime() >= now : new Date(e.event_date).getTime() < now))
      .filter((e) => type === "all" || e.event_type === type)
      .sort((a, b) =>
        when === "upcoming"
          ? new Date(a.event_date).getTime() - new Date(b.event_date).getTime()
          : new Date(b.event_date).getTime() - new Date(a.event_date).getTime()
      );
  }, [events, when, type]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-crimson">Events</h2>

      <div className="flex flex-wrap gap-2">
        {(["upcoming", "past"] as const).map((w) => (
          <button
            key={w}
            onClick={() => setWhen(w)}
            className={`px-4 py-2 rounded-full text-sm font-semibold capitalize transition-colors ${
              when === w ? "bg-[var(--primary-color)] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {w} Events
          </button>
        ))}
        <div className="w-px bg-gray-200 mx-1" />
        {(["all", "conference", "workshop"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setType(t)}
            className={`px-4 py-2 rounded-full text-sm font-semibold capitalize transition-colors ${
              type === t ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16 text-muted"><Loader2 className="animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="card text-center text-muted py-10">No {when} events{type !== "all" ? ` (${type})` : ""} right now.</div>
      ) : (
        <div className="space-y-4">
          {filtered.map((event) => {
            const date = new Date(event.event_date);
            return (
              <div key={event.id} className="card p-0 overflow-hidden flex flex-col md:flex-row border border-red-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-full md:w-48 h-32 md:h-auto bg-gray-200 relative flex-shrink-0">
                  <img
                    src={event.banner_url || "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=400"}
                    className="w-full h-full object-cover"
                    alt={event.title}
                  />
                  <div className="absolute top-2 left-2 bg-white px-2 py-1 rounded text-xs font-bold text-crimson uppercase">
                    {event.event_type}
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-lg mb-1">{event.title}</h3>
                    {event.description && <p className="text-sm text-gray-600 mb-2 line-clamp-2">{event.description}</p>}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} /> {date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} /> {date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                      {event.location && (
                        <span className="flex items-center gap-1">
                          <MapPin size={14} /> {event.location}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
