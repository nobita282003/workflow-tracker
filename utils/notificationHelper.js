const Notification = require('../models/Notification');
const socketService = require('./socketService');

// Tạo thông báo trong database và gửi qua socket.io
const createAndSendNotification = async ({
  recipientId,
  senderId,
  type,
  title,
  message,
  relatedEntityId,
  relatedEntityType
}) => {
  try {
    if (recipientId?.toString() === senderId?.toString()) return null;

    const notification = await Notification.create({
      recipientId,
      senderId,
      type,
      title,
      message,
      relatedEntityId,
      relatedEntityType
    });

    const populated = await notification.populate('senderId', 'name email role');
    socketService.sendToUser(recipientId, 'notification', populated);

    return populated;
  } catch (error) {
    console.error('Error sending notification:', error);
    return null;
  }
};

module.exports = {
  createAndSendNotification
};
