import React, { useEffect, useMemo, useRef, useState } from "react";
import FullCalendar, { EventClickArg, EventContentArg } from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EventDetailsModal, CalendarEventDetails } from "@/components/modals/EventDetailsModal";
import { calendarApi, type CalendarEventApiModel } from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from "@/hooks/use-mobile";

type CalendarView = "dayGridMonth" | "timeGridWeek" | "timeGridDay";

export default function CalendarPage() {
  const calendarRef = useRef<FullCalendar | null>(null);
  const isMobile = useIsMobile();
  const [currentView, setCurrentView] = useState<CalendarView>(
    window.innerWidth < 768 ? "timeGridDay" : "dayGridMonth",
  );
  const [selectedEvent, setSelectedEvent] = useState<CalendarEventDetails | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [events, setEvents] = useState<CalendarEventApiModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await calendarApi.getEvents();
        setEvents(data);
      } catch (err) {
        console.error("Failed to load calendar events", err);
        setError("Unable to load calendar events right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleToday = () => {
    const api = calendarRef.current?.getApi();
    api?.today();
  };

  const handleViewChange = (view: CalendarView) => {
    setCurrentView(view);
    const api = calendarRef.current?.getApi();
    api?.changeView(view);
  };

  const handleEventClick = (arg: EventClickArg) => {
    const found = events.find((e) => e.id === arg.event.id);
    if (!found) return;

    const start = new Date(found.start_time);
    const end = new Date(found.end_time);

    const details: CalendarEventDetails = {
      id: found.id,
      title: found.title,
      description: found.description,
      start,
      end,
      platform: found.platform,
      status: found.status === "APPROVED" || found.status === "PENDING" ? found.status : undefined,
      meetingLink: found.meet_link,
    };

    setSelectedEvent(details);
    setModalOpen(true);
  };

  const renderEventContent = (eventContent: EventContentArg) => {
    const { timeText, event } = eventContent;
    return (
      <div className="flex flex-col rounded-md border border-gray-200 bg-white px-2 py-1 shadow-sm">
        {timeText && (
          <span className="text-[11px] font-medium text-gray-500">{timeText}</span>
        )}
        <span className="truncate text-xs font-semibold text-gray-900">
          {event.title}
        </span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Calendar" description="View your upcoming meetings and events." />

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleToday}>
            Today
          </Button>
        </div>
        {!isMobile && (
          <div className="inline-flex overflow-hidden rounded-md border bg-white shadow-sm">
            <Button
              variant={currentView === "dayGridMonth" ? "default" : "ghost"}
              size="sm"
              className="rounded-none"
              onClick={() => handleViewChange("dayGridMonth")}
            >
              Month
            </Button>
            <Button
              variant={currentView === "timeGridWeek" ? "default" : "ghost"}
              size="sm"
              className="rounded-none border-l"
              onClick={() => handleViewChange("timeGridWeek")}
            >
              Week
            </Button>
            <Button
              variant={currentView === "timeGridDay" ? "default" : "ghost"}
              size="sm"
              className="rounded-none border-l"
              onClick={() => handleViewChange("timeGridDay")}
            >
              Day
            </Button>
          </div>
        )}
      </div>

      <Card className="border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
        <CardContent className="p-0">
          <div className="p-4">
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-80 w-full" />
              </div>
            ) : error ? (
              <div className="rounded-md border border-dashed border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            ) : events.length === 0 ? (
              <div className="rounded-md border border-dashed border-gray-200 bg-white/60 p-6 text-center text-sm text-gray-500">
                No calendar events yet. Approved meet-ups will appear here automatically.
              </div>
            ) : (
              <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView={currentView}
                headerToolbar={false}
                height="auto"
                events={events.map((e) => ({
                  id: e.id,
                  title: e.title,
                  start: e.start_time,
                  end: e.end_time,
                }))}
                eventClick={handleEventClick}
                dayMaxEvents={3}
                eventContent={renderEventContent}
                eventClassNames="!border-none !bg-transparent !p-0"
              />
            )}
          </div>
        </CardContent>
      </Card>

      <EventDetailsModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        event={selectedEvent}
      />
    </div>
  );
}



