const express = require('express');
const router = express.Router();
const departmentController = require('@controllers/department.controller');
const authMiddleware = require('@middlewares/auth.middleware');
const { requirePermission, requireAnyPermission } = require('@middlewares/permission.middleware');

router.use(authMiddleware);

router.get('/', requireAnyPermission(['ems:departments:view']), departmentController.getAll);
router.get('/:id', requireAnyPermission(['ems:departments:view']), departmentController.getById);
router.post('/', requirePermission('ems:departments:manage'), departmentController.create);
router.put('/:id', requirePermission('ems:departments:manage'), departmentController.update);

module.exports = router;
