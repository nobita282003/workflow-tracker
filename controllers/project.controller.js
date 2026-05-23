const Project = require('../models/Project');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const createProject = catchAsync(async (req, res, next) => {
  const { name, description, managers, members } = req.body;

  const projectManagers = managers || [];
  if (req.user.role === 'Manager' && !projectManagers.includes(req.user._id.toString())) {
    projectManagers.push(req.user._id);
  }

  const newProject = await Project.create({
    name,
    description,
    managers: projectManagers,
    members: members || []
  });

  res.status(201).json({
    status: 'success',
    data: {
      project: newProject
    }
  });
});

const getAllProjects = catchAsync(async (req, res, next) => {
  let query = { isDeleted: { $ne: true } };

  if (req.user.role !== 'Admin') {
    query.$or = [
      { managers: req.user._id },
      { members: req.user._id }
    ];
  }

  const projects = await Project.find(query)
    .populate('managers', 'name email role')
    .populate('members', 'name email role');

  res.status(200).json({
    status: 'success',
    results: projects.length,
    data: {
      projects
    }
  });
});

const getProject = catchAsync(async (req, res, next) => {
  const project = await Project.findOne({ _id: req.params.id, isDeleted: { $ne: true } })
    .populate('managers', 'name email role')
    .populate('members', 'name email role');

  if (!project) {
    return next(new AppError('Du an khong ton tai!', 404));
  }

  if (
    req.user.role !== 'Admin' &&
    !project.managers.some((m) => m._id.toString() === req.user._id.toString()) &&
    !project.members.some((m) => m._id.toString() === req.user._id.toString())
  ) {
    return next(new AppError('Ban khong co quyen xem du an nay!', 403));
  }

  res.status(200).json({
    status: 'success',
    data: {
      project
    }
  });
});

const updateProject = catchAsync(async (req, res, next) => {
  const updatedProject = await Project.findByIdAndUpdate(
    req.project._id,
    {
      name: req.body.name,
      description: req.body.description,
      managers: req.body.managers,
      members: req.body.members
    },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: 'success',
    data: {
      project: updatedProject
    }
  });
});

const deleteProject = catchAsync(async (req, res, next) => {
  req.project.isDeleted = true;
  req.project.deletedAt = new Date();
  await req.project.save();

  res.status(204).json({
    status: 'success',
    data: null
  });
});

module.exports = {
  createProject,
  getAllProjects,
  getProject,
  updateProject,
  deleteProject
};
