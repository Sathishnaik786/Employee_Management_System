const express = require('express');
const router = express.Router();
const attendanceController = require('@controllers/attendance.controller');
const authMiddleware = require('@middlewares/auth.middleware');
const { requirePermission, requireAnyPermission } = require('@middlewares/permission.middleware');

router.use(authMiddleware);

router.post('/check-in', requirePermission('ems:attendance:mark'), attendanceController.checkIn);
router.post('/check-out', requirePermission('ems:attendance:mark'), attendanceController.checkOut);
router.get('/me', requirePermission('ems:attendance:view'), attendanceController.getMyAttendance);
router.get('/report', requireAnyPermission(['ems:attendance:view']), attendanceController.getReport);

module.exports = router;
