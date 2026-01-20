const express = require('express');
const router = express.Router();
const racController = require('./rac.controller');
const authMiddleware = require('@middlewares/auth.middleware');
const { authorize } = require('@middlewares/permission.middleware');
const { preventApprovalEscalation } = require('@middlewares/role-restriction.middleware');

router.use(authMiddleware);

router.post('/meetings', authorize('iers:rac:meeting:create'), racController.createMeeting);
router.post('/meetings/:id/review', authMiddleware, preventApprovalEscalation, authorize('iers:rac:meeting:review'), racController.conductReview);
router.post('/meetings/:id/progress', authMiddleware, preventApprovalEscalation, authorize('iers:rac:progress:submit'), racController.submitProgress);
router.get('/meetings/:id', authorize('iers:rrc:submission:read'), racController.getMeetingById);

module.exports = router;
