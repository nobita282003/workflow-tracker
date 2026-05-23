const AuditLog = require('../models/AuditLog');
const Project = require('../models/Project');
const Task = require('../models/Task');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const getProjectAuditLogs = catchAsync(async (req, res, next) => {
  const { projectId } = req.params;

  const project = await Project.findById(projectId);
  if (!project) {
    return next(new AppError('Du an khong ton tai!', 404));
  }

  if (req.user.role !== 'Admin') {
    const isAuthorized = project.managers.concat(project.members).some(
      (userId) => userId.toString() === req.user._id.toString()
    );
    if (!isAuthorized) {
      return next(new AppError('Ban khong co quyen xem nhat ky cua du an nay!', 403));
    }
  }

  const logs = await AuditLog.find({ projectId })
    .populate('userId', 'name email role')
    .populate('taskId', 'title')
    .sort({ createdAt: -1 });

  res.status(200).json({
    status: 'success',
    results: logs.length,
    data: {
      logs
    }
  });
});

const getTaskAuditLogs = catchAsync(async (req, res, next) => {
  const { taskId } = req.params;

  const task = await Task.findOne({ _id: taskId, isDeleted: { $ne: true } });
  if (!task) {
    return next(new AppError('Cong viec khong ton tai!', 404));
  }

  const project = await Project.findById(task.projectId);
  if (req.user.role !== 'Admin') {
    const isAuthorized = project.managers.concat(project.members).some(
      (userId) => userId.toString() === req.user._id.toString()
    );
    if (!isAuthorized) {
      return next(new AppError('Ban khong co quyen xem nhat ky cua cong viec nay!', 403));
    }
  }

  const logs = await AuditLog.find({ taskId })
    .populate('userId', 'name email role')
    .sort({ createdAt: -1 });

  res.status(200).json({
    status: 'success',
    results: logs.length,
    data: {
      logs
    }
  });
});

module.exports = {
  getProjectAuditLogs,
  getTaskAuditLogs
};
