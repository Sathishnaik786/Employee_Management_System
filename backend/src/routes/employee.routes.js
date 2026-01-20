const express = require('express');
const router = express.Router();
const employeeController = require('@controllers/employee.controller');
const authMiddleware = require('@middlewares/auth.middleware');
const { requirePermission, requireAnyPermission } = require('@middlewares/permission.middleware');

router.use(authMiddleware);

// Profile endpoints - no role restrictions, users can access only their own profile
router.get('/profile', employeeController.getProfile);
router.put('/profile', employeeController.updateProfile);

// Profile image upload endpoint
router.post('/profile/image', requirePermission('ems:employees:update'), employeeController.uploadProfileImage);

// Regular employee endpoints with permission restrictions
router.get('/', requireAnyPermission(['ems:employees:view']), employeeController.getAll);
router.get('/:id', requirePermission('ems:employees:view'), employeeController.getById);
router.post('/', requirePermission('ems:employees:create'), employeeController.create);
router.put('/:id', requirePermission('ems:employees:update'), employeeController.update);
router.delete('/:id', requirePermission('ems:employees:delete'), employeeController.delete);

module.exports = router;