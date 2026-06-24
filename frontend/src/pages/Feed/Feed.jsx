import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Chip,
  Button,
  TextField,
  IconButton,
  Stack,
  Paper,
  Menu,
  MenuItem,
} from "@mui/material";

import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutlineSharp";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import MessageIcon from "@mui/icons-material/Message";
import EditIcon from "@mui/icons-material/Edit";
import PhotoIcon from "@mui/icons-material/Photo";
import MoodIcon from "@mui/icons-material/Mood";
import PlaceIcon from "@mui/icons-material/Place";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";

import MainLayout from "../../layouts/MainLayout";
import { getImageUrl } from "../../utils/getImageUrl";
import {
  getPublicFeed,
  likePost,
  addComment,
  updatePost,
  deletePost,
} from "../../services/postService";
import { getNotifications } from "../../services/notificationService";
import { getUpcomingEvents } from "../../services/itemService";
import CreatePostModal from "../../components/CreatePostModal";
import EditPostModal from "../../components/EditPostModal";
import PostDetailsModal from "../../components/PostDetailsModal";
import NotificationBell from "../../components/NotificationBell";
import ProfileSearch from "../../components/ProfileSearch";
import SidebarCard from "../../components/SidebarCard";
import NotificationList from "../../components/NotificationList";
import UpcomingEvents from "../../components/UpcomingEvents";

import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import { useConfirm } from "../../contexts/ConfirmContext";

