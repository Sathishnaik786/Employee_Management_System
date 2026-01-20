const naacService = require('./naac.service');
const Joi = require('joi');

const iiqaSchema = Joi.object({
    institution_code: Joi.string().required(),
    academic_year: Joi.string().pattern(/^\d{4}-\d{4}$/).required()
});

const ssrSchema = Joi.object({
    iiqa_id: Joi.string().uuid().required(),
    criterion_no: Joi.number().min(1).max(7).required(),
    section_code: Joi.string().required(),
    content: Joi.object().required()
});

const clarificationSchema = Joi.object({
    query: Joi.string().required()
});

exports.createIIQA = async (req, res, next) => {
    try {
        const { error, value } = iiqaSchema.validate(req.body);
        if (error) return res.status(400).json({ success: false, message: error.details[0].message });

        const data = await naacService.createIIQA(value, req.user);
        res.status(201).json({ success: true, data });
    } catch (err) {
        next(err);
    }
};

exports.updateSSR = async (req, res, next) => {
    try {
        const { error, value } = ssrSchema.validate(req.body);
        if (error) return res.status(400).json({ success: false, message: error.details[0].message });

        const data = await naacService.updateSSR(value, req.user);
        res.status(200).json({ success: true, data });
    } catch (err) {
        next(err);
    }
};

exports.submitForDVV = async (req, res, next) => {
    try {
        await naacService.submitForDVV(req.params.id, req.user);
        res.status(200).json({ success: true, message: 'SSR submitted for DVV verification' });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.raiseClarification = async (req, res, next) => {
    try {
        const { error, value } = clarificationSchema.validate(req.body);
        if (error) return res.status(400).json({ success: false, message: error.details[0].message });

        const data = await naacService.raiseClarification(req.params.id, value.query, req.user);
        res.status(201).json({ success: true, data });
    } catch (err) {
        next(err);
    }
};

exports.getSSRById = async (req, res, next) => {
    try {
        const data = await naacService.getSSRById(req.params.id, req.user);
        if (!data) return res.status(404).json({ success: false, message: 'SSR section not found' });
        res.status(200).json({ success: true, data });
    } catch (err) {
        next(err);
    }
};
