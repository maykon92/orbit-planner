import Item from "../models/Item.js";
import { createNotification } from "../services/notificationService.js";
import {
  createUserPost,
  findMyPosts,
  findPublicPosts,
  findUserPostById,
  findPostById,
  deleteUserPost,
} from "../services/postService.js";

export const createPost = async (req, res) => {
  try {
    const { itemId, caption, visibility, photos } = req.body;

    if (!caption) {
      return res.status(400).json({ message: "Caption is required." });
    }

    if (itemId) {
      const item = await Item.findOne({
        _id: itemId,
        userId: req.user._id,
      });

      if (!item) {
        return res.status(404).json({ message: "Item not found." });
      }
    }

    const post = await createUserPost({
      userId: req.user._id,
      itemId: itemId || null,
      caption,
      visibility,
      photos,
    });

    const populatedPost = await findPostById(post._id);

    res.status(201).json(populatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyPosts = async (req, res) => {
  try {
    const posts = await findMyPosts(req.user._id);

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPublicFeed = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const { type } = req.query;

    const result = await findPublicPosts({ page, limit, type });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePost = async (req, res) => {
  try {
    const post = await findUserPostById(req.params.id, req.user._id);

    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    post.caption = req.body.caption ?? post.caption;
    post.visibility = req.body.visibility ?? post.visibility;
    post.photos = req.body.photos ?? post.photos;

    await post.save();

    const populatedPost = await findPostById(req.params.id);

    res.json(populatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const deletedPost = await deleteUserPost(req.params.id, req.user._id);

    if (!deletedPost) {
      return res.status(404).json({ message: "Post not found." });
    }

    res.json({ message: "Post deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const likePost = async (req, res) => {
  try {
    const post = await findPostById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    const alreadyLiked = post.likes.some(
      (userId) => userId.toString() === req.user._id.toString()
    );

    if (alreadyLiked) {
      post.likes = post.likes.filter(
        (userId) => userId.toString() !== req.user._id.toString()
      );
    } else {
      post.likes.push(req.user._id);
    }

    await post.save();

    const populatedPost = await findPostById(req.params.id);

    res.json({
      message: alreadyLiked ? "Post unliked." : "Post liked.",
      likesCount: populatedPost.likes.length,
      post: populatedPost,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Comment text is required." });
    }

    const post = await findPostById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    post.comments.push({
      userId: req.user._id,
      text,
    });

    const newComment = post.comments[post.comments.length - 1];

    await post.save();

    if (post.userId.toString() !== req.user._id.toString()) {
      await createNotification({
        recipientId: post.userId,
        senderId: req.user._id,
        type: "comment",
        message: "commented on your post",
        postId: post._id,
        commentId: newComment._id,
      });
    }

    const populatedPost = await findPostById(req.params.id);

    res.status(201).json(populatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};