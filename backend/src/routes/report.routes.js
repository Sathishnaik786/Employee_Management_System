const express = require('express');
const router = express.Router();
const reportController = require('@controllers/report.controller');
const authMiddleware = require('@middlewares/auth.middleware');
const roleMiddleware = require('@middlewares/role.middleware');

router.use(authMiddleware);
router.get('/dashboard', roleMiddleware(['ADMIN', 'HR', 'MANAGER']), reportController.getDashboardStats);
router.get('/attendance', reportController.getAttendanceReport);
router.get('/leaves', reportController.getLeaveReport);
router.get('/employees', reportController.getEmployeeReport);

module.exports = router;
