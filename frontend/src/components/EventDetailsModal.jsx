import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Chip,
  Box,
  Button,
  Stack,
  IconButton
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";

const EventDetailsModal = ({ open, onClose, event }) => {
    if (!event) return null;

    const itemData = event.extendedProps?.itemData || {};
    const type = event.extendedProps?.type || "General";

    const DetailRow = ({ label, value }) => {
        if (!value) return null;

    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: 2,
          p: 1.5,
          mb: 1,
          borderRadius: 3,
          background: "rgba(15,23,42,.75)",
          border: "1px solid rgba(148,163,184,.14)",
        }}
      >
        <Typography sx={{ color: "#94a3b8", fontWeight: 700 }}>
          {label}
        </Typography>

        <Typography
          sx={{
            color: "#f8fafc",
            fontWeight: 800,
            textAlign: "right",
          }}
        >
          {value}
        </Typography>
      </Box>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      slotProps={{
        paper: {
          sx: {
            background:
              "linear-gradient(145deg, rgba(20,33,61,.98), rgba(15,23,42,.98))",
            color: "#f8fafc",
            borderRadius: 4,
            border: "1px solid rgba(255,255,255,.08)",
            boxShadow: "0 30px 80px rgba(0,0,0,.65)",
            overflow: "hidden",
          },
        },
      }}
    >
        <DialogTitle
            sx={{
                px: 3,
                py: 2.5,
                borderBottom: "1px solid rgba(255,255,255,.08)",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                }}
            >
                <Box>
                <Typography
                    sx={{
                    fontSize: 30,
                    fontWeight: 900,
                    mb: 1,
                    }}
                >
                    {event.title}
                </Typography>

                <Chip
                    label={type}
                    size="small"
                    sx={{
                    background: "rgba(96,165,250,.15)",
                    color: "#bfdbfe",
                    fontWeight: 700,
                    textTransform: "capitalize",
                    }}
                />
                </Box>

                <IconButton
                    onClick={onClose}
                    sx={{
                        color:"#94a3b8",
                        width:40,
                        height:40,

                        "&:hover":{
                            bgcolor:"rgba(255,255,255,.08)",
                            color:"#fff",
                            transform:"rotate(90deg)",
                        }
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </Box>
        </DialogTitle>

        <DialogContent
            sx={{
            px: 3,
            py: "24px !important",
            }}
        >
            <Typography
            sx={{
                mb: 3,
                color: "#cbd5e1",
                lineHeight: 1.7,
            }}
            >
            {event.extendedProps?.description || "No description provided."}
            </Typography>

            <Box>
            <DetailRow label="Destination" value={itemData.destination} />
            <DetailRow
                label="Budget"
                value={itemData.budget ? `$${itemData.budget}` : null}
            />
            <DetailRow label="Author" value={itemData.author} />
            <DetailRow label="Platform" value={itemData.platform} />
            <DetailRow label="Genre" value={itemData.genre} />
            <DetailRow label="Priority" value={itemData.priority} />
            <DetailRow label="Duration" value={itemData.duration} />
            </Box>

            <Box sx={{ mt: 3 }}>
            <DetailRow label="Start" value={event.start?.toLocaleDateString()} />
            <DetailRow
                label="End"
                value={
                event.end?.toLocaleDateString() ||
                event.start?.toLocaleDateString()
                }
            />
            </Box>
        </DialogContent>

        <DialogActions
            sx={{
            px: 3,
            py: 2,
            borderTop: "1px solid rgba(255,255,255,.08)",
            }}
        >

            <Box sx={{ flex: 1 }} />

            <Button
                onClick={onClose}
                sx={{
                    color: "#94a3b8",
                    fontWeight: 800,
                    textTransform: "none",
                }}
            >
                Cancel
            </Button>
        </DialogActions>
    </Dialog>
  );
};

export default EventDetailsModal;