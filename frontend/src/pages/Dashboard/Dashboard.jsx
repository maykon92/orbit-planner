import { useEffect, useState } from "react";
import {
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Box,
  Chip,
} from "@mui/material";
import MainLayout from "../../layouts/MainLayout";
import { getTabs } from "../../services/tabService";

const Dashboard = () => {
  const [tabs, setTabs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTabs = async () => {
      try {
        const data = await getTabs();
        setTabs(data);
      } finally {
        setLoading(false);
      }
    };

    loadTabs();
  }, []);

  return (
    <MainLayout>
      <Box
        sx={{
          mb: 5,
          p: 4,
          borderRadius: 5,

          background:
            "linear-gradient(135deg, rgba(15,23,42,0.96), rgba(30,41,59,0.72))",

          border: "1px solid #1f2937",

          boxShadow: "0 25px 60px rgba(0,0,0,0.35)",
        }}
      >
        <Typography
          variant="h2"
          fontWeight="bold"
          sx={{
            color: "#f8fafc",
            mb: 2,
          }}
        >
          Your Life, Organised.
        </Typography>

        <Typography
          sx={{
            color: "#94a3b8",
            fontSize: 20,
            maxWidth: 720,
            lineHeight: 1.7,
          }}
        >
          Manage your schedule, trips, books, movies and personal memories in one intelligent workspace.
        </Typography>
      </Box>

      {loading ? (
        <CircularProgress />
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(2, minmax(0, 1fr))",
              xl: "repeat(3, minmax(0, 1fr))",
            },
            gap: 3,
            width: "100%",
          }}
        >
          {tabs.map((tab) => (
            <Card
              key={tab._id}
              sx={{
                minHeight: 240,
                width: "100%",
                borderRadius: 4,
                background:
                  "linear-gradient(145deg, rgba(15,23,42,0.96), rgba(17,24,39,0.95))",
                border: "1px solid #1f2937",
                color: "#f8fafc",
                boxShadow: "0 20px 50px rgba(0,0,0,0.35)",
                transition: "all 0.25s ease",
                cursor: "pointer",
                "&:hover": {
                  transform: "translateY(-5px)",
                  borderColor: "#334155",
                },
              }}
            >
              <CardContent
                sx={{
                  p: 4,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Chip
                  label={tab.type}
                  size="small"
                  sx={{
                    alignSelf: "flex-start",
                    mb: 3,
                    background: "#1e293b",
                    color: "#cbd5e1",
                    fontWeight: 600,
                  }}
                />

                <Typography
                  variant="h5"
                  fontWeight="bold"
                  sx={{ color: "#f8fafc", mb: 1.5, textTransform: "capitalize" }}
                >
                  {tab.type}
                </Typography>

                <Typography sx={{ color: "#94a3b8", lineHeight: 1.6 }}>
                  AI-powered space for your {tab.type} organisation.
                </Typography>

                <Typography variant="caption" sx={{ color: "#64748b", mt: "auto" }}>
                  AI Assistant: {tab.aiEnabled ? "Enabled" : "Disabled"}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </MainLayout>
  );
};

export default Dashboard;