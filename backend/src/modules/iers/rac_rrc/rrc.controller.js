const rrcService = require('./rrc.service');
const validator = require('./rac_rrc.validator');

exports.createSubmission = async (req, res, next) => {
    try {
        const { error, value } = validator.validateCreateSubmission(req.body);
        if (error) return res.status(400).json({ success: false, message: error.details[0].message });

        const data = await rrcService.createSubmission(value, req.user);
        res.status(201).json({ success: true, data });
    } catch (err) {
        next(err);
    }
};

exports.conductReview = async (req, res, next) => {
    try {
        const { error, value } = validator.validateConductReview(req.body);
        if (error) return res.status(400).json({ success: false, message: error.details[0].message });

        const data = await rrcService.conductReview(req.params.id, value, req.user);
        res.status(201).json({ success: true, data });
    } catch (err) {
        if (err.status) return res.status(err.status).json({ success: false, message: err.message });
        next(err);
    }
};

exports.getSubmissionById = async (req, res, next) => {
    try {
        const data = await rrcService.getById(req.params.id, req.user);
        if (!data) return res.status(404).json({ success: false, message: 'Submission not found' });
        res.status(200).json({ success: true, data });
    } catch (err) {
        res.status(err.status || 400).json({ success: false, message: err.message });
    }
};

exports.listAssignments = async (req, res, next) => {
    try {
        const data = await rrcService.listAssignedThesis(req.user);
        res.status(200).json({ success: true, data });
    } catch (err) {
        next(err);
    }
};

exports.submitEvaluation = async (req, res, next) => {
    try {
        const { error, value } = validator.validateConductReview(req.body);
        if (error) return res.status(400).json({ success: false, message: error.details[0].message });

        const data = await rrcService.submitEvaluation(req.params.reviewId, value, req.user);
        res.status(200).json({ success: true, data });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.submitRecommendation = async (req, res, next) => {
    try {
        const { error, value } = validator.validateConductReview(req.body);
        if (error) return res.status(400).json({ success: false, message: error.details[0].message });

        await rrcService.submitRecommendation(req.params.id, value, req.user);
        res.status(200).json({ success: true, message: 'RRC Recommendation submitted successfully' });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};
