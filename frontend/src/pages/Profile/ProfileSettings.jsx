import { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Avatar,
} from "@mui/material";

import MainLayout from "../../layouts/MainLayout";
import { useAuth } from "../../contexts/AuthContext";
import { updateProfile } from "../../services/userService";
import { getImageUrl } from "../../utils/getImageUrl";
import api from "../../services/api";

const ProfileSettings = () => {
  const { user, updateUser } = useAuth();

  const [form, setForm] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
    avatar: user?.avatar || "",
  });

  const handleUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    const { data } = await api.post("/uploads", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    setForm((prev) => ({
      ...prev,
      avatar: data.imageUrl,
    }));
  };

  const handleSubmit = async () => {
    try {
      const updatedUser = await updateProfile(form);
      updateUser(updatedUser);

      alert("Profile updated successfully.");
    } catch (error) {
      console.error(error);
      alert("Error updating profile.");
    }
  };

  return (
    <MainLayout>
      <Box sx={{ maxWidth: 720 }}>
        <Typography variant="h3" fontWeight="bold" sx={{ color: "#f8fafc", mb: 1 }}>
          Profile Settings
        </Typography>

        <Typography sx={{ color: "#94a3b8", mb: 4 }}>
          Manage your personal information and profile picture.
        </Typography>

        <Card
          sx={{
            borderRadius: 4,
            background: "#0f172a",
            color: "#f8fafc",
            border: "1px solid #1f2937",
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 4 }}>
              <Avatar
                src={getImageUrl(form.avatar)}
                sx={{ width: 90, height: 90 }}
              >
                {form.name?.charAt(0)}
              </Avatar>

              <Button variant="outlined" component="label" sx={{ color: "#e2e8f0" }}>
                Upload Photo
                <input hidden type="file" accept="image/*" onChange={handleUpload} />
              </Button>
            </Box>

            <TextField
              fullWidth
              label="Name"
              margin="normal"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              sx={{
                input: { color: "#f8fafc" },
                label: { color: "#94a3b8" },
              }}
            />

            <TextField
              fullWidth
              label="Bio"
              margin="normal"
              multiline
              rows={4}
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              sx={{
                textarea: { color: "#f8fafc" },
                label: { color: "#94a3b8" },
              }}
            />

            <Button
              variant="contained"
              sx={{ mt: 3, borderRadius: 2, background: "#2563eb" }}
              onClick={handleSubmit}
            >
              Save Changes
            </Button>
          </CardContent>
        </Card>
      </Box>
    </MainLayout>
  );
};

export default ProfileSettings;