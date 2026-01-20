const Joi = require('joi');

const iiqaSchema = Joi.object({
    institution_code: Joi.string().required(),
    academic_year: Joi.string().regex(/^\d{4}-\d{4}$/).required(),
});

const ssrSchema = Joi.object({
    iiqa_id: Joi.string().uuid().required(),
    criterion_no: Joi.number().integer().min(1).max(7).required(),
    section_code: Joi.string().required(),
    content: Joi.object().required(),
});

const ssrUpdateSchema = Joi.object({
    content: Joi.object().required(),
}).min(1);

const dvvResponseSchema = Joi.object({
    response: Joi.string().required(),
});

const qnmSchema = Joi.object({
    iiqa_id: Joi.string().uuid().required(),
    metric_code: Joi.string().required(),
    raw_score: Joi.number().required(),
    weighted_score: Joi.number().required(),
});

module.exports = {
    validateIIQA: (data) => iiqaSchema.validate(data),
    validateSSR: (data) => ssrSchema.validate(data),
    validateSSRUpdate: (data) => ssrUpdateSchema.validate(data),
    validateDVVResponse: (data) => dvvResponseSchema.validate(data),
    validateQNM: (data) => qnmSchema.validate(data),
};
