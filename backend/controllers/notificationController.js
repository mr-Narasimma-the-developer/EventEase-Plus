const Notification = require('../models/Notification');

<<<<<<< HEAD
=======
// Get User Notifications
>>>>>>> ed34da906bb3faf0ea102d18bd8c416990098710
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id })
      .sort('-createdAt')
      .limit(50);
<<<<<<< HEAD

    const unreadCount = await Notification.countDocuments({
      userId: req.user._id,
      read: false
    });

    res.json({
      notifications,
      unreadCount
    });

=======
    
    const unreadCount = await Notification.countDocuments({ 
      userId: req.user._id, 
      isRead: false 
    });

    res.json({ notifications, unreadCount });
>>>>>>> ed34da906bb3faf0ea102d18bd8c416990098710
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications', error: error.message });
  }
};

<<<<<<< HEAD
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

=======
// Mark as Read
const markAsRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ message: 'Marked as read' });
>>>>>>> ed34da906bb3faf0ea102d18bd8c416990098710
  } catch (error) {
    res.status(500).json({ message: 'Error updating notification', error: error.message });
  }
};

<<<<<<< HEAD
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
=======
// Mark All as Read
const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.user._id, isRead: false },
      { isRead: true }
    );
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating notifications', error: error.message });
>>>>>>> ed34da906bb3faf0ea102d18bd8c416990098710
  }
};

module.exports = {
  getNotifications,
  markAsRead,
<<<<<<< HEAD
  deleteNotification
=======
  markAllAsRead
>>>>>>> ed34da906bb3faf0ea102d18bd8c416990098710
};