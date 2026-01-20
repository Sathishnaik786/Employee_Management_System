const express = require('express');
const router = express.Router();
const studentController = require('./student.controller');
const authMiddleware = require('@middlewares/auth.middleware');
const { authorize } = require('@middlewares/permission.middleware');

router.use(authMiddleware);

/**
 * POST /api/iers/students
 * Create a new student profile
 */
router.post('/', authorize('iers:student:profile:create'), studentController.createStudent);

/**
 * GET /api/iers/students
 * Get all student profiles (role-based scoping applies)
 */
router.get('/', authorize('iers:student:profile:read'), studentController.getAllStudents);

/**
 * GET /api/iers/students/me
 * Get current logged in student profile
 */
router.get('/me', authorize('iers:student:profile:read'), studentController.getMeProfile);

/**
 * GET /api/iers/students/:id
 * Get a specific student profile
 */
router.get('/:id', authorize('iers:student:profile:read'), studentController.getStudentById);

/**
 * PUT /api/iers/students/:id
 * Update an existing student profile
 */
router.put('/:id', authorize('iers:student:profile:update'), studentController.updateStudent);

/**
 * GET /api/iers/students/me/metrics
 * Get current student's academic metrics
 */
router.get('/me/metrics', authorize('iers:student:profile:read'), studentController.getMeMetrics);

/**
 * GET /api/iers/students/me/workflows
 * Get current student's active workflows (e.g. PhD)
 */
router.get('/me/workflows', authorize('iers:student:profile:read'), studentController.getMeWorkflows);

/**
 * DELETE /api/iers/students/:id
 * Delete a student profile
 */
router.delete('/:id', authorize('iers:student:profile:delete'), studentController.deleteStudent);

module.exports = router;