const Feed = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { confirmAction } = useConfirm();
  const navigate = useNavigate();
  const commentInputRefs = useRef({});

  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({});
  const [openComments, setOpenComments] = useState({});
  const [openCreatePost, setOpenCreatePost] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [openEditPost, setOpenEditPost] = useState(false);
  const [openPostDetails, setOpenPostDetails] = useState(false);
  const [detailsPost, setDetailsPost] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  useEffect(() => {
    const loadUpcomingEvents = async () => {
      try {
        const data = await getUpcomingEvents();

        setUpcomingEvents(data);
      } catch (error) {
        console.error(error);
      }
    };

    loadUpcomingEvents();
  }, []);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const data = await getNotifications();
        setNotifications(data);
      } catch (error) {
        console.error(error);
      }
    };

    loadNotifications();
  }, []);

  useEffect(() => {
    const loadFeed = async () => {
      const data = await getPublicFeed();
      setPosts(data);
    };

    loadFeed();
  }, []);

  const handleLike = async (postId) => {
    const result = await likePost(postId);

    setPosts((prev) =>
      prev.map((post) =>
        post._id === postId ? { ...post, likes: result.post.likes } : post
      )
    );

    setDetailsPost((prev) =>
      prev?._id === postId
        ? {
            ...prev,
            likes: result.post?.likes || prev.likes,
          }
        : prev
    );
  };

  const handleComment = async (postId, modalText = null) => {
    const text = modalText ?? comments[postId];

    if (!text?.trim()) return;

    const updatedPost = await addComment(postId, text);

    setPosts((prev) =>
      prev.map((post) => (post._id === postId ? updatedPost : post))
    );

    setDetailsPost((prev) => (prev?._id === postId ? updatedPost : prev));

    setComments((prev) => ({ ...prev, [postId]: "" }));

    setOpenComments((prev) => ({
      ...prev,
      [postId]: true,
    }));
  };

  const handleOpenMenu = (event, post) => {
    setAnchorEl(event.currentTarget);
    setSelectedPost(post);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleOpenEdit = () => {
    setOpenEditPost(true);
    handleCloseMenu();
  };

  const handleSaveEdit = async (formData) => {
    const updatedPost = await updatePost(selectedPost._id, formData);

    setPosts((prev) =>
      prev.map((post) => (post._id === updatedPost._id ? updatedPost : post))
    );

    showToast("Post updated successfully.");
    setOpenEditPost(false);
    setSelectedPost(null);
  };

  const handleDeletePost = async () => {
    if (!selectedPost?._id) return;

    const postToDelete = selectedPost;

    handleCloseMenu();

    const confirmed = await confirmAction({
      title: "Delete post?",
      message:
        "This action cannot be undone. Are you sure you want to delete this post?",
    });

    if (!confirmed) return;

    await deletePost(postToDelete._id);

    setPosts((prev) => prev.filter((post) => post._id !== postToDelete._id));

    showToast("Post deleted successfully.");
    setSelectedPost(null);
  };

  const handleOpenPostDetails = (post) => {
    setDetailsPost(post);
    setOpenPostDetails(true);
  };

  const handleReplyComment = (postId, commentUserName) => {
    const mention = `@${commentUserName || "User"} `;

    setComments((prev) => ({
      ...prev,
      [postId]: mention,
    }));

    setOpenComments((prev) => ({
      ...prev,
      [postId]: true,
    }));

    setTimeout(() => {
      commentInputRefs.current[postId]?.focus();
    }, 100);
  };

  return (
    <MainLayout>
      <Box
        sx={{
          maxWidth: 1180,
          mx: "auto",
          px: { xs: 2, md: 4 },
          pt: 5,
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifycontent="space-between"
          alignitems={{ xs: "flex-start", md: "center" }}
          spacing={3}
          sx={{ mb: 4 }}
        >
          <Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
            <Box
              component="img"
              src="/orbit_planner_logo.png"
              alt="Orbit Planner"
              sx={{
                width: 60,
                height: 60,
                objectFit: "contain",
                filter: `
                  drop-shadow(0 0 10px rgba(96, 165, 250, 0.4))
                  drop-shadow(0 0 20px rgba(139, 92, 246, 0.3))
                `,
              }}
            />
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: 38, md: 52 },
                  fontWeight: 900,
                  color: "#fff",
                  letterSpacing: "-1.5px",
                  lineHeight: 1,
                }}
              >
                Orbit Feed
              </Typography>
            </Box>

            <Typography
              sx={{
                color: "#8fa0bf",
                mt: 1,
                fontSize: 16,
              }}
            >
              Stay connected and share your moments
            </Typography>
          </Box>

          <Stack
            direction="row"
            spacing={2}
            alignitems="left"
            sx={{
              flexShrink: 0,
            }}
          >
            <Box sx={{ width: 300 }}>
              <ProfileSearch />
            </Box>

            <Button
              variant="outlined"
              startIcon={<MessageIcon />}
              onClick={() => navigate("/messages")}
              sx={{
                height: 48,
                minWidth: 150,
                px: 3,
                borderRadius: "14px",
                color: "#fff",
                borderColor: "rgba(72, 127, 255, 0.8)",
                fontWeight: 800,
                background: "rgba(15, 23, 42, 0.6)",
                flexShrink: 0,
                "&:hover": {
                  borderColor: "#5b8cff",
                  background: "rgba(47, 109, 246, 0.16)",
                },
              }}
            >
              Message
            </Button>

            <NotificationBell />
          </Stack>
        </Stack>

        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: "20px",
            background:
              "linear-gradient(145deg, rgba(18,29,53,.95), rgba(12,20,36,.95))",
            border: "1px solid rgba(255,255,255,.06)",
            boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
          }}
        >
          <Stack direction="row" spacing={2} alignitems="center">
            <Avatar
              src={user?.avatar ? getImageUrl(user.avatar) : ""}
              sx={{ width: 50, height: 50 }}
            >
              {user?.name?.charAt(0) || "U"}
            </Avatar>

            <Box
              onClick={() => setOpenCreatePost(true)}
              sx={{
                flex: 1,
                p: 2,
                borderRadius: 4,
                background: "rgba(255,255,255,.04)",
                cursor: "pointer",
                color: "#94a3b8",
                border: "1px solid rgba(255,255,255,.06)",
                "&:hover": {
                  background: "rgba(255,255,255,.07)",
                },
              }}
            >
              What's on your mind?
            </Box>
          </Stack>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 1.5, sm: 4 }}
            sx={{
              mt: 2,
              pl: { xs: 0, sm: 8 },
              color: "#94a3b8",
            }}
          >
          </Stack>
        </Paper>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              lg: "minmax(0, 1fr) 320px",
            },
            gap: 3,
            alignitems: "flex-start",
          }}
        >
          <Box>
            {posts.map((post) => (
              <Card
                key={post._id}
                sx={{
                  mb: 3,
                  borderRadius: 5,
                  background:
                    "linear-gradient(145deg, rgba(20,33,61,.98), rgba(15,23,42,.98))",
                  color: "#f8fafc",
                  border: "1px solid rgba(255,255,255,.07)",
                  boxShadow: "0 20px 50px rgba(0,0,0,0.35)",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignitems: "flex-start",
                      gap: 2,
                      mb: 2,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignitems: "center",
                        gap: 2,
                        cursor: "pointer",
                      }}
                      onClick={() => navigate(`/users/${post.userId?._id}`)}
                    >
                      <Avatar
                        src={
                          post.userId?.avatar
                            ? getImageUrl(post.userId.avatar)
                            : ""
                        }
                        sx={{ width: 46, height: 46 }}
                      >
                        {post.userId?.name?.charAt(0) || "U"}
                      </Avatar>

                      <Box>
                        <Typography fontWeight="bold">
                          {post.userId?.name || "User"}
                        </Typography>
                        <Typography
                          sx={{
                            color: "#64748b",
                            fontSize: 13,
                            mt: 0.5,
                          }}
                        >
                          {post.itemId?.title || "Personal post"}
                        </Typography>
                      </Box>
                    </Box>

                    <Chip
                      label={post.visibility}
                      size="small"
                      sx={{
                        ml: "auto",
                        background: "#172554",
                        color: "#bfdbfe",
                        textTransform: "capitalize",
                      }}
                    />

                    {post.userId?._id === user?._id && (
                      <IconButton
                        onClick={(e) => handleOpenMenu(e, post)}
                        sx={{ color: "#94a3b8" }}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    )}
                  </Box>

                  <Typography
                    sx={{
                      color: "#f1f5f9",
                      lineHeight: 1.7,
                      mb: 2,
                      fontSize: 15,
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {post.caption}
                  </Typography>

                  {post.photos?.length > 0 && (
                    <Box
                      component="img"
                      src={getImageUrl(post.photos[0])}
                      sx={{
                        width: "100%",
                        height: { xs: 320, md: 520 },
                        objectFit: "contain",
                        background: "#020617",
                        borderRadius: 4,
                        mb: 2,
                        transition: "0.3s ease",
                        "&:hover": {
                          transform: "scale(1.01)",
                        },
                        cursor: "pointer",
                      }}
                      onClick={() => handleOpenPostDetails(post)}
                    />
                  )}

                  <Box
                    sx={{
                      display: "flex",
                      alignitems: "center",
                      gap: 2,
                      borderTop: "1px solid rgba(255,255,255,.06)",
                      borderBottom: "1px solid rgba(255,255,255,.06)",
                      py: 1,
                      mb: 2,
                    }}
                  >
                    <Button
                      startIcon={<FavoriteIcon />}
                      onClick={() => handleLike(post._id)}
                      sx={{
                        color: "#f87171",
                        borderRadius: 999,
                        minWidth: 0,
                        px: 1.5,
                        textTransform: "none",
                        fontWeight: 700,
                        "&:hover": {
                          background: "rgba(248,113,113,0.08)",
                        },
                      }}
                    >
                      {post.likes?.length || 0} Likes
                    </Button>

                    <Button
                      startIcon={<ChatBubbleOutlineIcon />}
                      sx={{
                        color: "#93c5fd",
                        borderRadius: 999,
                        minWidth: 0,
                        px: 1.5,
                        textTransform: "none",
                        fontWeight: 700,
                        "&:hover": {
                          background: "rgba(147,197,253,0.08)",
                        },
                      }}
                      onClick={() =>
                        setOpenComments((prev) => ({
                          ...prev,
                          [post._id]: !prev[post._id],
                        }))
                      }
                    >
                      {post.comments?.length || 0} Comments
                    </Button>
                  </Box>

                  {openComments[post._id] && (
                    <Box
                      sx={{
                        mt: 2,
                        pt: 2,
                        borderTop: "1px solid #1f2937",
                        maxHeight: 260,
                        overflowY: "auto",
                        pr: 1,
                        "&::-webkit-scrollbar": {
                          width: "6px",
                        },
                        "&::-webkit-scrollbar-thumb": {
                          background: "#334155",
                          borderRadius: "10px",
                        },
                      }}
                    >
                      {post.comments?.length > 0 ? (
                        post.comments.map((comment, index) => (
                          <Box
                            key={index}
                            sx={{
                              display: "flex",
                              gap: 1.5,
                              mb: 2,
                              alignitems: "flex-start",
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignitems: "center",
                                gap: 2,
                                cursor: "pointer",
                              }}
                              onClick={() => navigate(`/users/${comment.userId?._id}`)}
                            >
                              <Avatar
                                src={
                                  comment.userId?.avatar
                                    ? getImageUrl(comment.userId.avatar)
                                    : ""
                                }
                                sx={{
                                  width: 36,
                                  height: 36,
                                  fontSize: 14,
                                  background: "#4f46e5",
                                }}
                              >
                                {comment.userId?.name?.charAt(0) || "U"}
                              </Avatar>
                            </Box>

                            <Box sx={{ flex: 1 }}>
                              <Box
                                sx={{
                                  p: 1.5,
                                  borderRadius: 3,
                                  background: "#111827",
                                  border: "1px solid #1f2937",
                                }}
                              >
                                <Typography
                                  sx={{
                                    fontWeight: 700,
                                    color: "#e2e8f0",
                                    fontSize: 14,
                                    mb: 0.5,
                                  }}
                                >
                                  {comment.userId?.name || "User"}
                                </Typography>

                                <Typography
                                  sx={{
                                    color: "#cbd5e1",
                                    fontSize: 14,
                                    lineHeight: 1.5,
                                  }}
                                >
                                  {comment.text}
                                </Typography>
                              </Box>

                              <Typography
                                onClick={() =>
                                  handleReplyComment(
                                    post._id,
                                    comment.userId?.name
                                  )
                                }
                                sx={{
                                  color: "#60a5fa",
                                  fontSize: 12,
                                  mt: 0.7,
                                  ml: 1,
                                  cursor: "pointer",
                                  fontWeight: 700,
                                  "&:hover": {
                                    textDecoration: "underline",
                                  },
                                }}
                              >
                                Reply
                              </Typography>
                            </Box>
                          </Box>
                        ))
                      ) : (
                        <Typography sx={{ color: "#64748b", fontSize: 14 }}>
                          No comments yet. Be the first to comment.
                        </Typography>
                      )}
                    </Box>
                  )}

                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      mt: 2,
                      alignitems: "center",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignitems: "center",
                        gap: 2,
                        cursor: "pointer",
                      }}
                      onClick={() => navigate(`/users/${user?._id}`)}
                    >
                      <Avatar
                        sx={{ width: 36, height: 36 }}
                        src={user?.avatar ? getImageUrl(user.avatar) : ""}
                      >
                        {user?.name?.charAt(0) || "U"}
                      </Avatar>
                    </Box>

                    <TextField
                      inputRef={(el) => {
                        commentInputRefs.current[post._id] = el;
                      }}
                      size="small"
                      fullWidth
                      placeholder="Write a comment..."
                      value={comments[post._id] || ""}
                      onChange={(e) =>
                        setComments((prev) => ({
                          ...prev,
                          [post._id]: e.target.value,
                        }))
                      }
                      sx={{
                        input: { color: "#f8fafc" },
                        "& .MuiOutlinedInput-root": {
                          background: "#0b1120",
                          borderRadius: 3,
                          "& fieldset": {
                            borderColor: "#1f2937",
                          },
                          "&:hover fieldset": {
                            borderColor: "#334155",
                          },
                        },
                      }}
                    />

                    <Button
                      variant="contained"
                      onClick={() => handleComment(post._id)}
                      sx={{
                        borderRadius: 3,
                        px: 3,
                        height: 40,
                        background: "#2563eb",
                        fontWeight: 700,
                      }}
                    >
                      Send
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            ))}

            {posts.length === 0 && (
              <Box
                sx={{
                  p: 4,
                  borderRadius: 4,
                  background: "#0f172a",
                  border: "1px dashed #334155",
                  color: "#64748b",
                }}
              >
                No public posts yet.
              </Box>
            )}
          </Box>

          <Box
            sx={{
              display: { xs: "none", lg: "block" },
              position: "sticky",
              top: 24,
            }}
          >
            <SidebarCard title="Upcoming Events" maxListHeight={170}>
              <UpcomingEvents events={upcomingEvents} />
            </SidebarCard>

            <SidebarCard title="Notifications" maxListHeight={260}>
              <NotificationList notifications={notifications} />
            </SidebarCard>
          </Box>
        </Box>
      </Box>

      <CreatePostModal
        open={openCreatePost}
        onClose={() => setOpenCreatePost(false)}
        onCreated={(newPost) => {
          setPosts((prev) => [newPost, ...prev]);
        }}
      />

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        paperprops={{
          sx: {
            background: "#0f172a",
            color: "#f8fafc",
            border: "1px solid #1f2937",
          },
        }}
      >
        <MenuItem onClick={handleOpenEdit}>Edit</MenuItem>
        <MenuItem onClick={handleDeletePost} sx={{ color: "#f87171" }}>
          Delete
        </MenuItem>
      </Menu>

      <EditPostModal
        open={openEditPost}
        onClose={() => setOpenEditPost(false)}
        post={selectedPost}
        onSave={handleSaveEdit}
      />

      <PostDetailsModal
        open={openPostDetails}
        onClose={() => setOpenPostDetails(false)}
        post={detailsPost}
        user={user}
        onLike={handleLike}
        onComment={handleComment}
      />
    </MainLayout>
  );
};

export default Feed;