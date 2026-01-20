const facultyService = require('./faculty.service');
const { validateFaculty, validateUpdateFaculty } = require('./faculty.validator');

exports.createFaculty = async (req, res, next) => {
    try {
        const { error, value } = validateFaculty(req.body);
        if (error) {
            return res.status(400).json({ success: false, message: error.details[0].message });
        }

        const data = await facultyService.create(value, req.user);
        res.status(201).json({ success: true, data });
    } catch (err) {
        next(err);
    }
};

exports.getAllFaculty = async (req, res, next) => {
    try {
        const data = await facultyService.getAll(req.user);
        res.status(200).json({ success: true, data });
    } catch (err) {
        if (err.status === 403) {
            return res.status(403).json({ success: false, message: err.message });
        }
        next(err);
    }
};

exports.getFacultyById = async (req, res, next) => {
    try {
        const data = await facultyService.getById(req.params.id, req.user);
        if (!data) {
            return res.status(404).json({ success: false, message: 'Faculty record not found' });
        }
        res.status(200).json({ success: true, data });
    } catch (err) {
        if (err.status === 403) {
            return res.status(403).json({ success: false, message: err.message });
        }
        next(err);
    }
};

exports.updateFaculty = async (req, res, next) => {
    try {
        const { error, value } = validateUpdateFaculty(req.body);
        if (error) {
            return res.status(400).json({ success: false, message: error.details[0].message });
        }

        const data = await facultyService.update(req.params.id, value, req.user);
        res.status(200).json({ success: true, data });
    } catch (err) {
        if (err.status === 403) {
            return res.status(403).json({ success: false, message: err.message });
        }
        if (err.status === 404) {
            return res.status(404).json({ success: false, message: err.message });
        }
        next(err);
    }
};

exports.deleteFaculty = async (req, res, next) => {
    try {
        await facultyService.delete(req.params.id, req.user);
        res.status(200).json({ success: true, message: 'Faculty record deleted successfully' });
    } catch (err) {
        if (err.status === 403) {
            return res.status(403).json({ success: false, message: err.message });
        }
        if (err.status === 404) {
            return res.status(404).json({ success: false, message: err.message });
        }
        next(err);
    }
};
