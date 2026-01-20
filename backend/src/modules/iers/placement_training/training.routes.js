const express = require('express');
const router = express.Router();
const trainingController = require('./training.controller');
const authMiddleware = require('@middlewares/auth.middleware');
const { authorize } = require('@middlewares/permission.middleware');

router.use(authMiddleware);

router.post('/programs', authorize('iers:training:program:create'), trainingController.createProgram);
router.post('/enroll', authorize('iers:training:enroll'), trainingController.enrollStudent);
router.get('/programs', authorize('iers:training:read'), trainingController.getPrograms);

module.exports = router;
