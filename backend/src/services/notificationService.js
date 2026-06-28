import Notification from "../models/Notification.js";

export const getUserNotifications = async (userId) => {
  return await Notification.find({ recipient: userId })
    .populate("sender", "name avatar email")
    .populate("post", "caption photos")
    .populate("conversation")
    .populate({
      path: "financeInvitation",
      populate: [
        {
          path: "workspace",
          select: "name type",
        },
        {
          path: "sender",
          select: "name avatar email",
        },
      ],
    })
    .sort({ createdAt: -1 });
};

export const markNotificationAsRead = async ({ notificationId, userId }) => {
  return await Notification.findOneAndUpdate(
    {
      _id: notificationId,
      recipient: userId,
    },
    { isRead: true },
    { new: true }
  ) 
    .populate("sender", "name avatar email")
    .populate("post", "caption photos")
    .populate("conversation");
};

export const markAllNotificationsAsRead = async (userId) => {
  return await Notification.updateMany(
    {
      recipient: userId,
      isRead: false,
    },
    {
      isRead: true,
    }
  );
};

export const createNotification = async ({
  recipientId,
  senderId,
  type,
  message,
  postId = null,
  commentId = null,
  conversationId = null,
}) => {
  if (recipientId.toString() === senderId.toString()) {
    return null;
  }

  const notification = await Notification.create({
    recipient: recipientId,
    sender: senderId,
    type,
    message,
    post: postId,
    comment: commentId,
    conversation: conversationId,
  });

  return await Notification.findById(notification._id)
    .populate("sender", "name avatar email")
    .populate("post", "caption photos")
    .populate("conversation");
};
