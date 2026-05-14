import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";

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
      <Box sx={{ width: "100%", maxWidth: "100%" }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" fontWeight="bold" sx={{ color: "#f8fafc" }}>
            Life Planner
          </Typography>
          <Typography sx={{ color: "#94a3b8", mt: 1 }}>
            Do life with focus, memory and intention.
          </Typography>
        </Box>

        {/* CALENDAR SECTION */}
      <Box sx={{ mb: 4, width: "100%", overflowX: "auto" }}>
        <Box
          sx={{
            p: 3,
            borderRadius: 4,
            background: "#0f172a",
            border: "1px solid #1f2937",
            color: "#f8fafc",
            minWidth: { xs: "600px", sm: "100%" }, // Largura mínima apenas em mobile
            width: "100%",
            
            "& .fc": {
              color: "#cbd5e1",
              width: "100%",
            },
            
            "& .fc .fc-scrollgrid": {
              width: "100% !important",
            },
            
            "& .fc .fc-scrollgrid-section table": {
              width: "100% !important",
            },
            
            "& .fc .fc-daygrid-body": {
              width: "100% !important",
            },
            
            "& .fc .fc-daygrid-day-frame": {
              width: "auto !important",
            },
            
            "& .fc-button": {
              background: "#1e293b",
              border: "1px solid #334155",
              color: "#f8fafc",
              whiteSpace: "nowrap",
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
              flexWrap: "wrap",
              gap: "8px",
            },
            
            "& .fc-toolbar-title": {
              color: "#f8fafc",
              fontSize: "1.2rem",
              fontWeight: 700,
              "@media (min-width: 600px)": {
                fontSize: "1.5rem",
              },
            },
            
            // Ajustes para mobile
            "@media (max-width: 768px)": {
              p: 2,
              
              "& .fc .fc-toolbar": {
                flexDirection: "column",
                alignItems: "center",
              },
              
              "& .fc .fc-toolbar-title": {
                fontSize: "1rem",
                margin: "8px 0",
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
            aspectRatio={1.5} // Ajuda a manter proporção em telas pequenas
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
      </Box>

        {/* TODAY TIMELINE SECTION - COM SCROLL HORIZONTAL */}
        {/* TODAY TIMELINE SECTION - VERSÃO RESPONSIVA */}
<Box sx={{ width: "100%", mt: 4 }}>
  <Box
    sx={{
      p: 3,
      borderRadius: 4,
      background: "linear-gradient(180deg, rgba(15,23,42,0.96), rgba(17,24,39,0.96))",
      border: "1px solid #1f2937",
    }}
  >
    <Typography variant="h5" fontWeight="bold" sx={{ color: "#fff" }}>
      Today Timeline
    </Typography>
    <Typography sx={{ color: "#64748b", mt: 1, mb: 4 }}>
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
          overflowX: "scroll",
          overflowY: "hidden",
          pb: 2,
          position: "relative",
          
          // Scrollbar styling
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
          {/* Timeline line */}
          <Box
            sx={{
              position: "absolute",
              top: 45,
              left: 0,
              right: 0,
              height: "2px",
              background: "linear-gradient(90deg, #3b82f6, #8b5cf6, #3b82f6)",
              borderRadius: "99px",
              zIndex: 0,
            }}
          />

          {todayEvents.map((event, index) => {
            const itemData = event.extendedProps?.itemData || {};
            const timeLabel = `${itemData.startTime || "Anytime"}${itemData.endTime ? ` - ${itemData.endTime}` : ""}`;

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
                {/* Timeline dot */}
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
                    fontWeight: 600,
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
                    borderRadius: 2,
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
                      fontWeight: 700,
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
  </Box>
</Box>

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
      </Box>
    </MainLayout>
  );
};

export default LifeDashboard;