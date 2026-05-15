import {
  Dialog,
  Box,
  Typography,
  Avatar,
  IconButton,
  TextField,
  Button,
  Chip,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineSharpIcon from "@mui/icons-material/ChatBubbleOutlineSharp";

import { useState } from "react";
import { getImageUrl } from "../utils/getImageUrl";

const PostDetailsModal = ({
  open,
  onClose,
  post,
  user,
  onLike,
  onComment,
}) => {
  const [commentText, setCommentText] = useState("");

  if (!post) return null;

  const author =
    typeof post.userId === "object"
        ? post.userId
        : typeof post.user === "object"
        ? post.user
        : post.author || null;

  const image = post.photos?.[0];

  const handleSendComment = async () => {
    if (!commentText.trim()) return;

    await onComment(post._id, commentText);
    setCommentText("");
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            height: { xs: "92vh", md: "82vh" },
            borderRadius: 4,
            overflow: "hidden",
            background: "#0f172a",
            border: "1px solid #1f2937",
          },
        },
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "1.3fr 0.8fr",
          },
          height: "100%",
        }}
      >
        <Box
          sx={{
            background: "#020617",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: { xs: 360, md: "100%" },
          }}
        >
          {image && (
            <Box
              component="img"
              src={getImageUrl(image)}
              alt={post.caption}
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          )}
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
            borderLeft: { md: "1px solid #1f2937" },
          }}
        >
          <Box
            sx={{
              p: 2,
              display: "flex",
              alignItems: "center",
              gap: 2,
              borderBottom: "1px solid #1f2937",
            }}
          >
            <Avatar src={author?.avatar ? getImageUrl(author.avatar) : ""}>
              {author?.name?.charAt(0)}
            </Avatar>

            <Box sx={{ flex: 1 }}>
              <Typography fontWeight="bold" sx={{ color: "#f8fafc" }}>
                {author?.name || "User"}
              </Typography>

              <Typography sx={{ color: "#64748b", fontSize: 13 }}>
                Personal post
              </Typography>
            </Box>

            <Chip
              label={post.visibility || "public"}
              size="small"
              sx={{
                background: "#172554",
                color: "#bfdbfe",
              }}
            />

            <IconButton onClick={onClose} sx={{ color: "#94a3b8" }}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Box
            sx={{
              p: 2,
              borderBottom: "1px solid #1f2937",
            }}
          >
            <Typography sx={{ color: "#f8fafc", lineHeight: 1.6 }}>
              {post.caption}
            </Typography>
          </Box>

          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              p: 2,
              background: "#020617",
            }}
          >
            {post.comments?.length === 0 ? (
              <Typography sx={{ color: "#64748b" }}>
                No comments yet.
              </Typography>
            ) : (
              post.comments?.map((comment, index) => {
                const commentUser =
                    typeof comment.userId === "object"
                    ? comment.userId
                    : comment.userId === user?._id
                    ? user
                    : typeof comment.user === "object"
                    ? comment.user
                    : null;

                return (
                    <Box
                    key={comment._id || index}
                    sx={{
                        display: "flex",
                        gap: 1.5,
                        mb: 2,
                    }}
                    >
                    <Avatar
                        src={commentUser?.avatar ? getImageUrl(commentUser.avatar) : ""}
                        sx={{ width: 34, height: 34 }}
                    >
                        {commentUser?.name?.charAt(0) || "U"}
                    </Avatar>

                    <Typography sx={{ color: "#f8fafc", fontSize: 14 }}>
                        <Box component="span" sx={{ fontWeight: 800, mr: 1 }}>
                        {commentUser?.name || "User"}
                        </Box>
                        {comment.text}
                    </Typography>
                    </Box>
                );
            })
            )}
          </Box>

          <Box
            sx={{
              p: 2,
              borderTop: "1px solid #1f2937",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 3,
                mb: 2,
              }}
            >
              <Box
                onClick={() => onLike(post._id)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.8,
                  cursor: "pointer",
                  color: "#f87171",
                  fontWeight: 800,
                }}
              >
                <FavoriteIcon />
                {post.likes?.length || 0}
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.8,
                  color: "#93c5fd",
                  fontWeight: 800,
                }}
              >
                <ChatBubbleOutlineSharpIcon />
                {post.comments?.length || 0}
              </Box>
            </Box>

            <Box sx={{ display: "flex", gap: 1.5 }}>
              <TextField
                fullWidth
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSendComment();
                  }
                }}
                sx={{
                  input: { color: "#fff" },
                  "& .MuiOutlinedInput-root": {
                    background: "#111827",
                    borderRadius: 3,
                    "& fieldset": { borderColor: "#1f2937" },
                    "&:hover fieldset": { borderColor: "#334155" },
                    "&.Mui-focused fieldset": { borderColor: "#2563eb" },
                  },
                }}
              />

              <Button
                variant="contained"
                onClick={handleSendComment}
                sx={{
                  borderRadius: 3,
                  px: 3,
                  background: "#2563eb",
                  fontWeight: 800,
                }}
              >
                Send
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
};

export default PostDetailsModal;