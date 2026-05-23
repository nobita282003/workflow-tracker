const Project = require('../models/Project');
const Task = require('../models/Task');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('Ban khong co quyen truy cap hanh dong nay!', 403));
    }
    next();
  };
};

const canManageProject = catchAsync(async (req, res, next) => {
  const projectId = req.params.projectId || req.params.id || req.body.projectId;

  if (!projectId) {
    return next(new AppError('Khong tim thay ID du an trong yeu cau!', 400));
  }

  const project = await Project.findById(projectId);
  if (!project) {
    return next(new AppError('Du an khong ton tai!', 404));
  }

  if (req.user.role === 'Admin') {
    req.project = project;
    return next();
  }

  if (req.user.role === 'Manager') {
    const isManager = project.managers.some(
      (managerId) => managerId.toString() === req.user._id.toString()
    );
    if (isManager) {
      req.project = project;
      return next();
    }
  }

  return next(new AppError('Ban khong co quyen quan ly du an nay!', 403));
});

const canManageTask = catchAsync(async (req, res, next) => {
  const taskId = req.params.taskId || req.params.id || req.body.taskId;

  if (!taskId) {
    return next(new AppError('Khong tim thay ID cong viec trong yeu cau!', 400));
  }

  const task = await Task.findById(taskId);
  if (!task) {
    return next(new AppError('Cong viec khong ton tai!', 404));
  }

  const project = await Project.findById(task.projectId);
  if (!project) {
    return next(new AppError('Du an cua cong viec nay khong ton tai!', 404));
  }

  if (req.user.role === 'Admin') {
    req.task = task;
    req.project = project;
    return next();
  }

  if (req.user.role === 'Manager') {
    const isManager = project.managers.some(
      (managerId) => managerId.toString() === req.user._id.toString()
    );
    if (isManager) {
      req.task = task;
      req.project = project;
      return next();
    }
  }

  return next(new AppError('Ban khong co quyen quan ly cong viec nay!', 403));
});

module.exports = {
  restrictTo,
  canManageProject,
  canManageTask
};
