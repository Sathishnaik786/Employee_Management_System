const dvvService = require('./dvv.service');
const { validateDVVResponse } = require('./naac.validator');

exports.respondDVV = async (req, res, next) => {
    try {
        const { error, value } = validateDVVResponse(req.body);
        if (error) return res.status(400).json({ success: false, message: error.details[0].message });

        await dvvService.respond(req.params.id, value, req.user);
        res.status(200).json({ success: true, message: 'Response recorded successfully' });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.calculateQNM = async (req, res, next) => {
    try {
        const data = await dvvService.calculateQNM(req.params.iiqaId, req.user);
        res.status(200).json({ success: true, data });
    } catch (err) {
        next(err);
    }
};

exports.getDVVById = async (req, res, next) => {
    try {
        const data = await dvvService.getById(req.params.id, req.user);
        if (!data) return res.status(404).json({ success: false, message: 'DVV query not found' });
        res.status(200).json({ success: true, data });
    } catch (err) {
        next(err);
    }
};
