const express = require('express');
const router = express.Router();
const leaveController = require('@controllers/leave.controller');
const authMiddleware = require('@middlewares/auth.middleware');
const { requirePermission, requireAnyPermission } = require('@middlewares/permission.middleware');
const { preventApprovalEscalation } = require('@middlewares/role-restriction.middleware');

router.use(authMiddleware);

router.post('/apply', requirePermission('ems:leaves:apply'), leaveController.apply);
router.get('/', requireAnyPermission(['ems:leaves:view']), leaveController.getAll);
router.get('/types', requireAnyPermission(['ems:leaves:view']), leaveController.getTypes);
router.put('/:id/approve', authMiddleware, preventApprovalEscalation, requirePermission('ems:leaves:approve'), leaveController.approve);
router.put('/:id/reject', authMiddleware, preventApprovalEscalation, requirePermission('ems:leaves:reject'), leaveController.reject);

module.exports = router;
