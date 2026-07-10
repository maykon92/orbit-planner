import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Box,
  Typography,
  Stack,
  Card,
  CardContent,
  IconButton,
  Button,
  Chip,
  LinearProgress,
  CircularProgress,
} from "@mui/material";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import TodayIcon from "@mui/icons-material/Today";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import UpcomingIcon from "@mui/icons-material/Upcoming";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import FlightIcon from "@mui/icons-material/Flight";
import MovieIcon from "@mui/icons-material/Movie";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import WorkIcon from "@mui/icons-material/Work";
import SchoolIcon from "@mui/icons-material/School";
import EventNoteIcon from "@mui/icons-material/EventNote";
import AddIcon from "@mui/icons-material/Add";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

import MainLayout from "../../layouts/MainLayout";

import EventDetailsModal from "../../components/EventDetailsModal";
import CreateItemModal from "../../components/CreateItemModal";
import PageHeader from "../../components/layout/PageHeader";

import { getTabs } from "../../services/tabService";
import api from "../../services/api";

const panelSx = {
  borderRadius: 5,
  color: "#f8fafc",
  overflow: "hidden",
  background:
    "linear-gradient(145deg, rgba(20,33,61,.98), rgba(15,23,42,.98))",
  border: "1px solid rgba(148,163,184,.12)",
  boxShadow: "0 24px 60px rgba(0,0,0,.28)",
};

const getLocalDateString = (date = new Date()) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const parseLocalDate = (value) => {
  if (!value) return null;

  const parsedDate = new Date(`${value}T00:00:00`);

  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
};

const formatMonthTitle = (date) =>
  new Intl.DateTimeFormat("en-AU", {
    month: "long",
    year: "numeric",
  }).format(date);

const formatFullDate = (date) =>
  new Intl.DateTimeFormat("en-AU", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(date);

const getWeekRange = (referenceDate = new Date()) => {
  const date = new Date(referenceDate);
  const day = date.getDay();
  const differenceToMonday = day === 0 ? -6 : 1 - day;

  const start = new Date(date);
  start.setDate(date.getDate() + differenceToMonday);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  return { start, end };
};

const typeConfig = {
  travel: {
    label: "Travel",
    color: "#3b82f6",
    background: "rgba(59,130,246,.18)",
    icon: FlightIcon,
  },

  movies: {
    label: "Movie",
    color: "#a78bfa",
    background: "rgba(139,92,246,.18)",
    icon: MovieIcon,
  },

  books: {
    label: "Book",
    color: "#34d399",
    background: "rgba(16,185,129,.18)",
    icon: MenuBookIcon,
  },

  fitness: {
    label: "Fitness",
    color: "#fb7185",
    background: "rgba(244,63,94,.16)",
    icon: FitnessCenterIcon,
  },

  work: {
    label: "Work",
    color: "#38bdf8",
    background: "rgba(14,165,233,.16)",
    icon: WorkIcon,
  },

  study: {
    label: "Study",
    color: "#facc15",
    background: "rgba(234,179,8,.16)",
    icon: SchoolIcon,
  },

  agenda: {
    label: "Agenda",
    color: "#fb923c",
    background: "rgba(249,115,22,.16)",
    icon: EventNoteIcon,
  },

  default: {
    label: "Item",
    color: "#94a3b8",
    background: "rgba(148,163,184,.14)",
    icon: EventAvailableIcon,
  },
};

const getTypeConfig = (type) => typeConfig[type] || typeConfig.default;

const isEventCompleted = (event, today) => {
  if (event.start !== today) return false;

  const itemData = event.extendedProps?.itemData || {};
  const comparisonTime = itemData.endTime || itemData.startTime;

  if (!comparisonTime) return false;

  const [hours, minutes] = comparisonTime.split(":").map(Number);

  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) {
    return false;
  }

  const eventDate = new Date();
  eventDate.setHours(hours, minutes, 0, 0);

  return new Date() > eventDate;
};

