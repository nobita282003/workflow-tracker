const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const protect = catchAsync(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('Ban chua dang nhap. Vui long dang nhap de truy cap!', 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret-key-workflow-tracker');

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError('Nguoi dung so huu token nay khong con ton tai tren he thong!', 401));
  }

  req.user = currentUser;
  next();
});

module.exports = { protect };
