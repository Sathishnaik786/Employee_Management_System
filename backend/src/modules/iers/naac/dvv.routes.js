const express = require('express');
const router = express.Router();
const dvvController = require('./dvv.controller');
const authMiddleware = require('@middlewares/auth.middleware');
const { authorize } = require('@middlewares/permission.middleware');

router.use(authMiddleware);

router.post('/:id/respond', authorize('iers:naac:dvv:respond'), dvvController.respondDVV);
router.post('/calculate-qnm/:iiqaId', authorize('iers:naac:review'), dvvController.calculateQNM);
router.get('/:id', authorize('iers:naac:read'), dvvController.getDVVById);

module.exports = router;
