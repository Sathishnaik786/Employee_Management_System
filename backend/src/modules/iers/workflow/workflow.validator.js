const Joi = require('joi');

const workflowSchema = Joi.object({
    name: Joi.string().required(),
    module: Joi.string().required(),
    entity_type: Joi.string().required(),
});

const stepSchema = Joi.object({
    step_order: Joi.number().integer().required(),
    step_name: Joi.string().required(),
    approval_type: Joi.string().valid('SEQUENTIAL', 'PARALLEL').required(),
    approver_roles: Joi.array().items(Joi.string()).min(1).required(),
    conditions: Joi.object().optional(),
});

const stepsArraySchema = Joi.array().items(stepSchema).min(1);

const initiateSchema = Joi.object({
    entity_type: Joi.string().required(),
    entity_id: Joi.string().uuid().required(),
});

const actionSchema = Joi.object({
    action: Joi.string().valid('APPROVE', 'REJECT', 'SCHEDULE').required(),
    remarks: Joi.string().allow('', null),
    next_step_payload: Joi.object().optional(),
});

module.exports = {
    validateWorkflow: (data) => workflowSchema.validate(data),
    validateSteps: (data) => stepsArraySchema.validate(data),
    validateInitiate: (data) => initiateSchema.validate(data),
    validateAction: (data) => actionSchema.validate(data),
};
