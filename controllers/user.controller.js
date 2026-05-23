const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');

// Lấy danh sách tất cả người dùng hoạt động trong hệ thống
const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find().select('name email role');

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users
    }
  });
});

module.exports = {
  getAllUsers
};
