import React, { useState, useEffect } from 'react';
import API from '../utils/api';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data } = await API.get('/notifications');
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await API.put(`/notifications/${id}/read`);
      fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await API.put('/notifications/read-all');
      fetchNotifications();
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading notifications...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold">Notifications</h1>
              {unreadCount > 0 && (
                <p className="text-gray-600 mt-2">{unreadCount} unread notifications</p>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
              >
                Mark All as Read
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <div className="text-6xl mb-4">🔔</div>
              <h3 className="text-2xl font-bold mb-2">No Notifications</h3>
              <p className="text-gray-600">You're all caught up!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition ${
                    !notification.isRead ? 'border-l-4 border-indigo-600' : ''
                  }`}
                  onClick={() => !notification.isRead && markAsRead(notification._id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-2xl">
                          {notification.type === 'interest' && '⭐'}
                          {notification.type === 'verification' && '✓'}
                          {notification.type === 'booking' && '📅'}
                          {notification.type === 'moderation' && '⚠️'}
                          {!['interest', 'verification', 'booking', 'moderation'].includes(notification.type) && '🔔'}
                        </span>
                        <h3 className="text-lg font-bold">{notification.title}</h3>
                      </div>
                      <p className="text-gray-700 mb-2">{notification.message}</p>
                      <div className="text-sm text-gray-500">
                        {new Date(notification.createdAt).toLocaleString()}
                      </div>
                    </div>
                    {!notification.isRead && (
                      <div className="w-3 h-3 bg-indigo-600 rounded-full ml-4"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;