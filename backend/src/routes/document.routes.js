const express = require('express');
const router = express.Router();
const documentController = require('@controllers/document.controller');
const authMiddleware = require('@middlewares/auth.middleware');
const { requirePermission, requireAnyPermission } = require('@middlewares/permission.middleware');

router.use(authMiddleware);

router.post('/upload', requirePermission('ems:documents:upload'), documentController.upload);
router.get('/:employeeId', requireAnyPermission(['ems:documents:view']), documentController.getByEmployee);

module.exports = router;
