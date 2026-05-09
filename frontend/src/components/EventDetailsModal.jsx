import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Chip,
  Box,
} from "@mui/material";

const EventDetailsModal = ({ open, onClose, event }) => {
    if (!event) return null;

    const itemData = event.extendedProps?.itemData || {};

    const DetailRow = ({ label, value }) => {
        if (!value) return null;

        return (
            <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                p: 1.5,
                mb: 1,
                borderRadius: 2,
                background: "#111827",
                border: "1px solid #1f2937",
            }}
            >
            <Typography sx={{ color: "#94a3b8" }}>{label}</Typography>
            <Typography fontWeight={600}>{value}</Typography>
            </Box>
        );
    };

  return (
    <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="sm"
        PaperProps={{
            sx: {
            borderRadius: 4,
            background: "#0f172a",
            color: "#f8fafc",
            border: "1px solid #1f2937",
            boxShadow: "0 25px 70px rgba(0,0,0,0.6)",
            },
        }}
    >
        <DialogTitle
            sx={{
                fontWeight: "bold",
                fontSize: 24,
                borderBottom: "1px solid #1f2937",
            }}
        >
            {event.title}
        </DialogTitle>

        <DialogContent>
            <Chip
            label={event.extendedProps?.tabName}
            sx={{
                mb: 3,
                background: "#1e293b",
                color: "#bfdbfe",
            }}
            />

            <Typography sx={{ mb: 2 }}>
            {event.extendedProps?.description ||
                "No description provided."}
            </Typography>

        <Box sx={{ mt: 3 }}>
            {itemData.destination && (
                <DetailRow label="Destination" value={itemData.destination} />
            )}

            {itemData.budget && (
                <DetailRow label="Budget" value={itemData.budget && `$${itemData.budget}`} />
            )}

            {itemData.author && (
                <DetailRow label="Author" value={itemData.author} />
            )}

            {itemData.platform && (
                <DetailRow label="Platform" value={itemData.platform} />
            )}

            {itemData.genre && (
                <DetailRow label="Genre" value={itemData.genre} />
            )}

            {itemData.priority && (
                <DetailRow label="Priority" value={itemData.priority} />
            )}

            {itemData.duration && (
                <DetailRow label="Duration" value={itemData.duration} />
            )}
        </Box>

        <Box sx={{ mt: 3 }}>
          <DetailRow label="Start" value={event.start?.toLocaleDateString()} />

          <DetailRow
            label="End"
            value={event.end?.toLocaleDateString() || event.start?.toLocaleDateString()}
        />

        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default EventDetailsModal;