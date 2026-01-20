const express = require('express');
const router = express.Router();
const ssrController = require('./ssr.controller');
const authMiddleware = require('@middlewares/auth.middleware');
const { authorize } = require('@middlewares/permission.middleware');

router.use(authMiddleware);

router.post('/', authorize('iers:naac:ssr:edit'), ssrController.createSSR);
router.put('/:id', authorize('iers:naac:ssr:edit'), ssrController.updateSSR);
router.post('/:id/submit', authorize('iers:naac:ssr:submit'), ssrController.submitSSR);
router.get('/:id', authorize('iers:naac:read'), ssrController.getSSRById);

module.exports = router;
