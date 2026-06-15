import {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../services/notificationService.js";

export const getNotifications = async (req, res) => {
  try {
    const notifications = await getUserNotifications(req.user._id);

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const readNotification = async (req, res) => {
  try {
    const notification = await markNotificationAsRead({
      notificationId: req.params.id,
      userId: req.user._id,
    });

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found.",
      });
    }

    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const readAllNotifications = async (req, res) => {
  try {
    await markAllNotificationsAsRead(req.user._id);

    res.json({
      message: "All notifications marked as read.",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};