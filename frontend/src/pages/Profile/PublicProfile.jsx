import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Avatar,
  Card,
  CardContent,
  Grid,
  Chip,
} from "@mui/material";

import MainLayout from "../../layouts/MainLayout";
import { getPublicProfile } from "../../services/userPublicService";
import { getImageUrl } from "../../utils/getImageUrl";

const PublicProfile = () => {
  const { id } = useParams();

  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      const data = await getPublicProfile(id);
      setProfile(data);
    };

    loadProfile();
  }, [id]);

  if (!profile) {
    return (
      <MainLayout>
        <Typography sx={{ color: "#94a3b8" }}>Loading profile...</Typography>
      </MainLayout>
    );
  }

  const { user, posts, stats } = profile;

  return (
    <MainLayout>
      <Box
        sx={{
          borderRadius: 5,
          background:
            "linear-gradient(135deg, rgba(37,99,235,0.35), rgba(15,23,42,0.95))",
          border: "1px solid #1f2937",
          p: 4,
          mb: 4,
          color: "#f8fafc",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          <Avatar
            src={user.avatar ? getImageUrl(user.avatar) : ""}
            sx={{
              width: 110,
              height: 110,
              border: "3px solid #60a5fa",
            }}
          >
            {user.name?.charAt(0)}
          </Avatar>

          <Box>
            <Typography variant="h3" fontWeight="bold">
              {user.name}
            </Typography>

            <Typography sx={{ color: "#cbd5e1", mt: 1, maxWidth: 600 }}>
              {user.bio || "No bio added yet."}
            </Typography>

            <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
              <Chip
                label={`${stats.totalPosts} posts`}
                sx={{ background: "#172554", color: "#bfdbfe" }}
              />
              <Chip
                label={`${stats.totalLikes} likes`}
                sx={{ background: "#14532d", color: "#bbf7d0" }}
              />
            </Box>
          </Box>
        </Box>
      </Box>

      <Typography variant="h5" fontWeight="bold" sx={{ color: "#f8fafc", mb: 3 }}>
        Public Posts
      </Typography>

      <Grid container spacing={3}>
        {posts.map((post) => (
          <Grid item xs={12} md={6} key={post._id}>
            <Card
              sx={{
                borderRadius: 4,
                background: "#0f172a",
                color: "#f8fafc",
                border: "1px solid #1f2937",
              }}
            >
              <CardContent>
                <Chip
                  label={post.itemId?.type || "post"}
                  size="small"
                  sx={{
                    background: "#1e293b",
                    color: "#bfdbfe",
                    mb: 2,
                  }}
                />

                <Typography sx={{ color: "#cbd5e1", mb: 2 }}>
                  {post.caption}
                </Typography>

                {post.photos?.length > 0 && (
                  <Box
                    component="img"
                    src={getImageUrl(post.photos[0])}
                    sx={{
                      width: "100%",
                      maxHeight: 320,
                      objectFit: "contain",
                      background: "#020617",
                      borderRadius: 3,
                    }}
                  />
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </MainLayout>
  );
};

export default PublicProfile;