import { Fab } from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

const AIChatButton = ({ onClick }) => {
  return (
    <Fab
      onClick={onClick}
      sx={{
        position: "fixed",
        bottom: 30,
        right: 30,
        background: "linear-gradient(135deg, #2563eb, #7c3aed)",
        color: "#fff",
        width: 70,
        height: 70,
        boxShadow: "0 20px 40px rgba(37,99,235,0.45)",
        zIndex: 9999,

        "&:hover": {
          background: "linear-gradient(135deg, #1d4ed8, #6d28d9)",
        },
      }}
    >
      <AutoAwesomeIcon sx={{ fontSize: 34 }} />
    </Fab>
  );
};

export default AIChatButton;