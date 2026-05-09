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

    return (
        <Dialog open={open} onClose={onClose} fullWidth>
            <DialogTitle>Create Item</DialogTitle>

            <DialogContent>
                {tabs.length > 0 && (
                    <TextField
                        fullWidth
                        select
                        label="Tab"
                        margin="normal"
                        value={form.selectedTabId}
                        onChange={(e) =>
                        setForm({ ...form, selectedTabId: e.target.value })
                        }
                    >
                        {tabs.map((tab) => (
                            <MenuItem key={tab._id} value={tab._id}>
                                {tab.name} ({tab.type})
                            </MenuItem>
                        ))}
                    </TextField>
                )}

                <TextField
                    fullWidth
                    label="Title"
                    margin="normal"
                    value={form.title}
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
                    onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                    }
                />

                <TextField
                    fullWidth
                    label="Start Date"
                    type="date"
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                />

                <TextField
                    fullWidth
                    label="End Date"
                    type="date"
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                    value={form.endDate}
                    onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                />

                {selectedType === "travel" && (
                    <>
                        <TextField
                            fullWidth
                            label="Destination"
                            margin="normal"
                            value={form.destination}
                            onChange={(e) => setForm({ ...form, destination: e.target.value })}
                        />

                        <TextField
                            fullWidth
                            label="Budget"
                            type="number"
                            margin="normal"
                            value={form.budget}
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
                            onChange={(e) => setForm({ ...form, platform: e.target.value })}
                        />

                        <TextField
                            fullWidth
                            label="Genre"
                            margin="normal"
                            value={form.genre}
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
                        onChange={(e) => setForm({ ...form, duration: e.target.value })}
                    />
                )}

            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button variant="contained" onClick={handleSubmit}>
                    Create
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreateItemModal;