import Story from "../models/Story.js";
import StoryReply from "../models/StoryReply.js";
import { createNotification } from "./notificationService.js";
import Conversation from "../models/Conversation.js";
import { createMessage } from "./messageService.js";

export const createUserStory = async ({
  userId,
  image,
  likes = null,
  replys = null,
  caption = "",
}) => {
  const expiresAt = new Date();

  expiresAt.setHours(expiresAt.getHours() + 24);

  const story = await Story.create({
    userId,
    image,
    caption,
    likes: likes || [],
    replys: replys || [],
    viewedBy: [],
    expiresAt,
  });

  return await Story.findById(story._id).populate(
    "userId",
    "name avatar email"
  );
};

export const getActiveStories = async (currentUserId) => {
  const stories = await Story.find({
    expiresAt: {
      $gt: new Date(),
    },
  })
    .populate("userId", "name avatar email")
    .sort({
      createdAt: 1,
    });

  return stories.map((story) => {
    const storyObject = story.toObject();

    const viewedBy = Array.isArray(storyObject.viewedBy)
      ? storyObject.viewedBy
      : [];

    const likes = Array.isArray(storyObject.likes)
      ? storyObject.likes
      : [];

    const hasViewed = viewedBy.some(
      (viewerId) =>
        viewerId?.toString() ===
        currentUserId?.toString()
    );

    const likedByCurrentUser = likes.some(
      (likedUserId) =>
        likedUserId?.toString() ===
        currentUserId?.toString()
    );

    return {
      ...storyObject,
      viewedBy,
      likes,
      hasViewed,
      likedByCurrentUser,
      likesCount: likes.length,
    };
  });
};

export const markStoryAsViewed = async ({
  storyId,
  userId,
}) => {
  return await Story.findOneAndUpdate(
    {
      _id: storyId,
      expiresAt: {
        $gt: new Date(),
      },
    },
    {
      $addToSet: {
        viewedBy: userId,
      },
    },
    {
      new: true,
    }
  ).populate("userId", "name avatar email");
};

export const deleteUserStory = async ({
  storyId,
  userId,
}) => {
  const story = await Story.findOneAndDelete({
    _id: storyId,
    userId,
  });

  if (!story) {
    throw new Error("Story not found or access denied.");
  }

  return story;
};

export const toggleStoryLike = async ({
  storyId,
  userId,
}) => {
  const story = await Story.findOne({
    _id: storyId,
    expiresAt: {
      $gt: new Date(),
    },
  });

  if (!story) {
    throw new Error("Story not found or expired.");
  }

  const alreadyLiked = story.likes.some(
    (likedUserId) =>
      likedUserId.toString() === userId.toString()
  );

  if (alreadyLiked) {
    story.likes.pull(userId);
  } else {
    story.likes.addToSet(userId);
  }

  await story.save();

  if (
    !alreadyLiked &&
    story.userId.toString() !== userId.toString()
  ) {
    await createNotification({
      recipientId: story.userId,
      senderId: userId,
      type: "story_like",
      message: "liked your story",
      storyId: story._id,
    });
  }

  return {
    storyId: story._id,
    liked: !alreadyLiked,
    likesCount: story.likes.length,
    likes: story.likes,
  };
};

export const createStoryReply = async ({
  storyId,
  senderId,
  message,
}) => {
  const story = await Story.findOne({
    _id: storyId,
    expiresAt: {
      $gt: new Date(),
    },
  }).populate("userId", "name avatar email");

  if (!story) {
    throw new Error("Story not found or expired.");
  }

  const trimmedMessage = message?.trim();

  if (!trimmedMessage) {
    throw new Error("Reply message is required.");
  }

  if (story.userId._id.toString() === senderId.toString()) {
    throw new Error("You cannot reply to your own Story.");
  }

  let conversation = await Conversation.findOne({
    participants: {
      $all: [senderId, story.userId._id],
    },
  });

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [senderId, story.userId._id],
    });
  }

  const createdMessage = await createMessage({
    conversationId: conversation._id,
    senderId,
    text: trimmedMessage,

    storyId: story._id,

    storyPreview: {
      image: story.image,
      caption: story.caption || "",
      ownerId: story.userId._id,
    },
  });

  return {
    message: createdMessage,
    conversationId: conversation._id,
  };
};

export const getStoryReplies = async ({
  storyId,
  userId,
}) => {
  const story = await Story.findById(storyId);

  if (!story) {
    throw new Error("Story not found.");
  }

  const canAccessReplies =
    story.userId.toString() === userId.toString();

  if (!canAccessReplies) {
    throw new Error(
      "Only the Story owner can view its replies."
    );
  }

  return await StoryReply.find({
    storyId,
  })
    .populate("sender", "name avatar email")
    .populate("recipient", "name avatar email")
    .sort({ createdAt: 1 });
};

export const markStoryRepliesAsRead = async ({
  storyId,
  userId,
}) => {
  const story = await Story.findOne({
    _id: storyId,
    userId,
  });

  if (!story) {
    throw new Error(
      "Story not found or permission denied."
    );
  }

  await StoryReply.updateMany(
    {
      storyId,
      recipient: userId,
      isRead: false,
    },
    {
      isRead: true,
    }
  );

  return {
    message: "Story replies marked as read.",
  };
};