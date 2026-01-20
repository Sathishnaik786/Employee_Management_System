const placementService = require('./placement.service');
const validator = require('./placement_training.validator');

exports.createCompany = async (req, res, next) => {
    try {
        const { error, value } = validator.validateCompany(req.body);
        if (error) return res.status(400).json({ success: false, message: error.details[0].message });

        const data = await placementService.createCompany(value, req.user);
        res.status(201).json({ success: true, data });
    } catch (err) {
        next(err);
    }
};

exports.registerStudent = async (req, res, next) => {
    try {
        const { error, value } = validator.validateRegistration(req.body);
        if (error) return res.status(400).json({ success: false, message: error.details[0].message });

        const data = await placementService.registerStudent(value, req.user);
        res.status(201).json({ success: true, data });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.createDrive = async (req, res, next) => {
    try {
        const { error, value } = validator.validateDrive(req.body);
        if (error) return res.status(400).json({ success: false, message: error.details[0].message });

        const data = await placementService.createDrive(value, req.user);
        res.status(201).json({ success: true, data });
    } catch (err) {
        next(err);
    }
};

exports.updateInterview = async (req, res, next) => {
    try {
        const { error, value } = validator.validateInterviewResult(req.body);
        if (error) return res.status(400).json({ success: false, message: error.details[0].message });

        const data = await placementService.updateInterview(req.params.id, value, req.user);
        res.status(200).json({ success: true, data });
    } catch (err) {
        next(err);
    }
};

exports.createOffer = async (req, res, next) => {
    try {
        const { error, value } = validator.validateOffer(req.body);
        if (error) return res.status(400).json({ success: false, message: error.details[0].message });

        const data = await placementService.createOffer(value, req.user);
        res.status(201).json({ success: true, data });
    } catch (err) {
        next(err);
    }
};

exports.getReports = async (req, res, next) => {
    try {
        const data = await placementService.getPlacementStats();
        res.status(200).json({ success: true, data });
    } catch (err) {
        next(err);
    }
};
