const express = require('express');
const projectController = require('../../controllers/project.controller');
const { protect } = require('../../middlewares/auth');
const { restrictTo, canManageProject } = require('../../middlewares/authorize');

const router = express.Router();

router.use(protect);

router
  .route('/')
  .post(restrictTo('Admin', 'Manager'), projectController.createProject)
  .get(projectController.getAllProjects);

router
  .route('/:id')
  .get(projectController.getProject)
  .patch(restrictTo('Admin', 'Manager'), canManageProject, projectController.updateProject)
  .delete(restrictTo('Admin', 'Manager'), canManageProject, projectController.deleteProject);

module.exports = router;
