const express = require('express');
const router = express.Router();
const analyticsController = require('./analytics.controller');
const { requirePermission, requireAnyPermission } = require('@middlewares/permission.middleware');

// Apply auth middleware to all routes in this file
const authMiddleware = require('@middlewares/auth.middleware');
router.use(authMiddleware);

// Admin analytics routes
router.get('/admin/overview', requirePermission('iers:system:admin'), analyticsController.getAdminOverview);

// Manager analytics routes
router.get('/manager/team-progress', requirePermission('ems:analytics:manager'), analyticsController.getManagerTeamProgress);

// HR analytics routes
router.get('/hr/workforce', requirePermission('ems:analytics:hr'), analyticsController.getHRWorkforce);

// Employee analytics routes (self)
router.get('/employee/self', requireAnyPermission(['ems:analytics:employee', 'ems:analytics:hr', 'ems:analytics:manager', 'iers:system:admin']), analyticsController.getEmployeeSelf);

module.exports = router;