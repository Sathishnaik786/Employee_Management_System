const express = require('express');
const router = express.Router();
const placementController = require('./placement.controller');
const authMiddleware = require('@middlewares/auth.middleware');
const { authorize } = require('@middlewares/permission.middleware');

router.use(authMiddleware);

router.post('/register', authorize('iers:placement:read'), placementController.registerStudent);
router.post('/companies', authorize('iers:placement:company:create'), placementController.createCompany);
router.post('/drives', authorize('iers:placement:drive:create'), placementController.createDrive);
router.post('/interviews/:id', authorize('iers:placement:interview:update'), placementController.updateInterview);
router.post('/offers/:id', authorize('iers:placement:offer:update'), placementController.createOffer);
router.get('/reports', authorize('iers:placement:read'), placementController.getReports);

module.exports = router;