const LifeDashboard = () => {
  const calendarRef = useRef(null);

  const todayDate = useMemo(() => new Date(), []);
  const today = getLocalDateString(todayDate);

  const [tabs, setTabs] = useState([]);
  const [events, setEvents] = useState([]);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [openEventModal, setOpenEventModal] = useState(false);

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTabId, setSelectedTabId] = useState("");

  const [calendarTitle, setCalendarTitle] = useState(
    formatMonthTitle(todayDate)
  );

  const [activeView, setActiveView] = useState("dayGridMonth");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const buildCalendarEvent = useCallback((item) => {
    const config = getTypeConfig(item.type);

    return {
      id: item._id,
      title: item.title,
      start: item.data?.startDate,
      end: item.data?.endDate || item.data?.startDate,

      backgroundColor: config.background,
      borderColor: config.color,
      textColor: "#f8fafc",

      extendedProps: {
        type: item.type,
        description: item.description,
        itemData: item.data,
      },
    };
  }, []);

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setLoadError("");

      const tabsData = await getTabs();
      setTabs(tabsData || []);

      const itemRequests = (tabsData || []).map(async (tab) => {
        const { data } = await api.get(`/items/tab/${tab._id}`);
        const items = data.items || data || [];

        return items
          .filter((item) => item.data?.startDate)
          .map(buildCalendarEvent);
      });

      const eventsByTab = await Promise.all(itemRequests);

      setEvents(eventsByTab.flat());
    } catch (error) {
      console.error("Error loading dashboard:", error);

      setLoadError(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to load your dashboard."
      );
    } finally {
      setLoading(false);
    }
  }, [buildCalendarEvent]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const todayEvents = useMemo(
    () =>
      events
        .filter((event) => {
          const start = event.start;
          const end = event.end || event.start;

          return today >= start && today <= end;
        })
        .sort((firstEvent, secondEvent) => {
          const firstTime =
            firstEvent.extendedProps?.itemData?.startTime || "99:99";

          const secondTime =
            secondEvent.extendedProps?.itemData?.startTime || "99:99";

          return firstTime.localeCompare(secondTime);
        }),
    [events, today]
  );

  const weekEvents = useMemo(() => {
    const { start, end } = getWeekRange();

    return events.filter((event) => {
      const eventDate = parseLocalDate(event.start);

      return eventDate && eventDate >= start && eventDate <= end;
    });
  }, [events]);

  const upcomingEvents = useMemo(
    () =>
      events
        .filter((event) => event.start > today)
        .sort((firstEvent, secondEvent) =>
          firstEvent.start.localeCompare(secondEvent.start)
        ),
    [events, today]
  );

  const completedToday = useMemo(
    () =>
      todayEvents.filter((event) => isEventCompleted(event, today)).length,
    [todayEvents, today]
  );

  const dailyProgress = todayEvents.length
    ? Math.round((completedToday / todayEvents.length) * 100)
    : 0;

  const nextEvent = useMemo(() => {
    const currentMinutes =
      new Date().getHours() * 60 + new Date().getMinutes();

    return (
      todayEvents.find((event) => {
        const startTime = event.extendedProps?.itemData?.startTime;

        if (!startTime) return false;

        const [hours, minutes] = startTime.split(":").map(Number);
        const eventMinutes = hours * 60 + minutes;

        return eventMinutes >= currentMinutes;
      }) ||
      upcomingEvents[0] ||
      null
    );
  }, [todayEvents, upcomingEvents]);

  const statCards = [
    {
      label: "Scheduled today",
      value: todayEvents.length,
      helper:
        todayEvents.length === 1
          ? "1 item on your agenda"
          : `${todayEvents.length} items on your agenda`,
      icon: TodayIcon,
      color: "#60a5fa",
      background: "rgba(59,130,246,.16)",
    },

    {
      label: "This week",
      value: weekEvents.length,
      helper: "Monday to Sunday",
      icon: CalendarMonthIcon,
      color: "#a78bfa",
      background: "rgba(139,92,246,.16)",
    },

    {
      label: "Coming up",
      value: upcomingEvents.length,
      helper: "Future scheduled items",
      icon: UpcomingIcon,
      color: "#34d399",
      background: "rgba(16,185,129,.16)",
    },

    {
      label: "Daily progress",
      value: `${dailyProgress}%`,
      helper: `${completedToday} of ${todayEvents.length} completed`,
      icon: EventAvailableIcon,
      color: "#fb923c",
      background: "rgba(249,115,22,.16)",
    },
  ];

  const calendarApi = () => calendarRef.current?.getApi();

  const handlePrevious = () => {
    calendarApi()?.prev();
  };

  const handleNext = () => {
    calendarApi()?.next();
  };

  const handleToday = () => {
    calendarApi()?.today();
  };

  const handleChangeView = (viewName) => {
    calendarApi()?.changeView(viewName);
    setActiveView(viewName);
  };

  const handleOpenEvent = (event) => {
    setSelectedEvent(event);
    setOpenEventModal(true);
  };

  const renderCalendarEvent = (eventInfo) => {
    const type = eventInfo.event.extendedProps?.type;
    const config = getTypeConfig(type);
    const TypeIcon = config.icon;

    const itemData = eventInfo.event.extendedProps?.itemData || {};
    const startTime = itemData.startTime;

    return (
      <Box
        sx={{
          width: "100%",
          minWidth: 0,
          display: "flex",
          alignItems: "center",
          gap: 0.7,
          px: 0.5,
        }}
      >
        <TypeIcon
          sx={{
            fontSize: 14,
            flexShrink: 0,
            color: config.color,
          }}
        />

        <Typography
          component="span"
          sx={{
            minWidth: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontSize: 12,
            fontWeight: 800,
            color: "#f8fafc",
          }}
        >
          {startTime ? `${startTime} · ` : ""}
          {eventInfo.event.title}
        </Typography>
      </Box>
    );
  };

  return (
    <MainLayout>
      <Box
        sx={{
          maxWidth: 1380,
          mx: "auto",
          px: { xs: 2, md: 4 },
          py: { xs: 3, md: 5 },
        }}
      >
        <PageHeader
          title="Life Planner"
          subtitle="Your schedule, priorities and next steps in one place."
          actions={
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                setSelectedDate(today);
                setSelectedTabId(tabs[0]?._id || "");
                setOpenCreateModal(true);
              }}
              sx={{
                height: 46,
                px: 2.5,
                borderRadius: "14px",
                textTransform: "none",
                fontWeight: 800,
                background: "#2563eb",
                boxShadow: "0 12px 30px rgba(37,99,235,.25)",

                "&:hover": {
                  background: "#1d4ed8",
                  transform: "translateY(-1px)",
                },
              }}
            >
              Add item
            </Button>
          }
        />

        {loadError && (
          <Box
            sx={{
              mb: 3,
              p: 2,
              borderRadius: 3,
              color: "#fecaca",
              background: "rgba(127,29,29,.28)",
              border: "1px solid rgba(248,113,113,.25)",
            }}
          >
            <Typography fontWeight={800}>{loadError}</Typography>

            <Button
              onClick={loadDashboardData}
              sx={{
                mt: 1,
                color: "#fca5a5",
                textTransform: "none",
                fontWeight: 800,
              }}
            >
              Try again
            </Button>
          </Box>
        )}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
              xl: "repeat(4, minmax(0, 1fr))",
            },
            gap: 2,
            mb: 3,
          }}
        >
          {statCards.map((stat) => {
            const StatIcon = stat.icon;

            return (
              <Card
                key={stat.label}
                sx={{
                  ...panelSx,
                  position: "relative",
                  transition: "all .25s ease",

                  "&:hover": {
                    transform: "translateY(-4px)",
                    borderColor: "rgba(96,165,250,.3)",
                    boxShadow: "0 26px 55px rgba(37,99,235,.12)",
                  },
                }}
              >
                <CardContent
                  sx={{
                    p: 2.5,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Box>
                    <Typography
                      sx={{
                        color: "#8fa8c7",
                        fontSize: 14,
                        fontWeight: 700,
                        mb: 0.8,
                      }}
                    >
                      {stat.label}
                    </Typography>

                    <Typography
                      sx={{
                        color: "#f8fafc",
                        fontSize: 30,
                        lineHeight: 1,
                        fontWeight: 900,
                      }}
                    >
                      {stat.value}
                    </Typography>

                    <Typography
                      sx={{
                        color: "#64748b",
                        fontSize: 12,
                        mt: 1,
                      }}
                    >
                      {stat.helper}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      width: 52,
                      height: 52,
                      flexShrink: 0,
                      borderRadius: 3.5,
                      display: "grid",
                      placeItems: "center",
                      color: stat.color,
                      background: stat.background,
                      border: `1px solid ${stat.color}33`,
                    }}
                  >
                    <StatIcon />
                  </Box>
                </CardContent>
              </Card>
            );
          })}
        </Box>

        <Card
          sx={{
            ...panelSx,
            mb: 3,
            background:
              "linear-gradient(180deg, rgba(23,32,59,.98), rgba(10,17,31,.98))",
          }}
        >
          <Box
            sx={{
              px: { xs: 2, md: 3 },
              pt: { xs: 2.5, md: 3 },
              pb: 2,
              display: "flex",
              flexDirection: { xs: "column", lg: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "stretch", lg: "center" },
              gap: 2,
              borderBottom: "1px solid rgba(148,163,184,.1)",
            }}
          >
            <Box>
              <Stack direction="row" sx={{alignItems:"center"}} spacing={1.2}>
                <CalendarMonthIcon sx={{ color: "#60a5fa" }} />

                <Typography
                  sx={{
                    color: "#f8fafc",
                    fontSize: { xs: 24, md: 28 },
                    fontWeight: 900,
                    letterSpacing: "-.5px",
                  }}
                >
                  {calendarTitle}
                </Typography>
              </Stack>

              <Typography
                sx={{
                  color: "#7f94b2",
                  fontSize: 14,
                  mt: 0.7,
                }}
              >
                {formatFullDate(new Date())}
              </Typography>
            </Box>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.2}
              sx={{
                alignItems: { xs: "stretch", sm: "center" },
              }}
            >
              <Stack direction="row" spacing={0.7}>
                <IconButton
                  aria-label="Previous calendar period"
                  onClick={handlePrevious}
                  sx={{
                    width: 42,
                    height: 42,
                    color: "#cbd5e1",
                    borderRadius: 3,
                    border: "1px solid rgba(148,163,184,.18)",
                    background: "rgba(15,23,42,.65)",

                    "&:hover": {
                      color: "#fff",
                      borderColor: "#60a5fa",
                      background: "rgba(59,130,246,.12)",
                    },
                  }}
                >
                  <ChevronLeftIcon />
                </IconButton>

                <IconButton
                  aria-label="Next calendar period"
                  onClick={handleNext}
                  sx={{
                    width: 42,
                    height: 42,
                    color: "#cbd5e1",
                    borderRadius: 3,
                    border: "1px solid rgba(148,163,184,.18)",
                    background: "rgba(15,23,42,.65)",

                    "&:hover": {
                      color: "#fff",
                      borderColor: "#60a5fa",
                      background: "rgba(59,130,246,.12)",
                    },
                  }}
                >
                  <ChevronRightIcon />
                </IconButton>

                <Button
                  onClick={handleToday}
                  sx={{
                    height: 42,
                    px: 2,
                    borderRadius: 3,
                    color: "#bfdbfe",
                    textTransform: "none",
                    fontWeight: 800,
                    border: "1px solid rgba(96,165,250,.25)",
                    background: "rgba(37,99,235,.1)",

                    "&:hover": {
                      background: "rgba(37,99,235,.2)",
                    },
                  }}
                >
                  Today
                </Button>
              </Stack>

              <Box
                sx={{
                  p: 0.5,
                  display: "flex",
                  borderRadius: 3,
                  background: "rgba(2,6,23,.55)",
                  border: "1px solid rgba(148,163,184,.12)",
                }}
              >
                {[
                  {
                    label: "Month",
                    view: "dayGridMonth",
                  },
                  {
                    label: "Week",
                    view: "dayGridWeek",
                  },
                  {
                    label: "Day",
                    view: "dayGridDay",
                  },
                ].map((option) => {
                  const selected = activeView === option.view;

                  return (
                    <Button
                      key={option.view}
                      onClick={() => handleChangeView(option.view)}
                      sx={{
                        minWidth: 0,
                        px: 1.6,
                        height: 36,
                        borderRadius: 2.5,
                        color: selected ? "#fff" : "#7f94b2",
                        background: selected
                          ? "linear-gradient(135deg,#2563eb,#4f46e5)"
                          : "transparent",
                        textTransform: "none",
                        fontWeight: 800,

                        "&:hover": {
                          color: "#fff",
                          background: selected
                            ? "linear-gradient(135deg,#2563eb,#4f46e5)"
                            : "rgba(148,163,184,.08)",
                        },
                      }}
                    >
                      {option.label}
                    </Button>
                  );
                })}
              </Box>
            </Stack>
          </Box>

          <CardContent
            sx={{
              p: { xs: 1.5, md: 3 },
            }}
          >
            {loading ? (
              <Box
                sx={{
                  minHeight: 450,
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <Stack spacing={2} sx={{alignItems:"center"}}>
                  <CircularProgress size={34} />

                  <Typography sx={{ color: "#94a3b8" }}>
                    Loading your schedule...
                  </Typography>
                </Stack>
              </Box>
            ) : (
              <Box
                sx={{
                  width: "100%",
                  overflowX: "auto",

                  "& .fc": {
                    color: "#cbd5e1",
                    minWidth: { xs: 760, md: 0 },
                  },

                  "& .fc-header-toolbar": {
                    display: "none",
                  },

                  "& .fc-scrollgrid": {
                    border: "none",
                    borderRadius: "16px",
                    overflow: "hidden",
                  },

                  "& .fc-scrollgrid-section table": {
                    width: "100% !important",
                  },

                  "& .fc-daygrid-body": {
                    width: "100% !important",
                  },

                  "& .fc-col-header-cell": {
                    background: "rgba(15,23,42,.92)",
                    borderColor: "rgba(148,163,184,.1)",
                    padding: "11px 0",
                  },

                  "& .fc-col-header-cell-cushion": {
                    color: "#8fa8c7",
                    fontSize: 12,
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: ".08em",
                    textDecoration: "none",
                  },

                  "& .fc-daygrid-day": {
                    minHeight: 120,
                    background: "rgba(2,6,23,.68)",
                    borderColor: "rgba(148,163,184,.1)",
                    transition: "background .2s ease",
                  },

                  "& .fc-daygrid-day:hover": {
                    background: "rgba(30,41,59,.72)",
                  },

                  "& .fc-daygrid-day-frame": {
                    minHeight: {
                      xs: 105,
                      md: activeView === "dayGridMonth" ? 125 : 160,
                    },
                    padding: "5px",
                  },

                  "& .fc-daygrid-day-top": {
                    justifyContent: "flex-end",
                  },

                  "& .fc-daygrid-day-number": {
                    minWidth: 30,
                    height: 30,
                    display: "grid",
                    placeItems: "center",
                    color: "#8194af",
                    padding: 0,
                    borderRadius: "50%",
                    fontSize: 13,
                    fontWeight: 700,
                    textDecoration: "none",
                  },

                  "& .fc-day-other .fc-daygrid-day-number": {
                    color: "#334155",
                  },

                  "& .fc-day-today": {
                    position: "relative",
                    background:
                      "linear-gradient(145deg, rgba(37,99,235,.2), rgba(30,64,175,.08)) !important",
                    boxShadow:
                      "inset 0 0 0 1px rgba(96,165,250,.28)",
                  },

                  "& .fc-day-today .fc-daygrid-day-number": {
                    color: "#fff",
                    background: "#2563eb",
                    boxShadow: "0 0 18px rgba(37,99,235,.65)",
                  },

                  "& .fc-daygrid-event": {
                    margin: "3px 2px",
                  },

                  "& .fc-event": {
                    borderRadius: "8px",
                    padding: "4px 5px",
                    cursor: "pointer",
                    borderWidth: "1px",
                    boxShadow: "0 5px 14px rgba(0,0,0,.2)",
                    transition: "all .18s ease",
                  },

                  "& .fc-event:hover": {
                    zIndex: 5,
                    transform: "translateY(-2px) scale(1.015)",
                    boxShadow: "0 9px 20px rgba(0,0,0,.35)",
                  },

                  "& .fc-daygrid-more-link": {
                    color: "#93c5fd",
                    fontWeight: 800,
                    fontSize: 12,
                    textDecoration: "none",
                  },

                  "& .fc-popover": {
                    color: "#f8fafc",
                    background: "#0f172a",
                    border: "1px solid rgba(96,165,250,.25)",
                    borderRadius: "14px",
                    boxShadow: "0 24px 60px rgba(0,0,0,.55)",
                  },

                  "& .fc-popover-header": {
                    color: "#f8fafc",
                    background: "#111827",
                  },
                }}
              >
                <FullCalendar
                  ref={calendarRef}
                  plugins={[dayGridPlugin, interactionPlugin]}
                  initialView="dayGridMonth"
                  events={events}
                  height="auto"
                  contentHeight="auto"
                  headerToolbar={false}
                  dayMaxEvents={4}
                  fixedWeekCount={false}
                  eventContent={renderCalendarEvent}
                  datesSet={(dateInfo) => {
                    setCalendarTitle(
                      formatMonthTitle(dateInfo.view.currentStart)
                    );

                    setActiveView(dateInfo.view.type);
                  }}
                  eventClick={(info) => {
                    handleOpenEvent(info.event);
                  }}
                  dateClick={(info) => {
                    setSelectedDate(info.dateStr);
                    setSelectedTabId(tabs[0]?._id || "");
                    setOpenCreateModal(true);
                  }}
                />
              </Box>
            )}
          </CardContent>
        </Card>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              lg: "minmax(0, 1.7fr) minmax(290px, .7fr)",
            },
            gap: 3,
          }}
        >
          <Card sx={panelSx}>
            <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                sx={{ 
                  mb: 3,
                  justifyContent: "space-between",
                  alignItems: { xs: "flex-start", sm: "center" }
                }}
              >
                <Box>
                  <Typography
                    sx={{
                      fontSize: 25,
                      fontWeight: 900,
                      color: "#f8fafc",
                      letterSpacing: "-.5px",
                    }}
                  >
                    Today&apos;s timeline
                  </Typography>

                  <Typography
                    sx={{
                      color: "#7f94b2",
                      fontSize: 14,
                      mt: 0.6,
                    }}
                  >
                    Your day in chronological order.
                  </Typography>
                </Box>

                <Chip
                  icon={<AccessTimeIcon />}
                  label={`${todayEvents.length} scheduled`}
                  sx={{
                    color: "#bfdbfe",
                    background: "rgba(37,99,235,.13)",
                    border: "1px solid rgba(96,165,250,.2)",

                    "& .MuiChip-icon": {
                      color: "#60a5fa",
                    },
                  }}
                />
              </Stack>

              {todayEvents.length === 0 ? (
                <Box
                  sx={{
                    minHeight: 220,
                    display: "grid",
                    placeItems: "center",
                    textAlign: "center",
                    borderRadius: 4,
                    background: "rgba(2,6,23,.38)",
                    border: "1px dashed rgba(148,163,184,.18)",
                  }}
                >
                  <Box>
                    <EventAvailableIcon
                      sx={{
                        fontSize: 44,
                        color: "#334155",
                        mb: 1,
                      }}
                    />

                    <Typography
                      sx={{
                        color: "#cbd5e1",
                        fontWeight: 800,
                      }}
                    >
                      Your day is clear
                    </Typography>

                    <Typography
                      sx={{
                        color: "#64748b",
                        fontSize: 13,
                        mt: 0.7,
                      }}
                    >
                      Click a calendar date to add something.
                    </Typography>
                  </Box>
                </Box>
              ) : (
                <Stack spacing={0}>
                  {todayEvents.map((event, index) => {
                    const itemData =
                      event.extendedProps?.itemData || {};

                    const config = getTypeConfig(
                      event.extendedProps?.type
                    );

                    const TypeIcon = config.icon;

                    const timeLabel = itemData.startTime || "Anytime";
                    const endTimeLabel = itemData.endTime
                      ? ` – ${itemData.endTime}`
                      : "";

                    const completed = isEventCompleted(event, today);

                    return (
                      <Box
                        key={event.id}
                        sx={{
                          display: "grid",
                          gridTemplateColumns: {
                            xs: "54px minmax(0,1fr)",
                            sm: "80px 32px minmax(0,1fr)",
                          },
                          gap: { xs: 1.2, sm: 2 },
                          position: "relative",
                        }}
                      >
                        <Typography
                          sx={{
                            pt: 2.1,
                            color: completed ? "#64748b" : "#93c5fd",
                            fontSize: 12,
                            fontWeight: 800,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {timeLabel}
                          <Box
                            component="span"
                            sx={{
                              display: {
                                xs: "none",
                                md: "inline",
                              },
                            }}
                          >
                            {endTimeLabel}
                          </Box>
                        </Typography>

                        <Box
                          sx={{
                            display: {
                              xs: "none",
                              sm: "flex",
                            },
                            flexDirection: "column",
                            alignItems: "center",
                          }}
                        >
                          <Box
                            sx={{
                              mt: 2.2,
                              width: 13,
                              height: 13,
                              flexShrink: 0,
                              borderRadius: "50%",
                              background: completed
                                ? "#475569"
                                : config.color,
                              boxShadow: completed
                                ? "none"
                                : `0 0 0 4px ${config.color}22`,
                              zIndex: 2,
                            }}
                          />

                          {index < todayEvents.length - 1 && (
                            <Box
                              sx={{
                                width: 2,
                                minHeight: 92,
                                flex: 1,
                                background:
                                  "linear-gradient(#334155, rgba(51,65,85,.12))",
                              }}
                            />
                          )}
                        </Box>

                        <Box
                          onClick={() => handleOpenEvent(event)}
                          sx={{
                            mb:
                              index < todayEvents.length - 1
                                ? 1.5
                                : 0,
                            p: 2,
                            borderRadius: 3.5,
                            cursor: "pointer",
                            opacity: completed ? 0.66 : 1,
                            background:
                              "linear-gradient(145deg, rgba(23,32,59,.88), rgba(15,23,42,.88))",
                            border: `1px solid ${
                              completed
                                ? "rgba(148,163,184,.1)"
                                : `${config.color}30`
                            }`,
                            transition: "all .22s ease",

                            "&:hover": {
                              opacity: 1,
                              transform: "translateX(5px)",
                              borderColor: config.color,
                              boxShadow: `0 14px 35px ${config.color}18`,
                            },
                          }}
                        >
                          <Stack
                            direction="row"
                            spacing={1.4}
                            sx={{
                              alignItems: "flex-start"
                            }}
                          >
                            <Box
                              sx={{
                                width: 38,
                                height: 38,
                                flexShrink: 0,
                                display: "grid",
                                placeItems: "center",
                                borderRadius: 2.5,
                                color: config.color,
                                background: config.background,
                              }}
                            >
                              <TypeIcon fontSize="small" />
                            </Box>

                            <Box sx={{ minWidth: 0, flex: 1 }}>
                              <Typography
                                sx={{
                                  color: "#f1f5f9",
                                  fontWeight: 850,
                                  fontSize: 15,
                                  textDecoration: completed
                                    ? "line-through"
                                    : "none",
                                }}
                              >
                                {event.title}
                              </Typography>

                              <Typography
                                sx={{
                                  color: "#7f94b2",
                                  fontSize: 12.5,
                                  lineHeight: 1.5,
                                  mt: 0.5,
                                }}
                              >
                                {event.extendedProps?.description ||
                                  config.label}
                              </Typography>
                            </Box>

                            <Chip
                              size="small"
                              label={
                                completed
                                  ? "Passed"
                                  : config.label
                              }
                              sx={{
                                height: 24,
                                flexShrink: 0,
                                color: completed
                                  ? "#94a3b8"
                                  : config.color,
                                background: completed
                                  ? "rgba(148,163,184,.1)"
                                  : config.background,
                                fontSize: 10,
                                fontWeight: 800,
                              }}
                            />
                          </Stack>
                        </Box>
                      </Box>
                    );
                  })}
                </Stack>
              )}
            </CardContent>
          </Card>

          <Stack spacing={3}>
            <Card sx={panelSx}>
              <CardContent sx={{ p: 2.7 }}>
                <Stack
                  direction="row"
                  sx={{ 
                    mb: 2.2,
                    justifyContent: "space-between",
                    alignItems: "center", 
                  }}
                >
                  <Box>
                    <Typography
                      sx={{
                        color: "#f8fafc",
                        fontSize: 18,
                        fontWeight: 900,
                      }}
                    >
                      Daily progress
                    </Typography>

                    <Typography
                      sx={{
                        color: "#64748b",
                        fontSize: 12,
                        mt: 0.4,
                      }}
                    >
                      Based on scheduled times
                    </Typography>
                  </Box>

                  <Typography
                    sx={{
                      color: "#60a5fa",
                      fontSize: 23,
                      fontWeight: 900,
                    }}
                  >
                    {dailyProgress}%
                  </Typography>
                </Stack>

                <LinearProgress
                  variant="determinate"
                  value={dailyProgress}
                  sx={{
                    height: 9,
                    borderRadius: 99,
                    background: "rgba(51,65,85,.55)",

                    "& .MuiLinearProgress-bar": {
                      borderRadius: 99,
                      background:
                        "linear-gradient(90deg,#2563eb,#8b5cf6)",
                    },
                  }}
                />

                <Typography
                  sx={{
                    mt: 1.4,
                    color: "#7f94b2",
                    fontSize: 12,
                  }}
                >
                  {completedToday} of {todayEvents.length} scheduled
                  items have passed.
                </Typography>
              </CardContent>
            </Card>

            <Card
              sx={{
                ...panelSx,
                position: "relative",
                background:
                  "linear-gradient(145deg, rgba(49,46,129,.34), rgba(15,23,42,.98))",
              }}
            >
              <CardContent sx={{ p: 2.7 }}>
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ 
                    mb: 2,
                    alignItems: "center", 
                  }}
                >
                  <AutoAwesomeIcon sx={{ color: "#c4b5fd" }} />

                  <Typography
                    sx={{
                      color: "#f8fafc",
                      fontSize: 18,
                      fontWeight: 900,
                    }}
                  >
                    Orbit insight
                  </Typography>
                </Stack>

                {nextEvent ? (
                  <>
                    <Typography
                      sx={{
                        color: "#c4b5fd",
                        fontSize: 12,
                        fontWeight: 800,
                        textTransform: "uppercase",
                        letterSpacing: ".08em",
                      }}
                    >
                      Next on your schedule
                    </Typography>

                    <Typography
                      sx={{
                        color: "#f8fafc",
                        fontSize: 19,
                        fontWeight: 900,
                        mt: 1,
                      }}
                    >
                      {nextEvent.title}
                    </Typography>

                    <Typography
                      sx={{
                        color: "#94a3b8",
                        fontSize: 13,
                        mt: 0.8,
                        lineHeight: 1.6,
                      }}
                    >
                      {nextEvent.start === today
                        ? `${
                            nextEvent.extendedProps?.itemData
                              ?.startTime || "Anytime today"
                          }`
                        : `Scheduled for ${new Intl.DateTimeFormat(
                            "en-AU",
                            {
                              day: "numeric",
                              month: "short",
                            }
                          ).format(
                            parseLocalDate(nextEvent.start)
                          )}`}
                    </Typography>

                    <Button
                      onClick={() => handleOpenEvent(nextEvent)}
                      sx={{
                        mt: 2,
                        px: 0,
                        color: "#a5b4fc",
                        textTransform: "none",
                        fontWeight: 800,

                        "&:hover": {
                          background: "transparent",
                          color: "#ddd6fe",
                        },
                      }}
                    >
                      View details →
                    </Button>
                  </>
                ) : (
                  <Typography
                    sx={{
                      color: "#94a3b8",
                      fontSize: 13,
                      lineHeight: 1.6,
                    }}
                  >
                    Nothing else is scheduled. This may be a good
                    time to plan your next priority.
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Stack>
        </Box>

        <EventDetailsModal
          open={openEventModal}
          onClose={() => {
            setOpenEventModal(false);
            setSelectedEvent(null);
          }}
          event={selectedEvent}
        />

        <CreateItemModal
          open={openCreateModal}
          onClose={() => setOpenCreateModal(false)}
          tabId={selectedTabId}
          tabs={tabs}
          initialDate={selectedDate}
          onCreated={(newItemResponse) => {
            const newItem =
              newItemResponse.item || newItemResponse;

            if (!newItem?.data?.startDate) {
              return;
            }

            setEvents((previousEvents) => [
              ...previousEvents,
              buildCalendarEvent(newItem),
            ]);
          }}
        />
      </Box>
    </MainLayout>
  );
};

export default LifeDashboard;