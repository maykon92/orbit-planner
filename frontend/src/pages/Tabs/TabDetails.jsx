import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Chip,
} from "@mui/material";

import MainLayout from "../../layouts/MainLayout";
import api from "../../services/api";
import CreateItemModal from "../../components/CreateItemModal";
import EditTabModal from "../../components/EditTabModal";
import { updateTab, deleteTab } from "../../services/tabService";
import { useToast } from "../../contexts/ToastContext";
import { useConfirm } from "../../contexts/ConfirmContext";

import Button from "@mui/material/Button";
import EventIcon from "@mui/icons-material/Event";
import FlightIcon from "@mui/icons-material/Flight";
import MovieIcon from "@mui/icons-material/Movie";
import BookIcon from "@mui/icons-material/MenuBook";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import DashboardIcon from "@mui/icons-material/Dashboard";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";


const TabDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { confirmAction } = useConfirm();

    const [tab, setTab] = useState(null);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [openEditTab, setOpenEditTab] = useState(false);

    useEffect(() => {
        const loadTabData = async () => {
            try {
                const tabResponse = await api.get(`/tabs/${id}`);
                const itemsResponse = await api.get(`/items/tab/${id}`);

                setTab(tabResponse.data);
                setItems(itemsResponse.data.items || itemsResponse.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        loadTabData();
    }, [id]);

    const handleItemCreated = (newItem) => {
        setItems((prev) => [newItem, ...prev]);
    };

    const handleOpenMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
       setAnchorEl(null);
    };

    const handleSaveTab = async (formData) => {
        const updatedTab = await updateTab(id, formData);
        setTab(updatedTab);
        setOpenEditTab(false);
        showToast("Tab updated successfully.");
    };

    const handleDeleteTab = async () => {
        const confirmed = await confirmAction({
            title: "Delete tab?",
            message:
            "This will delete this tab and all related items. This action cannot be undone.",
        });

        if (!confirmed) return;

        await deleteTab(id);

        showToast("Tab deleted successfully.");
        navigate("/");
    };

    const getTabIcon = (type) => {
        switch (type) {
            case "agenda":
            return <EventIcon sx={{ fontSize: 34 }} />;
            case "travel":
            return <FlightIcon sx={{ fontSize: 34 }} />;
            case "movies":
            return <MovieIcon sx={{ fontSize: 34 }} />;
            case "books":
            return <BookIcon sx={{ fontSize: 34 }} />;
            case "fitness":
            return <FitnessCenterIcon sx={{ fontSize: 34 }} />;
            default:
            return <DashboardIcon sx={{ fontSize: 34 }} />;
        }
    };

    return (
        <MainLayout>
            {loading ? (
                <CircularProgress />
            ) : (
                <>
                <Box
                    sx={{
                        mb: 5,
                        p: 4,
                        borderRadius: 5,
                        position: "relative",
                        background:
                        "linear-gradient(135deg, rgba(15,23,42,0.95), rgba(30,41,59,0.7))",
                        border: "1px solid #1f2937",
                        boxShadow: "0 25px 60px rgba(0,0,0,0.35)",
                    }}
                >
                    <IconButton
                        onClick={handleOpenMenu}
                        sx={{
                            position: "absolute",
                            top: 24,
                            right: 24,
                            color: "#94a3b8",
                        }}
                        >
                        <MoreVertIcon />
                    </IconButton>
                    {/* HEADER (Ícone + Nome + Tipo) */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                        {/* ÍCONE GRANDE */}
                        <Box
                            sx={{
                                width: 64,
                                height: 64,
                                borderRadius: 4,
                                background: "#1e293b",
                                color: "#bfdbfe",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                            >
                            {getTabIcon(tab?.type)}
                        </Box>

                        {/* NOME + TYPE */}
                        <Box>
                            <Chip
                                label={tab?.type}
                                size="small"
                                sx={{
                                background: "#172554",
                                color: "#bfdbfe",
                                mb: 1,
                                fontWeight: 600,
                                }}
                            />

                            <Typography
                                variant="h3"
                                sx={{
                                    color: "#f8fafc",
                                    fontWeight: "bold",
                                    textTransform: "capitalize",
                                }}
                            >
                                {tab?.type}
                            </Typography>
                        </Box>
                    </Box>

                    {/* DESCRIÇÃO */}
                    <Typography
                        sx={{
                        color: "#94a3b8",
                        fontSize: 16,
                        maxWidth: 600,
                        lineHeight: 1.6,
                        mb: 3,
                        }}
                    >
                        Manage all your {tab?.type} items in one intelligent and organised space.
                    </Typography>

                    {/* BOTÃO */}
                    <Button
                        variant="contained"
                        sx={{
                        borderRadius: 2,
                        background: "#2563eb",
                        px: 3,
                        py: 1,
                        fontWeight: 700,
                        }}
                        onClick={() => setOpenModal(true)}
                    >
                        + Add Item
                    </Button>
                </Box>

                <Grid container spacing={3}>
                    {items.map((item) => (
                        <Grid item xs={12} sm={6} md={4} key={item._id}>
                            <Card
                                sx={{
                                    p: 3,
                                    height: 240,
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",

                                    borderRadius: 4,

                                    background:
                                    "linear-gradient(135deg, rgba(15,23,42,0.96), rgba(30,41,59,0.72))",

                                    border: "1px solid #1f2937",

                                    transition: "0.25s",

                                    "&:hover": {
                                        transform: "translateY(-4px)",
                                        borderColor: "#2563eb",
                                        boxShadow: "0 15px 40px rgba(37,99,235,0.15)",
                                    },
                                }}
                            >
                                <CardContent sx={{ p: 3 }}>
                                    <Chip
                                        label={item.status}
                                        size="small"
                                        sx={{
                                            background: "#172554",
                                            color: "#bfdbfe",
                                            mb: 2,
                                            fontWeight: 600,
                                        }}
                                    />

                                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                                        {item.title}
                                    </Typography>

                                    <Typography
                                        sx={{
                                            color: "#94a3b8",
                                            fontSize: 14,
                                            lineHeight: 1.6,
                                            mb: 2,
                                        }}
                                    >
                                        {item.description || "No description provided."}
                                    </Typography>

                                    {item.data?.destination && (
                                        <Typography sx={{ color: "#64748b", fontSize: 13 }}>
                                            Destination: {item.data.destination}
                                        </Typography>
                                    )}

                                    {item.data?.budget && (
                                        <Typography sx={{ color: "#64748b", fontSize: 13 }}>
                                            Budget: ${item.data.budget}
                                        </Typography>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
                        {items.length === 0 && (
                        <Box
                            sx={{
                            mt: 4,
                            p: 4,
                            borderRadius: 4,
                            border: "1px dashed #334155",
                            background: "rgba(15, 23, 42, 0.45)",
                            maxWidth: 520,
                            }}
                        >
                            <Typography fontWeight="bold" sx={{ color: "#e2e8f0", mb: 1 }}>
                                No items yet
                            </Typography>

                            <Typography sx={{ color: "#64748b" }}>
                                Start by creating your first item inside this tab.
                            </Typography>
                        </Box>
                    )}
                </>
            )}
            <CreateItemModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                tabId={id}
                tabs={tab ? [tab] : []}
                onCreated={(newItem) => setItems((prev) => [...prev, newItem])}
            />

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
                PaperProps={{
                    sx: {
                    background: "#0f172a",
                    color: "#f8fafc",
                    border: "1px solid #1f2937",
                    },
                }}
            >
                <MenuItem
                    onClick={() => {
                    setOpenEditTab(true);
                    handleCloseMenu();
                    }}
                >
                    Edit Tab
                </MenuItem>

                <MenuItem onClick={handleDeleteTab} sx={{ color: "#f87171" }}>
                    Delete Tab
                </MenuItem>
            </Menu>

            <EditTabModal
                open={openEditTab}
                onClose={() => setOpenEditTab(false)}
                tab={tab}
                onSave={handleSaveTab}
            />
        </MainLayout>
    );
};

export default TabDetails;