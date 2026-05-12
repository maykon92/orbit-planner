import { useEffect, useState } from "react";
import { Box, Typography, Grid, Card, CardContent, Chip } from "@mui/material";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

import MainLayout from "../../layouts/MainLayout";
import EventDetailsModal from "../../components/EventDetailsModal";
import CreateItemModal from "../../components/CreateItemModal";
import { getTabs } from "../../services/tabService";
import api from "../../services/api";

const LifeDashboard = () => {
  const today = new Date().toISOString().split("T")[0];
  const [tabs, setTabs] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [openEventModal, setOpenEventModal] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTabId, setSelectedTabId] = useState("");

  useEffect(() => {
    const loadData = async () => {
      const tabsData = await getTabs();
      setTabs(tabsData);

      const allEvents = [];

      for (const tab of tabsData) {
        const { data } = await api.get(`/items/tab/${tab._id}`);

        const items = data.items || data;

        items.forEach((item) => {
          if (item.data?.startDate) {
            allEvents.push({
              id: item._id,
              title: item.title,
              start: item.data?.startDate,
              end: item.data?.endDate,
              backgroundColor:
                item.type === "travel"
                  ? "#2563eb"
                  : item.type === "movies"
                  ? "#7c3aed"
                  : item.type === "books"
                  ? "#16a34a"
                  : item.type === "agenda"
                  ? "#ea580c"
                  : "#334155",
              borderColor: "transparent",
              extendedProps: {
                type: item.type,
                description: item.description,
                itemData: item.data,
              },
            });
          }
        });
      }

      setEvents(allEvents);
    };

    loadData();
  }, []);

  const todayEvents = events.filter((event) => {
    const start = event.start;
    const end = event.end || event.start;

    return today >= start && today <= end;
  });

  return (
    <MainLayout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" fontWeight="bold" sx={{ color: "#f8fafc" }}>
          Dark Life Planner
        </Typography>

        <Typography sx={{ color: "#94a3b8", mt: 1 }}>
          Do life with focus, memory and intention.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Box
            sx={{
              p: 3,
              borderRadius: 4,
              background: "#0f172a",
              border: "1px solid #1f2937",
              color: "#f8fafc",

              "& .fc": {
                color: "#cbd5e1",
              },

              "& .fc-toolbar-title": {
                color: "#f8fafc",
                fontSize: "1.4rem",
              },

              "& .fc-button": {
                background: "#1e293b",
                border: "1px solid #334155",
                color: "#f8fafc",
              },

              "& .fc-button:hover": {
                background: "#334155",
              },

              "& .fc-daygrid-day": {
                background: "#020617",
                borderColor: "#1f2937",
              },

              "& .fc-scrollgrid": {
                borderColor: "#1f2937",
              },

              "& .fc-col-header-cell": {
                background: "#111827",
                borderColor: "#1f2937",
              },

              "& .fc-daygrid-event": {
                background: "#2563eb",
                border: "none",
                borderRadius: "8px",
                padding: "2px 6px",
              },
              "& .fc-theme-standard td, & .fc-theme-standard th": {
                borderColor: "#1f2937",
              },

              "& .fc-daygrid-day-number": {
                color: "#94a3b8",
                padding: "8px",
              },

              "& .fc-day-today": {
                background: "rgba(37, 99, 235, 0.12) !important",
              },

              "& .fc-event": {
                borderRadius: "8px",
                padding: "3px 6px",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
              },

              "& .fc-daygrid-day:hover": {
                background: "rgba(30, 41, 59, 0.55)",
              },

              "& .fc-toolbar": {
                marginBottom: "24px",
              },

              "& .fc-toolbar-title": {
                color: "#f8fafc",
                fontSize: "1.5rem",
                fontWeight: 700,
              },
            }}
          >
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              events={events}
              height="auto"
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth",
              }}
              eventClick={(info) => {
                setSelectedEvent(info.event);
                setOpenEventModal(true);
              }}
              dateClick={(info) => {
                setSelectedDate(info.dateStr);
                setSelectedTabId(tabs[0]?._id || "");
                setOpenCreateModal(true);
              }}
            />
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <Box
            sx={{
              p: 3,
              borderRadius: 4,
              background: "#0f172a",
              border: "1px solid #1f2937",
              minHeight: 400,
            }}
          >
            <Typography variant="h5" fontWeight="bold" sx={{ color: "#fff" }}>
              Today Planner
            </Typography>

            <Typography sx={{ color: "#64748b", mt: 1, mb: 3 }}>
              Your focus for today.
            </Typography>

            {todayEvents.slice(0, 5).map((event) => (
              <Box
                key={event.id}
                sx={{
                  p: 2,
                  mb: 2,
                  borderRadius: 3,
                  background: "#111827",
                  border: "1px solid #1f2937",
                }}
              >
                <Typography sx={{ color: "#f8fafc", fontWeight: 600 }}>
                  {event.title}
                </Typography>

                <Typography sx={{ color: "#64748b", fontSize: 13, textTransform: "capitalize" }}>
                  {event.extendedProps?.type || "General"}
                </Typography>
              </Box>
            ))}

            {todayEvents.length === 0 && (
              <Typography sx={{ color: "#64748b" }}>
                No items planned for today.
              </Typography>
            )}
          </Box>
        </Grid>
      </Grid>
      <EventDetailsModal
        open={openEventModal}
        onClose={() => setOpenEventModal(false)}
        event={selectedEvent}
      />

      <CreateItemModal
        open={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        tabId={selectedTabId}
        tabs={tabs}
        initialDate={selectedDate}
        onCreated={(newItem) => {
          setEvents((prev) => [
            ...prev,
            {
              id: newItem._id,
              title: newItem.title,
              start: newItem.data?.startDate,
              end: newItem.data?.endDate,
              backgroundColor: "#2563eb",
              borderColor: "transparent",
              extendedProps: {
                type: newItem.type,
                description: newItem.description,
                itemData: newItem.data,
              },
            },
          ]);
        }}
      />

    </MainLayout>
  );
};

export default LifeDashboard;