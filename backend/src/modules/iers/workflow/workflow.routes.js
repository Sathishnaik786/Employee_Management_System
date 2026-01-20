const express = require('express');
const router = express.Router();
const workflowController = require('./workflow.controller');
const authMiddleware = require('@middlewares/auth.middleware');
const { authorize } = require('@middlewares/permission.middleware');

router.use(authMiddleware);

// Workflow Definitions
router.post('/', authorize('iers:workflow:create'), workflowController.createWorkflow);
router.post('/:id/steps', authorize('iers:workflow:configure'), workflowController.addSteps);

// Workflow Execution
router.post('/initiate', authorize('iers:workflow:initiate'), workflowController.initiateWorkflow);
router.post('/:instanceId/action', authorize('iers:workflow:action'), workflowController.performAction);

// Tracking
router.get('/pending', authorize('iers:workflow:read'), workflowController.getPendingActions);
router.get('/:instanceId', authorize('iers:workflow:read'), workflowController.getInstance);

module.exports = router;
