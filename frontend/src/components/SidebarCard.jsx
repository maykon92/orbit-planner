import { Box, Card, CardContent, Typography } from "@mui/material";

const SidebarCard = ({ title, children, maxListHeight = 220 }) => {
  return (
    <Card
      sx={{
        mb: 3,
        borderRadius: 5,
        background:
          "linear-gradient(145deg, rgba(20,33,61,.98), rgba(15,23,42,.98))",
        border: "1px solid rgba(255,255,255,.07)",
        color: "#f8fafc",
      }}
    >
      <CardContent>
        <Typography sx={{ fontWeight: 900, fontSize: 20, mb: 2 }}>
          {title}
        </Typography>

        <Box
          sx={{
            maxHeight: maxListHeight,
            overflowY: "auto",
            pr: 1,
            "&::-webkit-scrollbar": { width: "6px" },
            "&::-webkit-scrollbar-thumb": {
              background: "rgba(255,255,255,.18)",
              borderRadius: "10px",
            },
          }}
        >
          {children}
        </Box>
      </CardContent>
    </Card>
  );
};

export default SidebarCard;