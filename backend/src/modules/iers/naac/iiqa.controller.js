const iiqaService = require('./iiqa.service');
const { validateIIQA } = require('./naac.validator');

exports.createIIQA = async (req, res, next) => {
    try {
        const { error, value } = validateIIQA(req.body);
        if (error) return res.status(400).json({ success: false, message: error.details[0].message });

        const data = await iiqaService.create(value, req.user);
        res.status(201).json({ success: true, data });
    } catch (err) {
        next(err);
    }
};

exports.submitIIQA = async (req, res, next) => {
    try {
        await iiqaService.submit(req.params.id, req.user);
        res.status(200).json({ success: true, message: 'IIQA submitted successfully' });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.getIIQAById = async (req, res, next) => {
    try {
        const data = await iiqaService.getById(req.params.id, req.user);
        if (!data) return res.status(404).json({ success: false, message: 'IIQA not found' });
        res.status(200).json({ success: true, data });
    } catch (err) {
        next(err);
    }
};
