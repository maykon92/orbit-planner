import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  InputAdornment,
} from "@mui/material";

import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await login(form.email, form.password);
      navigate("/");
    } catch (err) {
      alert("Invalid email or password");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        background:
          "radial-gradient(circle at top left, rgba(37,99,235,0.25), transparent 35%), #070a0f",
        color: "#f8fafc",
      }}
    >
      <Box
        sx={{
          flex: 1,
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          justifyContent: "center",
          px: 8,
          borderRight: "1px solid #1f2937",
        }}
      >
        <Typography variant="h2" fontWeight="bold" sx={{ mb: 2 }}>
          Orbit Planner
        </Typography>

        <Typography sx={{ color: "#94a3b8", fontSize: 20, maxWidth: 520 }}>
          Organise your schedule, trips, books, movies, memories and social
          moments in one intelligent workspace.
        </Typography>
      </Box>

      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 3,
        }}
      >
        <Card
          sx={{
            width: "100%",
            maxWidth: 430,
            borderRadius: 5,
            background: "rgba(15,23,42,0.92)",
            color: "#f8fafc",
            border: "1px solid #1f2937",
            boxShadow: "0 30px 80px rgba(0,0,0,0.55)",
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
              Welcome back
            </Typography>

            <Typography sx={{ color: "#94a3b8", mb: 4 }}>
              Login to continue your Orbit Planner journey.
            </Typography>

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                type="email"
                label="Email"
                margin="normal"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                inputprops={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: "#64748b" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  input: { color: "#f8fafc" },
                  label: { color: "#94a3b8" },
                  "& .MuiOutlinedInput-root": {
                    background: "#0b1120",
                    borderRadius: 3,
                    "& fieldset": { borderColor: "#1f2937" },
                    "&:hover fieldset": { borderColor: "#334155" },
                  },
                }}
              />

              <TextField
                fullWidth
                type="password"
                label="Password"
                margin="normal"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                inputprops={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: "#64748b" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  input: { color: "#f8fafc" },
                  label: { color: "#94a3b8" },
                  "& .MuiOutlinedInput-root": {
                    background: "#0b1120",
                    borderRadius: 3,
                    "& fieldset": { borderColor: "#1f2937" },
                    "&:hover fieldset": { borderColor: "#334155" },
                  },
                }}
              />

              <Button
                fullWidth
                type="submit"
                variant="contained"
                sx={{
                  mt: 3,
                  py: 1.4,
                  borderRadius: 3,
                  background: "#2563eb",
                  fontWeight: 800,
                }}
              >
                Login
              </Button>
            </form>

            <Typography sx={{ color: "#94a3b8", mt: 3, textAlign: "center" }}>
              Don&apos;t have an account?{" "}
              <Link
                to="/register"
                style={{
                  color: "#60a5fa",
                  textDecoration: "none",
                  fontWeight: 700,
                }}
              >
                Create account
              </Link>
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Login;