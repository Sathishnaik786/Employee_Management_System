const racService = require('./rac.service');
const validator = require('./rac_rrc.validator');

exports.createMeeting = async (req, res, next) => {
    try {
        const { error, value } = validator.validateCreateMeeting(req.body);
        if (error) return res.status(400).json({ success: false, message: error.details[0].message });

        const data = await racService.createMeeting(value, req.user);
        res.status(201).json({ success: true, data });
    } catch (err) {
        next(err);
    }
};

exports.submitProgress = async (req, res, next) => {
    try {
        const { error, value } = validator.validateSubmitProgress(req.body);
        if (error) return res.status(400).json({ success: false, message: error.details[0].message });

        const data = await racService.submitProgress(req.params.id, value, req.user);
        res.status(201).json({ success: true, data });
    } catch (err) {
        if (err.status) return res.status(err.status).json({ success: false, message: err.message });
        next(err);
    }
};

exports.conductReview = async (req, res, next) => {
    try {
        const { error, value } = validator.validateReviewMeeting(req.body);
        if (error) return res.status(400).json({ success: false, message: error.details[0].message });

        const data = await racService.conductReview(req.params.id, value, req.user);
        res.status(200).json({ success: true, data });
    } catch (err) {
        if (err.status) return res.status(err.status).json({ success: false, message: err.message });
        next(err);
    }
};

exports.getMeetingById = async (req, res, next) => {
    try {
        const data = await racService.getById(req.params.id, req.user);
        if (!data) return res.status(404).json({ success: false, message: 'Meeting not found' });
        res.status(200).json({ success: true, data });
    } catch (err) {
        if (err.status) return res.status(err.status).json({ success: false, message: err.message });
        next(err);
    }
};
