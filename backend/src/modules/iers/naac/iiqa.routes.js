const express = require('express');
const router = express.Router();
const iiqaController = require('./iiqa.controller');
const authMiddleware = require('@middlewares/auth.middleware');
const { authorize } = require('@middlewares/permission.middleware');

router.use(authMiddleware);

router.post('/', authorize('iers:naac:iiqa:create'), iiqaController.createIIQA);
router.post('/:id/submit', authorize('iers:naac:iiqa:submit'), iiqaController.submitIIQA);
router.get('/:id', authorize('iers:naac:read'), iiqaController.getIIQAById);

module.exports = router;
