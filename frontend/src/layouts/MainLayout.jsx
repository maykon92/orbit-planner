import {
  Box,
  Typography,
  Button,
  Avatar,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  Drawer,
  IconButton,
  AppBar,
  Toolbar,
  useMediaQuery,
} from "@mui/material";

import EventIcon from "@mui/icons-material/Event";
import FlightIcon from "@mui/icons-material/Flight";
import MovieIcon from "@mui/icons-material/Movie";
import BookIcon from "@mui/icons-material/MenuBook";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import DashboardIcon from "@mui/icons-material/Dashboard";
import MenuIcon from "@mui/icons-material/Menu";
import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";
import ChatBubbleOutlineIconSharp from "@mui/icons-material/ChatBubbleOutlineSharp";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { useTheme } from "@mui/material/styles";

import { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";

import { getTabs } from "../services/tabService";
import { useAuth } from "../contexts/AuthContext";
import CreateTabModal from "../components/CreateTabModal";
import { getImageUrl } from "../utils/getImageUrl";
import AIChatButton from "../components/AI/AIChatButton";
import AIChatModal from "../components/AI/AIChatModal";

const drawerWidth = 270;

const MainLayout = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const { user, logout } = useAuth();

    const [openModal, setOpenModal] = useState(false);
    const [open, setOpen] = useState(false);
    const [tabs, setTabs] = useState([]);
    const [openAI, setOpenAI] = useState(false);

    const currentTabId = params.id || null;
    const currentTab = tabs.find((tab) => tab._id === currentTabId);
    const aiContext = {
        currentPage: location.pathname,
        currentTabId,
        currentTabType: currentTab?.type || null,
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const handleTabCreated = (newTab) => {
        setTabs((prev) => [newTab, ...prev]);
    };

    useEffect(() => {
        const loadTabs = async () => {
            try {
                const data = await getTabs();
                setTabs(data);
            } catch (error) {
                console.error(error);
            }
        };

        loadTabs();
    }, []);

    const getTabIcon = (type) => {
        switch (type) {
            case "agenda":
            return <EventIcon fontSize="small" />;
            case "travel":
            return <FlightIcon fontSize="small" />;
            case "movies":
            return <MovieIcon fontSize="small" />;
            case "books":
            return <BookIcon fontSize="small" />;
            case "fitness":
            return <FitnessCenterIcon fontSize="small" />;
            default:
            return <DashboardIcon fontSize="small" />;
        }
    };

    const drawerContent = (
        <Box
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                p: 3,
                background: "#070a0f",
                color: "#fff",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                }}
            >
                <Box
                    component="img"
                    src="/orbit_planner_logo.png"
                    alt="Orbit Planner"
                    sx={{
                        width: 30,
                        height: 30,
                        marginRight: 2,
                        objectFit: "contain",
                        filter: `
                        drop-shadow(0 0 10px rgba(96, 165, 250, 0.4))
                        drop-shadow(0 0 20px rgba(139, 92, 246, 0.3))
                        `,
                    }}
                />
                <Typography variant="h5" fontWeight="bold" sx={{ mb: 4 }}>
                    Orbit Planner
                </Typography>
            </Box>

            <Typography
                variant="caption"
                sx={{ color: "#64748b", textTransform: "uppercase" }}
            >
                Organisation
            </Typography>
            <Button
                variant="contained"
                fullWidth
                sx={{
                    mb: 2,
                    borderRadius: 2,
                    background: "#2563eb",
                }}
                onClick={() => setOpenModal(true)}
                >
                + New Tab
            </Button>
            <List sx={{ mt: 1, mb: 3 }}>
                {/* DASHBOARD */}
                
                <ListItemButton
                    onClick={() => {
                        navigate("/");
                        if (isMobile) setOpen(false);
                    }}
                    sx={{
                        borderRadius: 2,
                        mb: 1,
                        color: location.pathname === "/" ? "#fff" : "#cbd5e1",
                        background:
                        location.pathname === "/" ? "#1e293b" : "transparent",
                        "&:hover": {
                            background: "#111827",
                        },
                    }}
                    >
                    <DashboardIcon sx={{ mr: 1 }} />
                    <ListItemText primary="Dashboard" />
                </ListItemButton>

                {/* FINANCE PLANNER */}

                <ListItemButton
                    onClick={() => {
                        navigate("/finance");
                        if (isMobile) setOpen(false);
                    }}
                    sx={{
                        borderRadius: 2,
                        mb: 1,
                        color: location.pathname === "/finance" ? "#fff" : "#cbd5e1",
                        background:
                        location.pathname === "/" ? "#1e293b" : "transparent",
                        "&:hover": {
                            background: "#111827",
                        },
                    }}
                    >
                    <AttachMoneyIcon sx={{ mr: 1 }} />
                    <ListItemText primary="Finance Planner" />
                </ListItemButton>

                {/* Feed */}

                <ListItemButton
                    onClick={() => {
                        navigate("/feed");
                        if (isMobile) setOpen(false);
                    }}
                    sx={{
                        borderRadius: 2,
                        mb: 1,
                        color: location.pathname === "/" ? "#fff" : "#cbd5e1",
                        background:
                        location.pathname === "/" ? "#1e293b" : "transparent",
                        "&:hover": {
                            background: "#111827",
                        },
                    }}
                    >
                    <Box sx={{ mr: 1 }}>
                        <ChatBubbleOutlineIconSharp fontSize="small" />
                    </Box>
                    <ListItemText primary="Feed" />
                </ListItemButton>

                {/* TABS DINÂMICAS */}
                
                {tabs.map((tab) => {
                    const isActive = location.pathname === `/tabs/${tab._id}`;

                    return (
                        <ListItemButton
                            key={tab._id}
                            onClick={() => {
                                navigate(`/tabs/${tab._id}`);
                                if (isMobile) setOpen(false);
                            }}
                            sx={{
                                borderRadius: 2,
                                mb: 1,
                                color: isActive ? "#fff" : "#cbd5e1",
                                background: isActive ? "#1e293b" : "transparent",
                                "&:hover": {
                                    background: "#111827",
                                },
                            }}
                        >
                            <ListItemButton
                                key={tab._id}
                                onClick={() => {
                                    navigate(`/tabs/${tab._id}`);
                                    if (isMobile) setOpen(false);
                                }}
                                sx={{
                                    borderRadius: 2,
                                    mb: 1,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1.5,
                                    color: isActive ? "#fff" : "#cbd5e1",
                                    background: isActive ? "#1e293b" : "transparent",
                                    "&:hover": {
                                        background: "#111827",
                                    },
                                }}
                                >
                                {getTabIcon(tab.type)}
                                <Box>
                                    <Typography fontSize={16} sx={{ color: "#64748b", textTransform: "capitalize" }}>
                                        {tab.type}
                                    </Typography>
                                </Box>
                            </ListItemButton>
                        </ListItemButton>
                    );
                })}
            </List>

            <Divider sx={{ borderColor: "#1f2937", my: 3 }} />

            <Box sx={{ mt: "auto" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            mb: 2,
                            cursor: "pointer",
                        }}
                        onClick={() => navigate(`/users/${user?._id}`)}
                    >
                        <Avatar
                            src={user?.avatar ? getImageUrl(user.avatar) : ""}
                            sx={{
                                width: 52,
                                height: 52,
                            }}
                        >
                            {user?.name?.charAt(0)}
                        </Avatar>
                        <Box>
                            <Typography fontWeight="bold">{user?.name}</Typography>
                            <Typography variant="caption" sx={{ color: "#94a3b8" }}>
                                Personal workspace
                            </Typography>
                        </Box>
                    </Box>
                    <IconButton
                        onClick={() => {
                            navigate("/settings");
                            if (isMobile) setOpen(false);
                        }}
                      sx={{ color: "#94a3b8" }}
                    >
                      <MoreVertIcon />
                    </IconButton>
                </Box>

                <Button
                    fullWidth
                    variant="outlined"
                    onClick={handleLogout}
                    sx={{
                        borderColor: "#334155",
                        color: "#e2e8f0",
                        borderRadius: 2,
                    }}
                >
                    Logout
                </Button>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ display: "flex", minHeight: "100vh", background: "#0b0f14" }}>
            {/* TOP BAR MOBILE */}
            {isMobile && (
                <AppBar
                position="fixed"
                sx={{
                    background: "#070a0f",
                    borderBottom: "1px solid #1f2937",
                }}
                >
                <Toolbar>
                    <IconButton
                    edge="start"
                    color="inherit"
                    onClick={() => setOpen(true)}
                    >
                    <MenuIcon />
                    </IconButton>

                    <Typography variant="h6" sx={{ ml: 2 }}>
                    Orbit Planner
                    </Typography>
                </Toolbar>
                </AppBar>
            )}

            {/* SIDEBAR DESKTOP */}
            {!isMobile && (
                <Drawer
                    variant="permanent"
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        "& .MuiDrawer-paper": {
                        width: drawerWidth,
                        boxSizing: "border-box",
                        background: "#070a0f",
                        borderRight: "1px solid #1f2937",
                        },
                    }}
                    >
                    {drawerContent}
                </Drawer>
            )}

            {/* SIDEBAR MOBILE */}
            {isMobile && (
                <Drawer
                    open={open}
                    onClose={() => setOpen(false)}
                    sx={{
                        "& .MuiDrawer-paper": {
                        width: drawerWidth,
                        background: "#070a0f",
                        },
                    }}
                >
                    {drawerContent}
                </Drawer>
            )}

            {/* CONTENT */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
    p: { xs: 2, sm: 3 }, // Padding responsivo
    mt: isMobile ? 8 : 0,
    minWidth: 0,
    overflowX: "hidden",
    width: "100%",
    maxWidth: "100vw", // Limita a largura máxima
    boxSizing: "border-box",
                }}
            >
                {children}
            </Box>

            {/* MODAL CREATE TAB */}
            <CreateTabModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                onCreated={handleTabCreated}
            />

            {/* AI CHAT */}
            <AIChatButton onClick={() => setOpenAI(true)} />
            <AIChatModal
                open={openAI}
                onClose={() => setOpenAI(false)}
                context={aiContext}
            />
        </Box>
    );
};

export default MainLayout;