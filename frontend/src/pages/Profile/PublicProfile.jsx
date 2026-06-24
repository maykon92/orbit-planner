import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  Box,
  Typography,
  Avatar,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
} from "@mui/material";
import MessageIcon from "@mui/icons-material/Message";

import MainLayout from "../../layouts/MainLayout";
import PostDetailsModal from "../../components/PostDetailsModal";
import { likePost, addComment } from "../../services/postService";
import {
  getPublicProfile,
  toggleFollowUser,
} from "../../services/userPublicService";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import { getImageUrl } from "../../utils/getImageUrl";
import { createOrGetConversation } from "../../services/conversationService";

const PublicProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { user: loggedUser } = useAuth();
  const { showToast } = useToast();

  const [profile, setProfile] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [openPostDetails, setOpenPostDetails] = useState(false);
  const [detailsPost, setDetailsPost] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      const data = await getPublicProfile(id);

      setProfile(data);

      setIsFollowing(
        data.user.followers?.some(
          (followerId) =>
            followerId.toString() === loggedUser?._id?.toString()
        )
      );
    };

    loadProfile();
  }, [id, loggedUser?._id]);

  const handleFollow = async () => {
    const result = await toggleFollowUser(id);

    setIsFollowing(result.following);

    setProfile((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        followersCount: result.followersCount,
        followingCount: result.followingCount,
      },
    }));

    showToast(result.following ? "User followed." : "User unfollowed.");
  };

  const handleMessage = async () => {
    if (!profile?.user?._id) return;

    const conversation = await createOrGetConversation(profile.user._id);

    navigate("/messages", {
      state: {
        conversationId: conversation._id,
      },
    });
  };

  const handleOpenPostDetails = (post) => {
    setDetailsPost({
      ...post,
      userId: typeof post.userId === "object" ? post.userId : profile.user,
    });

    setOpenPostDetails(true);
  };

  const handleLike = async (postId) => {
    const result = await likePost(postId);

    setProfile((prev) => ({
      ...prev,
      posts: prev.posts.map((post) =>
        post._id === postId
          ? {
              ...post,
              likes: result.post.likes,
            }
          : post
      ),
    }));

    setDetailsPost((prev) =>
      prev?._id === postId
        ? {
            ...prev,
            likes: result.post.likes,
          }
        : prev
    );
  };

  const handleComment = async (postId, text) => {
    if (!text?.trim()) return;

    const updatedPost = await addComment(postId, text);

    setProfile((prev) => ({
      ...prev,
      posts: prev.posts.map((post) =>
        post._id === postId ? updatedPost : post
      ),
    }));

    setDetailsPost((prev) => (prev?._id === postId ? updatedPost : prev));
  };

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
          p: { xs: 2.5, md: 4 },
          mb: 4,
          color: "#f8fafc",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "center", md: "center" },
            textAlign: { xs: "center", md: "left" },
            gap: { xs: 2, md: 3 },
          }}
        >
          <Avatar
            src={user.avatar ? getImageUrl(user.avatar) : ""}
            sx={{
              width: { xs: 92, md: 110 },
              height: { xs: 92, md: 110 },
              border: "3px solid #60a5fa",
              flexShrink: 0,
            }}
          >
            {user.name?.charAt(0)}
          </Avatar>

          <Box sx={{ width: "100%", minWidth: 0 }}>
            <Typography
              variant="h3"
              fontWeight="bold"
              sx={{
                fontSize: { xs: "2rem", md: "3rem" },
                wordBreak: "break-word",
              }}
            >
              {user.name}
            </Typography>

            <Typography
              sx={{
                color: "#cbd5e1",
                mt: 1,
                maxWidth: 600,
                mx: { xs: "auto", md: 0 },
              }}
            >
              {user.bio || "No bio added yet."}
            </Typography>

            {loggedUser?._id !== user._id && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  justifyContent: { xs: "center", md: "flex-start" },
                  gap: 1.5,
                  mt: 2,
                  width: "100%",
                }}
              >
                <Button
                  variant={isFollowing ? "outlined" : "contained"}
                  onClick={handleFollow}
                  sx={{
                    borderRadius: 3,
                    px: 3,
                    fontWeight: 800,
                    width: { xs: "100%", sm: "auto" },
                    color: isFollowing ? "#bfdbfe" : "#fff",
                    borderColor: "#2563eb",
                    background: isFollowing ? "transparent" : "#2563eb",
                    "&:hover": {
                      background: isFollowing
                        ? "rgba(37,99,235,0.12)"
                        : "#1d4ed8",
                    },
                  }}
                >
                  {isFollowing ? "Following" : "Follow"}
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<MessageIcon />}
                  onClick={handleMessage}
                  sx={{
                    borderRadius: 3,
                    px: 3,
                    fontWeight: 800,
                    width: { xs: "100%", sm: "auto" },
                    color: "#bfdbfe",
                    borderColor: "#2563eb",
                    "&:hover": {
                      background: "rgba(37,99,235,0.12)",
                    },
                  }}
                >
                  Message
                </Button>
              </Box>
            )}

            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: { xs: "center", md: "flex-start" },
                gap: 1.2,
                mt: 3,
              }}
            >
              <Chip
                label={`${stats.totalPosts || 0} posts`}
                sx={{ background: "#172554", color: "#bfdbfe" }}
              />

              <Chip
                label={`${stats.totalLikes || 0} likes`}
                sx={{ background: "#14532d", color: "#bbf7d0" }}
              />

              <Chip
                label={`${stats.followersCount || 0} followers`}
                sx={{ background: "#172554", color: "#bfdbfe" }}
              />

              <Chip
                label={`${stats.followingCount || 0} following`}
                sx={{ background: "#1e293b", color: "#cbd5e1" }}
              />
            </Box>
          </Box>
        </Box>
      </Box>

      <Typography
        variant="h5"
        fontWeight="bold"
        sx={{ color: "#f8fafc", mb: 3 }}
      >
        Public Posts
      </Typography>

      <Grid container spacing={3}>
        {posts.map((post) => (
          <Grid xs={12} sm={6} md={4} key={post._id}>
            <Card
              sx={{
                borderRadius: 4,
                background: "#0f172a",
                color: "#f8fafc",
                border: "1px solid #1f2937",
                height: "100%",
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
                    alt={post.caption}
                    onClick={() => handleOpenPostDetails(post)}
                    sx={{
                      width: "100%",
                      height: { xs: 280, md: 320 },
                      objectFit: "cover",
                      background: "#020617",
                      borderRadius: 3,
                      cursor: "pointer",
                      "&:hover": {
                        opacity: 0.92,
                      },
                    }}
                  />
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <PostDetailsModal
        open={openPostDetails}
        onClose={() => setOpenPostDetails(false)}
        post={detailsPost}
        user={loggedUser}
        onLike={handleLike}
        onComment={handleComment}
      />
    </MainLayout>
  );
};

export default PublicProfile;