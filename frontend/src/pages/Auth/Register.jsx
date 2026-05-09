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

import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await register(form);
      navigate("/");
    } catch (err) {
      alert("Error creating account");
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
          Create your personal workspace and organise your entire life in one
          intelligent platform.
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
              Create account
            </Typography>

            <Typography sx={{ color: "#94a3b8", mb: 4 }}>
              Start building your Orbit Planner experience.
            </Typography>

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Full name"
                margin="normal"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon sx={{ color: "#64748b" }} />
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
                type="email"
                label="Email"
                margin="normal"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                InputProps={{
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
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                InputProps={{
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
                Create Account
              </Button>
            </form>

            <Typography
              sx={{
                color: "#94a3b8",
                mt: 3,
                textAlign: "center",
              }}
            >
              Already have an account?{" "}
              <Link
                to="/login"
                style={{
                  color: "#60a5fa",
                  textDecoration: "none",
                  fontWeight: 700,
                }}
              >
                Login
              </Link>
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Register;