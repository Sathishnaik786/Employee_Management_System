const studentService = require('./student.service');
const { validateStudent, validateUpdateStudent } = require('./student.validator');

exports.createStudent = async (req, res, next) => {
    try {
        const { error, value } = validateStudent(req.body);
        if (error) {
            return res.status(400).json({ success: false, message: error.details[0].message });
        }

        const data = await studentService.create(value, req.user);
        res.status(201).json({ success: true, data });
    } catch (err) {
        next(err);
    }
};

exports.getAllStudents = async (req, res, next) => {
    try {
        const data = await studentService.getAll(req.user);
        res.status(200).json({ success: true, data });
    } catch (err) {
        next(err);
    }
};

exports.getStudentById = async (req, res, next) => {
    try {
        const data = await studentService.getById(req.params.id, req.user);
        if (!data) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }
        res.status(200).json({ success: true, data });
    } catch (err) {
        if (err.status === 403) {
            return res.status(403).json({ success: false, message: err.message });
        }
        next(err);
    }
};

exports.updateStudent = async (req, res, next) => {
    try {
        const { error, value } = validateUpdateStudent(req.body);
        if (error) {
            return res.status(400).json({ success: false, message: error.details[0].message });
        }

        const data = await studentService.update(req.params.id, value, req.user);
        res.status(200).json({ success: true, data });
    } catch (err) {
        if (err.status === 403) {
            return res.status(403).json({ success: false, message: err.message });
        }
        next(err);
    }
};

exports.deleteStudent = async (req, res, next) => {
    try {
        await studentService.delete(req.params.id, req.user);
        res.status(200).json({ success: true, message: 'Student record deleted successfully' });
    } catch (err) {
        if (err.status === 403) {
            return res.status(403).json({ success: false, message: err.message });
        }
        next(err);
    }
};

exports.getMeMetrics = async (req, res, next) => {
    try {
        const data = await studentService.getMeMetrics(req.user);
        res.status(200).json({ success: true, data });
    } catch (err) {
        next(err);
    }
};

exports.getMeWorkflows = async (req, res, next) => {
    try {
        const data = await studentService.getMeWorkflows(req.user);
        res.status(200).json({ success: true, data });
    } catch (err) {
        next(err);
    }
};

exports.getMeProfile = async (req, res, next) => {
    try {
        const data = await studentService.getMyProfile(req.user);
        res.status(200).json({ success: true, data });
    } catch (err) {
        if (err.status === 404) {
            return res.status(404).json({
                success: false,
                code: err.code || 'STUDENT_PROFILE_NOT_INITIALIZED',
                message: err.message
            });
        }
        next(err);
    }
};
