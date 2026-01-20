const express = require('express');
const router = express.Router();
const facultyController = require('./faculty.controller');
const authMiddleware = require('@middlewares/auth.middleware');
const { authorize } = require('@middlewares/permission.middleware');

router.use(authMiddleware);

/**
 * POST /api/iers/faculty
 * Create a new faculty profile
 */
router.post('/', authorize('iers:faculty:profile:create'), facultyController.createFaculty);

/**
 * GET /api/iers/faculty
 * Get all faculty profiles (role-based scoping applies)
 */
router.get('/', authorize('iers:faculty:profile:read'), facultyController.getAllFaculty);

/**
 * GET /api/iers/faculty/:id
 * Get a specific faculty profile
 */
router.get('/:id', authorize('iers:faculty:profile:read'), facultyController.getFacultyById);

/**
 * PUT /api/iers/faculty/:id
 * Update an existing faculty profile
 */
router.put('/:id', authorize('iers:faculty:profile:update'), facultyController.updateFaculty);

/**
 * DELETE /api/iers/faculty/:id
 * Delete a faculty profile
 */
router.delete('/:id', authorize('iers:faculty:profile:delete'), facultyController.deleteFaculty);

module.exports = router;
