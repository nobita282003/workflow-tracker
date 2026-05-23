const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret-key-workflow-tracker', {
    expiresIn: process.env.JWT_EXPIRES_IN || '90d'
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

const signup = catchAsync(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const newUser = await User.create({
    name,
    email,
    password,
    role
  });

  createSendToken(newUser, 201, res);
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Vui long cung cap email va mat khau!', 400));
  }

  const user = await User.findOne({ email });

  if (!user || !(await user.comparePassword(password))) {
    return next(new AppError('Email hoac mat khau khong chinh xac!', 401));
  }

  createSendToken(user, 200, res);
});

module.exports = {
  signup,
  login
};
