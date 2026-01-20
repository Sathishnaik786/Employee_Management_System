const ssrService = require('./ssr.service');
const { validateSSR, validateSSRUpdate } = require('./naac.validator');

exports.createSSR = async (req, res, next) => {
    try {
        const { error, value } = validateSSR(req.body);
        if (error) return res.status(400).json({ success: false, message: error.details[0].message });

        const data = await ssrService.create(value, req.user);
        res.status(201).json({ success: true, data });
    } catch (err) {
        next(err);
    }
};

exports.updateSSR = async (req, res, next) => {
    try {
        const { error, value } = validateSSRUpdate(req.body);
        if (error) return res.status(400).json({ success: false, message: error.details[0].message });

        const data = await ssrService.update(req.params.id, value, req.user);
        res.status(200).json({ success: true, data });
    } catch (err) {
        next(err);
    }
};

exports.submitSSR = async (req, res, next) => {
    try {
        await ssrService.submit(req.params.id, req.user);
        res.status(200).json({ success: true, message: 'SSR section submitted successfully' });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.getSSRById = async (req, res, next) => {
    try {
        const data = await ssrService.getById(req.params.id, req.user);
        if (!data) return res.status(404).json({ success: false, message: 'SSR not found' });
        res.status(200).json({ success: true, data });
    } catch (err) {
        next(err);
    }
};
