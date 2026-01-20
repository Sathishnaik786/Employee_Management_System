const express = require('express');
const router = express.Router();
const systemController = require('./system.controller');
const authMiddleware = require('@middlewares/auth.middleware');
const { authorize } = require('@middlewares/permission.middleware');

router.use(authMiddleware);

// Permission Management
router.post('/permissions', authorize('iers:system:permission:create'), systemController.createPermission);
router.get('/permissions', authorize('iers:system:permission:read'), systemController.getPermissions);

// Role-Permission Assignment
router.post('/roles/permissions', authorize('iers:system:permission:create'), systemController.assignPermissionToRole);

// Current User Info
router.get('/me/permissions', systemController.getMyPermissions);

module.exports = router;
