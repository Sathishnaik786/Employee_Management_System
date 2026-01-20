const phdService = require('./phd.service');
const validator = require('./phd.validator');

exports.createApplication = async (req, res, next) => {
    try {
        const { error, value } = validator.validateCreate(req.body);
        if (error) return res.status(400).json({ success: false, message: error.details[0].message });

        const data = await phdService.create(value, req.user);
        res.status(201).json({ success: true, data });
    } catch (err) {
        next(err);
    }
};

exports.submitApplication = async (req, res, next) => {
    try {
        await phdService.submit(req.params.id, req.user);
        res.status(200).json({ success: true, message: 'Application submitted successfully' });
    } catch (err) {
        if (err.status) return res.status(err.status).json({ success: false, message: err.message });
        next(err);
    }
};

exports.startScrutiny = async (req, res, next) => {
    try {
        const data = await phdService.startScrutiny(req.params.id, req.user);
        res.status(200).json({ success: true, data });
    } catch (err) {
        if (err.status) return res.status(err.status).json({ success: false, message: err.message });
        next(err);
    }
};

exports.applyExemption = async (req, res, next) => {
    try {
        const { error, value } = validator.validateCreate(req.body); // Reusing or create a specific one if needed
        if (error) return res.status(400).json({ success: false, message: error.details[0].message });

        await phdService.applyExemption(req.params.id, value, req.user);
        res.status(200).json({ success: true, message: 'Exemption applied successfully' });
    } catch (err) {
        next(err);
    }
};

exports.getAllApplications = async (req, res, next) => {
    try {
        const data = await phdService.getAll(req.user);
        res.status(200).json({ success: true, data });
    } catch (err) {
        next(err);
    }
};

exports.getApplicationById = async (req, res, next) => {
    try {
        const data = await phdService.getById(req.params.id, req.user);
        if (!data) return res.status(404).json({ success: false, message: 'Application not found' });
        res.status(200).json({ success: true, data });
    } catch (err) {
        if (err.status) return res.status(err.status).json({ success: false, message: err.message });
        next(err);
    }
};

exports.scrutinyReview = async (req, res, next) => {
    try {
        const { error, value } = validator.validateScrutiny(req.body);
        if (error) return res.status(400).json({ success: false, message: error.details[0].message });

        await phdService.scrutinyReview(req.params.id, value, req.user);
        res.status(200).json({ success: true, message: 'Scrutiny review completed' });
    } catch (err) {
        if (err.status) return res.status(err.status).json({ success: false, message: err.message });
        next(err);
    }
};

exports.scheduleInterview = async (req, res, next) => {
    try {
        const { error, value } = validator.validateSchedule(req.body);
        if (error) return res.status(400).json({ success: false, message: error.details[0].message });

        await phdService.scheduleInterview(req.params.id, value, req.user);
        res.status(200).json({ success: true, message: 'Interview scheduled' });
    } catch (err) {
        if (err.status) return res.status(err.status).json({ success: false, message: err.message });
        next(err);
    }
};

exports.completeInterview = async (req, res, next) => {
    try {
        const { error, value } = validator.validateComplete(req.body);
        if (error) return res.status(400).json({ success: false, message: error.details[0].message });

        await phdService.completeInterview(req.params.id, value, req.user);
        res.status(200).json({ success: true, message: 'Interview results recorded' });
    } catch (err) {
        if (err.status) return res.status(err.status).json({ success: false, message: err.message });
        next(err);
    }
};

exports.verifyDocuments = async (req, res, next) => {
    try {
        const { error, value } = validator.validateVerification(req.body);
        if (error) return res.status(400).json({ success: false, message: error.details[0].message });

        await phdService.verifyDocuments(req.params.id, value, req.user);
        res.status(200).json({ success: true, message: 'Document verification recorded' });
    } catch (err) {
        next(err);
    }
};

exports.initiatePayment = async (req, res, next) => {
    try {
        const { error, value } = validator.validateInitiatePayment(req.body);
        if (error) return res.status(400).json({ success: false, message: error.details[0].message });

        await phdService.initiatePayment(req.params.id, value, req.user);
        res.status(200).json({ success: true, message: 'Payment initiated' });
    } catch (err) {
        next(err);
    }
};

exports.confirmPayment = async (req, res, next) => {
    try {
        const { error, value } = validator.validateConfirmPayment(req.body);
        if (error) return res.status(400).json({ success: false, message: error.details[0].message });

        await phdService.confirmPayment(req.params.id, value, req.user);
        res.status(200).json({ success: true, message: 'Payment confirmed successfully' });
    } catch (err) {
        next(err);
    }
};

exports.allocateGuide = async (req, res, next) => {
    try {
        const { error, value } = validator.validateAllocate(req.body);
        if (error) return res.status(400).json({ success: false, message: error.details[0].message });

        await phdService.allocateGuide(req.params.id, value, req.user);
        res.status(200).json({ success: true, message: 'Guide allocated successfully' });
    } catch (err) {
        if (err.status) return res.status(err.status).json({ success: false, message: err.message });
        next(err);
    }
};

exports.getActiveLifecycle = async (req, res, next) => {
    try {
        const data = await phdService.getActiveLifecycle();
        res.status(200).json({ success: true, data });
    } catch (err) {
        next(err);
    }
};
