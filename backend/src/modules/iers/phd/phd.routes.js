const express = require('express');
const router = express.Router();
const phdController = require('./phd.controller');
const authMiddleware = require('@middlewares/auth.middleware');
const { authorize } = require('@middlewares/permission.middleware');
const { preventApprovalEscalation } = require('@middlewares/role-restriction.middleware');

router.use(authMiddleware);

// Application Lifecycle
router.get('/lifecycle/active', phdController.getActiveLifecycle);
router.post('/applications', authorize('iers:phd:application:create'), phdController.createApplication);
router.post('/applications/:id/submit', authorize('iers:phd:application:submit'), phdController.submitApplication);
router.post('/applications/:id/scrutiny/start', authorize('iers:phd:scrutiny:review'), phdController.startScrutiny);
router.get('/applications', authorize('iers:phd:application:read'), phdController.getAllApplications);
router.get('/applications/:id', authorize('iers:phd:application:read'), phdController.getApplicationById);

// PET Exemption (FR-PHD-002)
router.post('/applications/:id/exemption', authorize('iers:phd:exemption:apply'), phdController.applyExemption);

// Admin / HOD / Faculty Workflows
router.post('/applications/:id/scrutiny', authMiddleware, preventApprovalEscalation, authorize('iers:phd:scrutiny:review'), phdController.scrutinyReview);
router.post('/applications/:id/interview/schedule', authMiddleware, preventApprovalEscalation, authorize('iers:phd:interview:schedule'), phdController.scheduleInterview);
router.post('/applications/:id/interview/complete', authMiddleware, preventApprovalEscalation, authorize('iers:phd:interview:conduct'), phdController.completeInterview);

// Document Verification (FR-PHD-006)
router.post('/applications/:id/documents/verify', authMiddleware, authorize('iers:phd:documents:verify'), phdController.verifyDocuments);

// Fee Payment (FR-PHD-007)
router.post('/applications/:id/payment/initiate', authorize('iers:phd:payment:initiate'), phdController.initiatePayment);
router.post('/applications/:id/payment/confirm', authorize('iers:phd:payment:confirm'), phdController.confirmPayment);

// Guide Allocation (FR-PHD-008)
router.post('/applications/:id/guide', authMiddleware, preventApprovalEscalation, authorize('iers:phd:guide:allocate'), phdController.allocateGuide);

module.exports = router;
