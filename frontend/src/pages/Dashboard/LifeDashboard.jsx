import { useEffect, useState } from "react";
import { Box, Typography, Stack, Card, CardContent } from "@mui/material";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

import MainLayout from "../../layouts/MainLayout";
import EventDetailsModal from "../../components/EventDetailsModal";
import CreateItemModal from "../../components/CreateItemModal";
import { getTabs } from "../../services/tabService";
import api from "../../services/api";

const cardSx = {
  borderRadius: 5,
  background:
    "linear-gradient(145deg, rgba(20,33,61,.98), rgba(15,23,42,.98))",
  border: "1px solid rgba(255,255,255,.07)",
  color: "#f8fafc",
  boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
};

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

  const todayEvents = events
    .filter((event) => {
      const start = event.start;
      const end = event.end || event.start;

      return today >= start && today <= end;
    })
    .sort((a, b) => {
      const timeA = a.extendedProps?.itemData?.startTime || "99:99";
      const timeB = b.extendedProps?.itemData?.startTime || "99:99";

      return timeA.localeCompare(timeB);
    });

  return (
    <MainLayout>
      <Box
        sx={{
          maxWidth: 1320,
          mx: "auto",
          px: { xs: 2, md: 4 },
          py: 5,
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={3}
          sx={{ 
            mb: 4,
            justifyContent: "space-between",
            alignItems:{ xs: "flex-start", md: "center" }
          }}
        >
          <Box>
            <Stack direction="row" sx={{ alignItems: "center" }} spacing={2}>
              <Box
                component="img"
                src="/orbit_planner_logo.png"
                alt="Orbit Planner"
                sx={{
                  width: 60,
                  height: 60,
                  objectFit: "contain",
                  filter: `
                    drop-shadow(0 0 10px rgba(96, 165, 250, 0.4))
                    drop-shadow(0 0 20px rgba(139, 92, 246, 0.3))
                  `,
                }}
              />

              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: 38, md: 56 },
                  fontWeight: 900,
                  color: "#fff",
                  letterSpacing: "-2px",
                  lineHeight: 1,
                }}
              >
                Life Planner
              </Typography>
            </Stack>

            <Typography sx={{ color: "#8fa0bf", mt: 1, fontSize: 16 }}>
              Do life with focus, memory and intention.
            </Typography>
          </Box>
        </Stack>

        <Card sx={{ ...cardSx, mb: 4 }}>
          <CardContent
            sx={{
              p: { xs: 2, md: 3 },
              overflowX: "auto",
            }}
          >
            <Box
              sx={{
                minWidth: { xs: "600px", md: "100%" },

                "& .fc": {
                  color: "#cbd5e1",
                  width: "100%",
                },

                "& .fc .fc-scrollgrid": {
                  width: "100% !important",
                  borderColor: "#1f2937",
                },

                "& .fc .fc-scrollgrid-section table": {
                  width: "100% !important",
                },

                "& .fc .fc-daygrid-body": {
                  width: "100% !important",
                },

                "& .fc-button": {
                  background: "#1e293b",
                  border: "1px solid #334155",
                  color: "#f8fafc",
                  whiteSpace: "nowrap",
                  borderRadius: "10px",
                  fontWeight: 700,
                },

                "& .fc-button:hover": {
                  background: "#334155",
                },

                "& .fc-daygrid-day": {
                  background: "#020617",
                  borderColor: "#1f2937",
                },

                "& .fc-col-header-cell": {
                  background: "#111827",
                  borderColor: "#1f2937",
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
                  fontWeight: 700,
                  cursor: "pointer",
                },

                "& .fc-daygrid-day:hover": {
                  background: "rgba(30, 41, 59, 0.55)",
                },

                "& .fc-toolbar": {
                  marginBottom: "24px",
                  flexWrap: "wrap",
                  gap: "8px",
                },

                "& .fc-toolbar-title": {
                  color: "#f8fafc",
                  fontSize: { xs: "1rem", sm: "1.5rem" },
                  fontWeight: 900,
                },

                "@media (max-width: 768px)": {
                  "& .fc .fc-toolbar": {
                    flexDirection: "column",
                    alignItems: "center",
                  },

                  "& .fc .fc-button": {
                    padding: "4px 8px",
                    fontSize: "12px",
                  },
                },
              }}
            >
              <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={events}
                height="auto"
                contentHeight="auto"
                aspectRatio={1.5}
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
          </CardContent>
        </Card>

        <Card sx={cardSx}>
          <CardContent sx={{ p: { xs: 2, md: 3 } }}>
            <Typography sx={{ fontSize: 24, fontWeight: 900, color: "#fff" }}>
              Today Timeline
            </Typography>

            <Typography sx={{ color: "#8fa0bf", mt: 1, mb: 4 }}>
              Your schedule organised by time.
            </Typography>

            {todayEvents.length === 0 ? (
              <Typography sx={{ color: "#64748b" }}>
                No items planned for today.
              </Typography>
            ) : (
              <Box
                sx={{
                  width: "100%",
                  overflowX: "auto",
                  overflowY: "hidden",
                  pb: 2,
                  position: "relative",

                  "&::-webkit-scrollbar": {
                    height: "6px",
                  },

                  "&::-webkit-scrollbar-track": {
                    background: "#1e293b",
                    borderRadius: "99px",
                  },

                  "&::-webkit-scrollbar-thumb": {
                    background: "#475569",
                    borderRadius: "99px",
                  },

                  "&::-webkit-scrollbar-thumb:hover": {
                    background: "#64748b",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 2.5,
                    width: "max-content",
                    minWidth: "100%",
                    position: "relative",
                  }}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      top: 45,
                      left: 0,
                      right: 0,
                      height: "2px",
                      background:
                        "linear-gradient(90deg, #3b82f6, #8b5cf6, #3b82f6)",
                      borderRadius: "99px",
                      zIndex: 0,
                    }}
                  />

                  {todayEvents.map((event) => {
                    const itemData = event.extendedProps?.itemData || {};
                    const timeLabel = `${itemData.startTime || "Anytime"}${
                      itemData.endTime ? ` - ${itemData.endTime}` : ""
                    }`;

                    return (
                      <Box
                        key={event.id}
                        sx={{
                          position: "relative",
                          width: { xs: "260px", sm: "280px" },
                          flexShrink: 0,
                          zIndex: 1,
                        }}
                      >
                        <Box
                          sx={{
                            width: "14px",
                            height: "14px",
                            borderRadius: "50%",
                            background: "#3b82f6",
                            boxShadow: "0 0 0 3px rgba(59,130,246,0.2)",
                            mx: "auto",
                            mb: 1.5,
                            position: "relative",
                            zIndex: 2,
                          }}
                        />

                        <Typography
                          sx={{
                            color: "#60a5fa",
                            fontSize: "12px",
                            fontWeight: 700,
                            mb: 1,
                            textAlign: "center",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {timeLabel}
                        </Typography>

                        <Box
                          sx={{
                            p: 2,
                            borderRadius: 3,
                            background: "#0f172a",
                            border: "1px solid #334155",
                            transition: "all 0.2s ease",
                            cursor: "pointer",

                            "&:hover": {
                              transform: "translateY(-2px)",
                              borderColor: "#3b82f6",
                              background: "#1e293b",
                            },
                          }}
                          onClick={() => {
                            setSelectedEvent(event);
                            setOpenEventModal(true);
                          }}
                        >
                          <Typography
                            sx={{
                              color: "#f1f5f9",
                              fontWeight: 800,
                              mb: 1,
                              fontSize: "0.9rem",
                              wordBreak: "break-word",
                            }}
                          >
                            {event.title}
                          </Typography>

                          <Typography
                            sx={{
                              color: "#94a3b8",
                              fontSize: "0.75rem",
                              lineHeight: 1.4,
                            }}
                          >
                            {event.extendedProps?.description ||
                              event.extendedProps?.type ||
                              "Personal item"}
                          </Typography>
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>

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
          onCreated={(newItemResponse) => {
            const newItem = newItemResponse.item || newItemResponse;

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
      </Box>
    </MainLayout>
  );
};

export default LifeDashboard;