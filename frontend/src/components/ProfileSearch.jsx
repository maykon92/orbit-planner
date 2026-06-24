import { useState } from "react";
import {
  Avatar,
  Box,
  IconButton,
  InputBase,
  Paper,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";

import { searchProfiles } from "../services/userService";
import { getImageUrl } from "../utils/getImageUrl";

const ProfileSearch = () => {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = async (value) => {
    setQuery(value);

    if (value.trim().length < 2) {
      setUsers([]);
      return;
    }

    try {
      const data = await searchProfiles(value);
      setUsers(data);
    } catch (error) {
      console.error("Error searching profiles:", error);
      setUsers([]);
    }
  };

  const handleClear = () => {
    setQuery("");
    setUsers([]);
  };

  const handleOpenProfile = (userId) => {
    setQuery("");
    setUsers([]);
    setIsFocused(false);
    navigate(`/users/${userId}`);
  };

  const showResults = isFocused && query.trim().length >= 2 && users.length > 0;

  return (
    <Box
        sx={{
            position: "relative",
            width: "90%",
            zIndex: 50,
        }}
    >
      <Paper
        elevation={0}
        sx={{
          height: 48,
          width: "100%",
          display: "flex",
          alignItems: "center",
          px: 1.5,
          borderRadius: "14px",
          background: "rgba(15, 23, 42, 0.75)",
          border: showResults
            ? "1px solid rgba(96, 165, 250, 0.9)"
            : "1px solid rgba(72, 127, 255, 0.45)",
          boxShadow: showResults
            ? "0 12px 30px rgba(47, 109, 246, 0.18)"
            : "none",
        }}
      >
        <SearchIcon sx={{ color: "#8fa0bf", mr: 1 }} />

        <InputBase
          value={query}
          onFocus={() => setIsFocused(true)}
          onChange={(event) => handleSearch(event.target.value)}
          placeholder="Search profiles"
          sx={{
            color: "#fff",
            flex: 1,
            fontSize: 14,
            fontWeight: 700,
          }}
        />

        {query && (
          <IconButton size="small" onClick={handleClear} sx={{ color: "#8fa0bf" }}>
            <CloseIcon sx={{ fontSize: 18 }} />
          </IconButton>
        )}
      </Paper>

      {showResults && (
        <Paper
          elevation={0}
          sx={{
            position: "absolute",
            top: 58,
            left: 0,
            width: "100%",
            borderRadius: "16px",
            background: "#111827",
            border: "1px solid rgba(72,127,255,.35)",
            boxShadow: "0 24px 60px rgba(0,0,0,.55)",
            overflow: "hidden",
            zIndex: 9999,
          }}
        >
          {users.map((item) => (
            <Box
              key={item._id}
              onMouseDown={() => handleOpenProfile(item._id)}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                px: 2,
                py: 1.5,
                cursor: "pointer",
                "&:hover": {
                  background: "rgba(47,109,246,.16)",
                },
              }}
            >
              <Avatar
                src={item.avatar ? getImageUrl(item.avatar) : ""}
                sx={{ width: 44, height: 44 }}
              >
                {item.name?.charAt(0) || "U"}
              </Avatar>

              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ color: "#fff", fontWeight: 800 }}>
                  {item.name}
                </Typography>

                <Typography
                  sx={{
                    color: "#cbd5e1",
                    fontSize: 13,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.bio || item.email}
                </Typography>
              </Box>
            </Box>
          ))}
        </Paper>
      )}
    </Box>
  );
};

export default ProfileSearch;