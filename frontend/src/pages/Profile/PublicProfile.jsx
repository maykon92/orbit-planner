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
import { getPublicProfile } from "../../services/userPublicService";
import { toggleFollowUser } from "../../services/userPublicService";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import { getImageUrl } from "../../utils/getImageUrl";
import { createOrGetConversation } from "../../services/conversationService";

const PublicProfile = () => {
  const { id } = useParams();
  const { user: loggedUser } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [isFollowing, setIsFollowing] = useState(false);
  const [profile, setProfile] = useState(null);
  const [openPostDetails, setOpenPostDetails] = useState(false);
  const [detailsPost, setDetailsPost] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      const data = await getPublicProfile(id);
      
      setIsFollowing(
        data.user.followers?.some(
          (followerId) => followerId.toString() === loggedUser?._id?.toString()
        )
      );

      setProfile(data);
    };

    loadProfile();
  }, [id]);

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
    const conversation = await createOrGetConversation(user._id);
    navigate("/messages", {
      state: {
        conversationId: conversation._id,
      },
    });
  };

  const handleOpenPostDetails = (post) => {
    setDetailsPost({
      ...post,
      userId:
        typeof post.userId === "object"
          ? post.userId
          : profile.user,
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

    setDetailsPost((prev) =>
      prev?._id === postId ? updatedPost : prev
    );
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

            {loggedUser?._id !== user._id && (
              <Button
                variant={isFollowing ? "outlined" : "contained"}
                onClick={handleFollow}
                sx={{
                  mt: 2,
                  borderRadius: 3,
                  px: 3,
                  fontWeight: 800,
                  color: isFollowing ? "#bfdbfe" : "#fff",
                  borderColor: "#2563eb",
                  background: isFollowing ? "transparent" : "#2563eb",
                  "&:hover": {
                    background: isFollowing ? "rgba(37,99,235,0.12)" : "#1d4ed8",
                  },
                }}
              >
                {isFollowing ? "Following" : "Follow"}
              </Button>
            )}

            {loggedUser?._id !== user._id && (
              <Button
                variant="outlined"
                startIcon={<MessageIcon />}
                onClick={handleMessage}
                sx={{
                  mt: 2,
                  ml: 2,
                  borderRadius: 3,
                  px: 3,
                  fontWeight: 800,
                  color: "#bfdbfe",
                  borderColor: "#2563eb",
                  "&:hover": {
                    background: "rgba(37,99,235,0.12)",
                  },
                }}
              >
                Message
              </Button>
            )}

            <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
              <Chip
                label={`${stats.totalPosts} posts`}
                sx={{ background: "#172554", color: "#bfdbfe" }}
              />
              <Chip
                label={`${stats.totalLikes} likes`}
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
                      cursor: "pointer",
                      "&:hover": {
                        opacity: 0.92,
                      },
                    }}
                    onClick={() => handleOpenPostDetails(post)}
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