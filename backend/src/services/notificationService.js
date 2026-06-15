import Notification from "../models/Notification.js";

export const createNotification = async ({
  recipientId,
  senderId,
  type,
  message,
  postId = null,
  commentId = null,
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
  });

  return await Notification.findById(notification._id)
    .populate("sender", "name avatar email")
    .populate("post", "caption photos");
};

export const getUserNotifications = async (userId) => {
  return await Notification.find({ recipient: userId })
    .populate("sender", "name avatar email")
    .populate("post", "content image")
    .populate("comment", "text")
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
    .populate("post", "content image")
    .populate("comment", "text");
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