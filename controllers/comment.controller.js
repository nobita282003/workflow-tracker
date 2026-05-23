const Comment = require('../models/Comment');
const Task = require('../models/Task');
const Project = require('../models/Project');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const createComment = catchAsync(async (req, res, next) => {
  const { taskId, content } = req.body;

  if (!taskId || !content || !content.trim()) {
    return next(new AppError('Vui long cung cap taskId va noi dung binh luan!', 400));
  }

  const task = await Task.findOne({ _id: taskId, isDeleted: { $ne: true } });
  if (!task) {
    return next(new AppError('Cong viec khong ton tai!', 404));
  }

  const project = await Project.findById(task.projectId);
  if (
    req.user.role !== 'Admin' &&
    !project.managers.some((m) => m.toString() === req.user._id.toString()) &&
    !project.members.some((m) => m.toString() === req.user._id.toString())
  ) {
    return next(new AppError('Ban khong co quyen binh luan tren cong viec cua du an nay!', 403));
  }

  const newComment = await Comment.create({
    taskId,
    userId: req.user._id,
    content
  });

  res.status(201).json({
    status: 'success',
    data: {
      comment: newComment
    }
  });
});

const getTaskComments = catchAsync(async (req, res, next) => {
  const { taskId } = req.params;

  const task = await Task.findOne({ _id: taskId, isDeleted: { $ne: true } });
  if (!task) {
    return next(new AppError('Cong viec khong ton tai!', 404));
  }

  const project = await Project.findById(task.projectId);
  if (
    req.user.role !== 'Admin' &&
    !project.managers.some((m) => m.toString() === req.user._id.toString()) &&
    !project.members.some((m) => m.toString() === req.user._id.toString())
  ) {
    return next(new AppError('Ban khong co quyen xem binh luan cua cong viec nay!', 403));
  }

  const comments = await Comment.find({ taskId, isDeleted: { $ne: true } })
    .populate('userId', 'name email role')
    .sort({ createdAt: 1 });

  res.status(200).json({
    status: 'success',
    results: comments.length,
    data: {
      comments
    }
  });
});

const updateComment = catchAsync(async (req, res, next) => {
  const { content } = req.body;
  const comment = await Comment.findOne({ _id: req.params.id, isDeleted: { $ne: true } });

  if (!comment) {
    return next(new AppError('Binh luan khong ton tai!', 404));
  }

  if (req.user.role !== 'Admin' && comment.userId.toString() !== req.user._id.toString()) {
    return next(new AppError('Ban khong co quyen chinh sua binh luan nay!', 403));
  }

  comment.content = content;
  await comment.save();

  res.status(200).json({
    status: 'success',
    data: {
      comment
    }
  });
});

const deleteComment = catchAsync(async (req, res, next) => {
  const comment = await Comment.findOne({ _id: req.params.id, isDeleted: { $ne: true } });

  if (!comment) {
    return next(new AppError('Binh luan khong ton tai!', 404));
  }

  const task = await Task.findById(comment.taskId);
  const project = await Project.findById(task.projectId);
  const isProjectManager = project.managers.some((m) => m.toString() === req.user._id.toString());

  if (
    req.user.role !== 'Admin' &&
    comment.userId.toString() !== req.user._id.toString() &&
    !isProjectManager
  ) {
    return next(new AppError('Ban khong co quyen xoa binh luan nay!', 403));
  }

  comment.isDeleted = true;
  comment.deletedAt = new Date();
  await comment.save();

  res.status(204).json({
    status: 'success',
    data: null
  });
});

module.exports = {
  createComment,
  getTaskComments,
  updateComment,
  deleteComment
};
