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
} from "@mui/material";

import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutlineSharp";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import MainLayout from "../../layouts/MainLayout";
import { getPublicFeed, likePost, addComment } from "../../services/postService";
import CreatePostModal from "../../components/CreatePostModal";
import { getImageUrl } from "../../utils/getImageUrl";
import EditPostModal from "../../components/EditPostModal";
import { updatePost, deletePost } from "../../services/postService";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import { useConfirm } from "../../contexts/ConfirmContext";
import PostDetailsModal from "../../components/PostDetailsModal";

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
    console.log("Updated post after comment:", updatedPost);
    setPosts((prev) =>
      prev.map((post) => (post._id === postId ? updatedPost : post))
    );

    setDetailsPost((prev) =>
      prev?._id === postId ? updatedPost : prev
    );

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
      <Box sx={{ maxWidth: 760, mx: "auto" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
            gap: 2,
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: { xs: 38, md: 52 },
                fontWeight: 800,
                color: "#f8fafc",
                lineHeight: 1,
                letterSpacing: "-2px",
              }}
            >
              Social Feed
            </Typography>
          </Box>

          <Button
            variant="contained"
            sx={{
              borderRadius: 3,
              background: "#2563eb",
              fontWeight: 700,
              px: 3,
            }}
            onClick={() => setOpenCreatePost(true)}
          >
            Create Post
          </Button>
        </Box>

        {posts.map((post) => (
          <Card
            key={post._id}
            sx={{
              mb: 3,
              borderRadius: 4,
              background: "#0f172a",
              color: "#f8fafc",
              border: "1px solid #1f2937",
              boxShadow: "0 20px 50px rgba(0,0,0,0.35)",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    mb: 2,
                    cursor: "pointer",
                  }}
                  onClick={() => navigate(`/users/${post.userId?._id}`)}
                >
                  <Avatar src={post.userId?.avatar ? getImageUrl(post.userId.avatar) : ""}>
                    {post.userId?.name?.charAt(0) || "U"}
                  </Avatar>

                  <Box>
                    <Typography fontWeight="bold">{post.userId?.name || "User"}</Typography>
                    <Typography sx={{ color: "#64748b", fontSize: 13, mt: 0.5, }}>
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

              <Typography sx={{ color: "#f1f5f9", lineHeight: 1.7, mb: 2, fontSize: 15, whiteSpace: "pre-wrap", }}>
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
                    borderRadius: 3,
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

              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Button
                  startIcon={<FavoriteIcon />}
                  onClick={() => handleLike(post._id)}
                  sx={{
                    color: "#f87171",
                    borderRadius: 999,
                    minWidth: 0,
                    px: 1.5,
                    "&:hover": {
                      background: "rgba(248,113,113,0.08)",
                    },
                  }}
                >
                  {post.likes?.length || 0}
                </Button>

                <Button
                  startIcon={<ChatBubbleOutlineIcon />}
                  sx={{
                    color: "#93c5fd",
                    borderRadius: 999,
                    minWidth: 0,
                    px: 1.5,
                    "&:hover": {
                      background: "rgba(248,113,113,0.08)",
                    },
                  }}
                  onClick={() =>
                    setOpenComments((prev) => ({
                      ...prev,
                      [post._id]: !prev[post._id],
                    }))
                  }
                >
                  {post.comments?.length || 0}
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
                          alignItems: "flex-start",
                        }}
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
                        ></Avatar>

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
                              handleReplyComment(post._id, comment.userId?.name)
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

              <Box sx={{ display: "flex", gap: 1, mt: 2, alignItems: "center" }}>
                <Avatar 
                  sx={{ width: 36, height: 36 }}
                  src={
                    user?.avatar ? getImageUrl(user.avatar) : ""
                  }
                >
                  {post.userId?.name?.charAt(0) || "U"}
                </Avatar>
                {console.log("Comments for post", post._id, ":", comments[post._id])}

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
        PaperProps={{
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