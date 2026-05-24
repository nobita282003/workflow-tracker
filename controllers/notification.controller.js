const Notification = require('../models/Notification');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const getMyNotifications = catchAsync(async (req, res, next) => {
  const notifications = await Notification.find({
    recipientId: req.user._id,
    isDeleted: { $ne: true }
  })
    .populate('senderId', 'name email role')
    .sort({ createdAt: -1 });

  res.status(200).json({
    status: 'success',
    results: notifications.length,
    data: {
      notifications
    }
  });
});

const markAsRead = catchAsync(async (req, res, next) => {
  const notification = await Notification.findOne({
    _id: req.params.id,
    recipientId: req.user._id,
    isDeleted: { $ne: true }
  });

  if (!notification) {
    return next(new AppError('Thong bao khong ton tai hoac ban khong co quyen!', 404));
  }

  notification.isRead = true;
  await notification.save();

  res.status(200).json({
    status: 'success',
    data: {
      notification
    }
  });
});

module.exports = {
  getMyNotifications,
  markAsRead
};
