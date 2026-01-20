const Joi = require('joi');

const createApplicationSchema = Joi.object({
    student_id: Joi.string().uuid().required(),
    research_interest: Joi.string().required(),
    pg_score: Joi.number().required(),
    pg_specialization: Joi.string().required(),
    program: Joi.string().default('PhD'),
    exemption_type: Joi.string().allow('', null),
    proof_url: Joi.string().uri().allow('', null)
});

const submitApplicationSchema = Joi.object({});

const exemptionReviewSchema = Joi.object({
    decision: Joi.string().valid('APPROVED', 'REJECTED').required(),
    remarks: Joi.string().allow('', null)
});

const scrutinyReviewSchema = Joi.object({
    decision: Joi.string().valid('APPROVED', 'REJECTED').required(),
    remarks: Joi.string().allow('', null)
});

const scheduleInterviewSchema = Joi.object({
    interview_date: Joi.date().iso().required(),
    panel: Joi.array().items(Joi.string().uuid()).min(1).required()
});

const completeInterviewSchema = Joi.object({
    score: Joi.number().min(0).max(100).required(),
    recommendation: Joi.string().valid('QUALIFIED', 'NOT_QUALIFIED').required(),
    remarks: Joi.string().allow('', null)
});

const verifyDocumentsSchema = Joi.object({
    status: Joi.string().valid('VERIFIED', 'REJECTED').required(),
    remarks: Joi.string().allow('', null)
});

const initiatePaymentSchema = Joi.object({
    amount: Joi.number().positive().required(),
    payment_method: Joi.string().required()
});

const confirmPaymentSchema = Joi.object({
    transaction_ref: Joi.string().required(),
    status: Joi.string().valid('COMPLETED', 'FAILED').required()
});

const allocateGuideSchema = Joi.object({
    faculty_id: Joi.string().uuid().required()
});

module.exports = {
    validateCreate: (data) => createApplicationSchema.validate(data),
    validateSubmit: (data) => submitApplicationSchema.validate(data),
    validateExemption: (data) => exemptionReviewSchema.validate(data),
    validateScrutiny: (data) => scrutinyReviewSchema.validate(data),
    validateSchedule: (data) => scheduleInterviewSchema.validate(data),
    validateComplete: (data) => completeInterviewSchema.validate(data),
    validateVerification: (data) => verifyDocumentsSchema.validate(data),
    validateInitiatePayment: (data) => initiatePaymentSchema.validate(data),
    validateConfirmPayment: (data) => confirmPaymentSchema.validate(data),
    validateAllocate: (data) => allocateGuideSchema.validate(data)
};
