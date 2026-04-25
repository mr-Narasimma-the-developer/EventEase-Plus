const Notification = require('../models/Notification');

const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id })
      .sort('-createdAt')
      .limit(50);

    const unreadCount = await Notification.countDocuments({
      userId: req.user._id,
      read: false
    });

    res.json({
      notifications,
      unreadCount
    });

  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications', error: error.message });
  }
};

const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    if (notification.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    notification.read = true;
    await notification.save();

    res.json({ message: 'Notification marked as read', notification });

  } catch (error) {
    res.status(500).json({ message: 'Error updating notification', error: error.message });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    if (notification.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Notification.findByIdAndDelete(req.params.id);

    res.json({ message: 'Notification deleted successfully' });

  } catch (error) {
    res.status(500).json({ message: 'Error deleting notification', error: error.message });
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  deleteNotification
};