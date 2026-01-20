const express = require('express');
const router = express.Router();
const naacController = require('./naac.controller');
const authMiddleware = require('@middlewares/auth.middleware');
const { authorize } = require('@middlewares/permission.middleware');

router.use(authMiddleware);

// IQAC
router.post('/iiqa', authorize('iers:naac:iiqa:manage'), naacController.createIIQA);
router.post('/ssr', authorize('iers:naac:ssr:edit'), naacController.updateSSR);
router.post('/ssr/:id/submit', authorize('iers:naac:ssr:edit'), naacController.submitForDVV);

// DVV
router.post('/ssr/:id/clarification', authorize('iers:naac:dvv:clarification:raise'), naacController.raiseClarification);

// Shared / Discovery
router.get('/ssr/:id', authorize('iers:naac:readiness:view', 'iers:naac:dvv:evidence:view', 'iers:naac:external:view'), naacController.getSSRById);

module.exports = router;
