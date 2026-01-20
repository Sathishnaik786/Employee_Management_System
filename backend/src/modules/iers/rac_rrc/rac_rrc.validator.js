const Joi = require('joi');

// RAC Validators
const createMeetingSchema = Joi.object({
    student_id: Joi.string().uuid().required(),
    phd_application_id: Joi.string().uuid().required(),
    meeting_date: Joi.date().iso().required(),
    committee_members: Joi.array().items(Joi.string().uuid()).min(1).required(),
    agenda: Joi.string().required()
});

const reviewMeetingSchema = Joi.object({
    recommendation: Joi.string().valid('CONTINUE', 'EXTEND', 'CANCEL').required(),
    minutes: Joi.string().required()
});

const submitProgressSchema = Joi.object({
    semester: Joi.number().integer().min(1).max(12).required(),
    progress_summary: Joi.string().required(),
    performance_score: Joi.number().min(0).max(10).required(),
    recommendation: Joi.string().valid('SATISFACTORY', 'UNSATISFACTORY').required()
});

// RRC Validators
const createSubmissionSchema = Joi.object({
    student_id: Joi.string().uuid().required(),
    phd_application_id: Joi.string().uuid().required(),
    submission_type: Joi.string().valid('SYNOPSIS', 'THESIS').required(),
    document_ref: Joi.string().required()
});

const conductReviewSchema = Joi.object({
    decision: Joi.string().valid('APPROVED', 'REJECTED').required(),
    remarks: Joi.string().required()
});

module.exports = {
    validateCreateMeeting: (data) => createMeetingSchema.validate(data),
    validateReviewMeeting: (data) => reviewMeetingSchema.validate(data),
    validateSubmitProgress: (data) => submitProgressSchema.validate(data),
    validateCreateSubmission: (data) => createSubmissionSchema.validate(data),
    validateConductReview: (data) => conductReviewSchema.validate(data)
};
