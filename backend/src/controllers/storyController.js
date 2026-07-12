import {
  createUserStory,
  getActiveStories,
  markStoryAsViewed,
  deleteUserStory,
  toggleStoryLike,
  createStoryReply,
  getStoryReplies,
  markStoryRepliesAsRead,
} from "../services/storyService.js";

export const createStory = async (req, res) => {
  try {
    const { image, caption } = req.body;

    console.log("Create Story payload:", {
      userId: req.user._id,
      image,
      caption,
    });

    if (!image) {
      return res.status(400).json({
        message: "Story image is required.",
      });
    }

    const story = await createUserStory({
      userId: req.user._id,
      image,
      caption,
    });

    console.log("Story saved:", story._id);

    res.status(201).json(story);
  } catch (error) {
    console.error("Create Story error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

export const getStories = async (req, res) => {
  try {
    const stories = await getActiveStories(req.user._id);

    console.log(
      `Stories returned to ${req.user._id}:`,
      stories.length
    );

    res.json(stories);
  } catch (error) {
    console.error("Get stories error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

export const viewStory = async (req, res) => {
  try {
    const { storyId } = req.params;

    console.log("Viewing Story:", {
      storyId,
      userId: req.user._id,
    });

    const story = await markStoryAsViewed({
      storyId,
      userId: req.user._id,
    });

    if (!story) {
      return res.status(404).json({
        message: "Story not found or expired.",
      });
    }

    res.json(story);
  } catch (error) {
    console.error("View Story error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteStory = async (req, res) => {
  try {
    await deleteUserStory({
      storyId: req.params.storyId,
      userId: req.user._id,
    });

    res.json({
      message: "Story deleted successfully.",
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

export const likeStory = async (req, res) => {
  try {
    const result = await toggleStoryLike({
      storyId: req.params.storyId,
      userId: req.user._id,
    });

    res.json(result);
  } catch (error) {
    const statusCode = error.message.includes("not found")
      ? 404
      : 500;

    res.status(statusCode).json({
      message: error.message,
    });
  }
};

export const replyToStory = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({
        message: "Reply message is required.",
      });
    }

    const result = await createStoryReply({
      storyId: req.params.storyId,
      senderId: req.user._id,
      message,
    });

    res.status(201).json(result);
  } catch (error) {
    const statusCode =
      error.message.includes("not found") ||
      error.message.includes("expired")
        ? 404
        : error.message.includes("own Story")
          ? 400
          : 500;

    res.status(statusCode).json({
      message: error.message,
    });
  }
};

export const getReplies = async (req, res) => {
  try {
    const replies = await getStoryReplies({
      storyId: req.params.storyId,
      userId: req.user._id,
    });

    res.json(replies);
  } catch (error) {
    const statusCode = error.message.includes(
      "Only the Story owner"
    )
      ? 403
      : error.message.includes("not found")
        ? 404
        : 500;

    res.status(statusCode).json({
      message: error.message,
    });
  }
};

export const readStoryReplies = async (req, res) => {
  try {
    const result = await markStoryRepliesAsRead({
      storyId: req.params.storyId,
      userId: req.user._id,
    });

    res.json(result);
  } catch (error) {
    const statusCode = error.message.includes(
      "permission denied"
    )
      ? 403
      : 500;

    res.status(statusCode).json({
      message: error.message,
    });
  }
};