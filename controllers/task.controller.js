const Task = require('../models/Task');
const Project = require('../models/Project');
const Comment = require('../models/Comment');
const AuditLog = require('../models/AuditLog');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const createTask = catchAsync(async (req, res, next) => {
  const { projectId, title, description, assignee, reviewer, priority, dueDate } = req.body;

  const project = await Project.findById(projectId);
  if (!project) {
    return next(new AppError('Du an khong ton tai!', 404));
  }

  if (req.user.role === 'Manager') {
    const isManager = project.managers.some(
      (managerId) => managerId.toString() === req.user._id.toString()
    );
    if (!isManager) {
      return next(new AppError('Ban khong co quyen tao cong viec trong du an nay!', 403));
    }
  }

  const newTask = await Task.create({
    projectId,
    title,
    description,
    assignee,
    reviewer,
    priority,
    dueDate
  });

  res.status(201).json({
    status: 'success',
    data: {
      task: newTask
    }
  });
});

const getProjectTasks = catchAsync(async (req, res, next) => {
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
      return next(new AppError('Ban khong co quyen xem cong viec cua du an nay!', 403));
    }
  }

  const tasks = await Task.find({ projectId, isDeleted: { $ne: true } })
    .populate('assignee', 'name email role')
    .populate('reviewer', 'name email role');

  res.status(200).json({
    status: 'success',
    results: tasks.length,
    data: {
      tasks
    }
  });
});

const getTask = catchAsync(async (req, res, next) => {
  const task = await Task.findOne({ _id: req.params.id, isDeleted: { $ne: true } })
    .populate('assignee', 'name email role')
    .populate('reviewer', 'name email role');

  if (!task) {
    return next(new AppError('Cong viec khong ton tai!', 404));
  }

  const project = await Project.findById(task.projectId);
  if (
    req.user.role !== 'Admin' &&
    !project.managers.some((m) => m.toString() === req.user._id.toString()) &&
    !project.members.some((m) => m.toString() === req.user._id.toString())
  ) {
    return next(new AppError('Ban khong co quyen xem cong viec nay!', 403));
  }

  res.status(200).json({
    status: 'success',
    data: {
      task
    }
  });
});

const updateTask = catchAsync(async (req, res, next) => {
  const updatedTask = await Task.findByIdAndUpdate(
    req.task._id,
    {
      title: req.body.title,
      description: req.body.description,
      assignee: req.body.assignee,
      reviewer: req.body.reviewer,
      priority: req.body.priority,
      dueDate: req.body.dueDate
    },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: 'success',
    data: {
      task: updatedTask
    }
  });
});

const deleteTask = catchAsync(async (req, res, next) => {
  req.task.isDeleted = true;
  req.task.deletedAt = new Date();
  await req.task.save();

  res.status(204).json({
    status: 'success',
    data: null
  });
});

const updateTaskStatus = catchAsync(async (req, res, next) => {
  const { status, rejectionReason } = req.body;
  const task = await Task.findOne({ _id: req.params.id, isDeleted: { $ne: true } });

  if (!task) {
    return next(new AppError('Cong viec khong ton tai!', 404));
  }

  const project = await Project.findById(task.projectId);
  const isManager = project.managers.some((m) => m.toString() === req.user._id.toString());
  const isAssignee = task.assignee && task.assignee.toString() === req.user._id.toString();
  const isReviewer = task.reviewer && task.reviewer.toString() === req.user._id.toString();

  if (req.user.role !== 'Admin' && !isManager && !isAssignee && !isReviewer) {
    return next(new AppError('Ban khong co quyen cap nhat trang thai cong viec nay!', 403));
  }

  const oldStatus = task.status;

  if (status === 'Completed' && req.user.role !== 'Admin' && !isManager && !isReviewer) {
    return next(new AppError('Chi reviewer hoac manager moi co quyen hoan thanh cong viec!', 403));
  }

  if (status === 'Rejected') {
    if (req.user.role !== 'Admin' && !isManager && !isReviewer) {
      return next(new AppError('Chi reviewer hoac manager moi co quyen tu choi cong viec!', 403));
    }
    if (!rejectionReason || !rejectionReason.trim()) {
      return next(new AppError('Bat buoc phai nhap ly do tu choi!', 400));
    }

    await Comment.create({
      taskId: task._id,
      userId: req.user._id,
      content: `[TU CHOI CONG VIEC] Ly do: ${rejectionReason}`
    });

    await AuditLog.create({
      projectId: task.projectId,
      taskId: task._id,
      userId: req.user._id,
      action: 'REJECT_TASK',
      oldValue: oldStatus,
      newValue: 'In Progress'
    });

    task.status = 'In Progress';
    await task.save();

    return res.status(200).json({
      status: 'success',
      message: 'Cong viec da bi tu choi va chuyen nguoc lai ve trang thai In Progress',
      data: {
        task
      }
    });
  }

  task.status = status;
  await task.save();

  await AuditLog.create({
    projectId: task.projectId,
    taskId: task._id,
    userId: req.user._id,
    action: 'UPDATE_STATUS',
    oldValue: oldStatus,
    newValue: status
  });

  res.status(200).json({
    status: 'success',
    data: {
      task
    }
  });
});

module.exports = {
  createTask,
  getProjectTasks,
  getTask,
  updateTask,
  deleteTask,
  updateTaskStatus
};
