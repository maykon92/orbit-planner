import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
} from "@mui/material";
import { useEffect, useState } from "react";
import api from "../services/api";

const CreateItemModal = ({ open, onClose, tabId, tabs = [], onCreated, initialDate }) => {
    const [form, setForm] = useState({
        title: "",
        description: "",
        startDate: "",
        endDate: "",
        selectedTabId: tabId || "",
        destination: "",
        budget: "",
        author: "",
        platform: "",
        genre: "",
        priority: "",
        duration: "",
    });

    const selectedTab = tabs.find((tab) => tab._id === form.selectedTabId);
    const selectedType = selectedTab?.type;

    const handleSubmit = async () => {
        try {
            const { data } = await api.post("/items", {
                tabId: form.selectedTabId || tabId,
                title: form.title,
                description: form.description,
                status: "planned",
                data: {
                    startDate: form.startDate,
                    endDate: form.endDate || form.startDate,

                    destination: form.destination,
                    budget: form.budget ? Number(form.budget) : undefined,

                    author: form.author,

                    platform: form.platform,
                    genre: form.genre,

                    priority: form.priority,

                    duration: form.duration,
                },
            });

            onCreated(data);
            onClose();
            setForm({
                title: "",
                description: "",
                startDate: "",
                endDate: "",
                selectedTabId: tabId || "",
                destination: "",
                budget: "",
                author: "",
                platform: "",
                genre: "",
                priority: "",
                duration: "",
            });
        } catch (error) {
            console.error(error);
            alert("Error creating item");
        }
    };

    useEffect(() => {
        if (initialDate) {
            setForm((prev) => ({
            ...prev,
            startDate: initialDate,
            endDate: initialDate,
            }));
        }
    }, [initialDate]);

    useEffect(() => {
        if (tabId) {
            setForm((prev) => ({
            ...prev,
            selectedTabId: tabId,
            }));
        }
    }, [tabId]);

    const fieldSx = {
        mb: 2,
        input: { color: "#f8fafc" },
        textarea: { color: "#f8fafc" },
        "& .MuiInputLabel-root": {
            color: "#94a3b8",
        },
        "& .MuiInputLabel-root.Mui-focused": {
            color: "#60a5fa",
        },
        "& .MuiOutlinedInput-root": {
            background: "#111827",
            borderRadius: 3,
            color: "#f8fafc",
            "& fieldset": {
            borderColor: "#1f2937",
            },
            "&:hover fieldset": {
            borderColor: "#334155",
            },
            "&.Mui-focused fieldset": {
            borderColor: "#2563eb",
            },
        },
        "& .MuiSelect-icon": {
            color: "#94a3b8",
        },
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                backgroundColor: "#0f172a",
                color: "#f8fafc",
                borderRadius: 4,
                border: "1px solid #1f2937",
                boxShadow: "0 30px 80px rgba(0,0,0,0.65)",
                overflow: "hidden",
                },
            }}
        >
            <DialogTitle
                sx={{
                    fontSize: "1.25rem",
                    fontWeight: 800,
                    color: "#f8fafc",
                    backgroundColor: "#0f172a",
                    borderBottom: "1px solid #1f2937",
                    px: 3,
                    py: 2,
                }}
            >
                Add {selectedType ? selectedType.charAt(0).toUpperCase() + selectedType.slice(1) : "Item"}
            </DialogTitle>

            <DialogContent 
                sx={{
                    backgroundColor: "#0f172a",
                    color: "#cbd5e1",
                    px: 3,
                    py: "24px !important",
                }}
            >
                {tabs.length > 0 && (
                    <TextField
                        fullWidth
                        select
                        label="Tab"
                        margin="normal"
                        value={form.selectedTabId}
                        sx={fieldSx}
                        onChange={(e) =>
                            setForm({ ...form, selectedTabId: e.target.value })
                        }
                    >
                        {tabs.map((tab) => (
                            <MenuItem key={tab._id} value={tab._id}>
                                {tab.type}
                            </MenuItem>
                        ))}
                    </TextField>
                )}

                <TextField
                    fullWidth
                    label="Title"
                    margin="normal"
                    value={form.title}
                    sx={fieldSx}
                    onChange={(e) =>
                        setForm({ ...form, title: e.target.value })
                    }
                />

                <TextField
                    fullWidth
                    label="Description"
                    margin="normal"
                    multiline
                    rows={3}
                    value={form.description}
                    sx={fieldSx}
                    onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                    }
                />

                <TextField
                    fullWidth
                    label="Start Date"
                    type="date"
                    margin="normal"
                    slotProps={{
                        inputLabel: {
                            shrink: true,
                        },
                    }}
                    sx={fieldSx}
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                />

                <TextField
                    fullWidth
                    label="End Date"
                    type="date"
                    margin="normal"
                    slotProps={{
                        inputLabel: {
                            shrink: true,
                        },
                    }}
                    value={form.endDate}
                    sx={fieldSx}
                    onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                />

                {selectedType === "travel" && (
                    <>
                        <TextField
                            fullWidth
                            label="Destination"
                            margin="normal"
                            value={form.destination}
                            sx={fieldSx}
                            onChange={(e) => setForm({ ...form, destination: e.target.value })}
                        />

                        <TextField
                            fullWidth
                            label="Budget"
                            type="number"
                            margin="normal"
                            value={form.budget}
                            sx={fieldSx}
                            onChange={(e) => setForm({ ...form, budget: e.target.value })}
                        />
                    </>
                )}

                {selectedType === "books" && (
                    <TextField
                        fullWidth
                        label="Author"
                        margin="normal"
                        value={form.author}
                        sx={fieldSx}
                        onChange={(e) => setForm({ ...form, author: e.target.value })}
                    />
                )}

                {selectedType === "movies" && (
                    <>
                        <TextField
                            fullWidth
                            label="Platform"
                            margin="normal"
                            value={form.platform}
                            sx={fieldSx}
                            onChange={(e) => setForm({ ...form, platform: e.target.value })}
                        />

                        <TextField
                            fullWidth
                            label="Genre"
                            margin="normal"
                            value={form.genre}
                            sx={fieldSx}
                            onChange={(e) => setForm({ ...form, genre: e.target.value })}
                        />
                    </>
                )}

                {selectedType === "agenda" && (
                    <TextField
                        fullWidth
                        select
                        label="Priority"
                        margin="normal"
                        value={form.priority}
                        sx={fieldSx}
                        SelectProps={{
                            MenuProps: {
                                PaperProps: {
                                sx: {
                                    background: "#0f172a",
                                    color: "#f8fafc",
                                    border: "1px solid #1f2937",
                                },
                                },
                            },
                        }}
                        onChange={(e) => setForm({ ...form, priority: e.target.value })}
                    >
                        <MenuItem value="low">Low</MenuItem>
                        <MenuItem value="medium">Medium</MenuItem>
                        <MenuItem value="high">High</MenuItem>
                    </TextField>
                )}

                {selectedType === "fitness" && (
                    <TextField
                        fullWidth
                        label="Duration"
                        margin="normal"
                        value={form.duration}
                        sx={fieldSx}
                        onChange={(e) => setForm({ ...form, duration: e.target.value })}
                    />
                )}
            </DialogContent>

            <DialogActions
                sx={{
                    p: 3,
                    borderTop: "1px solid #1f2937",
                    backgroundColor: "#0f172a",
                }}
            >
                <Button onClick={onClose} sx={{ color: "#94a3b8" }}>
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    sx={{
                    borderRadius: 3,
                    px: 3,
                    background: "#2563eb",
                    fontWeight: 800,
                    }}
                >
                    Create
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreateItemModal;