const trainingService = require('./training.service');
const validator = require('./placement_training.validator');

exports.createProgram = async (req, res, next) => {
    try {
        const { error, value } = validator.validateTrainingProgram(req.body);
        if (error) return res.status(400).json({ success: false, message: error.details[0].message });

        const data = await trainingService.createProgram(value, req.user);
        res.status(201).json({ success: true, data });
    } catch (err) {
        next(err);
    }
};

exports.enrollStudent = async (req, res, next) => {
    try {
        const { error, value } = validator.validateTrainingEnrollment(req.body);
        if (error) return res.status(400).json({ success: false, message: error.details[0].message });

        const data = await trainingService.enrollStudent(value, req.user);
        res.status(201).json({ success: true, data });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.getPrograms = async (req, res, next) => {
    try {
        const data = await trainingService.getAllPrograms(req.user);
        res.status(200).json({ success: true, data });
    } catch (err) {
        next(err);
    }
};
