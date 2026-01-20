const express = require('express');
const router = express.Router();
const rrcController = require('./rrc.controller');
const authMiddleware = require('@middlewares/auth.middleware');
const { authorize } = require('@middlewares/permission.middleware');
const { preventApprovalEscalation } = require('@middlewares/role-restriction.middleware');

router.use(authMiddleware);

// Student/Admin
router.post('/submissions', authorize('iers:rrc:submission:create'), rrcController.createSubmission);
router.get('/submissions/:id', authorize('iers:rrc:submission:read'), rrcController.getSubmissionById);

// Adjudicator
router.get('/assignments', authorize('iers:thesis:assigned:view'), rrcController.listAssignments);
router.post('/evaluations/:reviewId', authorize('iers:thesis:evaluation:submit'), rrcController.submitEvaluation);

// RRC Member
router.post('/submissions/:id/recommendation', authorize('iers:rrc:recommendation:submit'), rrcController.submitRecommendation);
router.post('/submissions/:id/review', authorize('iers:rrc:review:conduct'), rrcController.conductReview); // Legacy / Internal

module.exports = router;
