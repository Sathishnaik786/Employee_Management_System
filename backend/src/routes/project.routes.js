const express = require('express');
const router = express.Router();
const projectController = require('@controllers/project.controller');
const authenticateToken = require('@middlewares/auth.middleware');
const { requirePermission, requireAnyPermission } = require('@middlewares/permission.middleware');

// Apply authentication to all routes
router.use(authenticateToken);

// Project routes
router.get('/', requireAnyPermission(['ems:projects:view']), projectController.getAllProjects);
router.get('/my-projects', requireAnyPermission(['ems:projects:view']), projectController.getMyProjects);
router.get('/:id', requireAnyPermission(['ems:projects:view']), projectController.getProjectById);
router.post('/', requirePermission('ems:projects:create'), projectController.createProject);
router.patch('/:id', requirePermission('ems:projects:update'), projectController.updateProject);
router.delete('/:id', requirePermission('ems:projects:delete'), projectController.deleteProject);

// Project members routes
router.post('/:id/members', requirePermission('ems:projects:update'), projectController.addProjectMember);
router.delete('/:id/members/:employeeId', requirePermission('ems:projects:update'), projectController.removeProjectMember);

// Project documents routes
router.post('/:id/documents', requirePermission('ems:projects:update'), projectController.uploadProjectDocument);
router.get('/:id/documents', requireAnyPermission(['ems:projects:view']), projectController.getProjectDocuments);

// Project tasks routes
router.post('/:id/tasks', requirePermission('ems:projects:update'), projectController.createProjectTask);
router.get('/:id/tasks', requireAnyPermission(['ems:projects:view']), projectController.getProjectTasks);
router.patch('/tasks/:id', requirePermission('ems:projects:update'), projectController.updateProjectTask);

// Project meetings routes
router.post('/:id/meetings', requirePermission('ems:projects:update'), projectController.createProjectMeeting);
router.get('/:id/meetings', requireAnyPermission(['ems:projects:view']), projectController.getProjectMeetings);

// Project todos routes
router.post('/:id/todos', requirePermission('ems:projects:update'), projectController.createProjectTodo);
router.patch('/todos/:id', requirePermission('ems:projects:update'), projectController.updateProjectTodo);

// Project updates routes
router.post('/:id/updates', requirePermission('ems:projects:update'), projectController.createProjectUpdate);
router.get('/:id/updates', requireAnyPermission(['ems:projects:view']), projectController.getProjectUpdates);

module.exports = router;