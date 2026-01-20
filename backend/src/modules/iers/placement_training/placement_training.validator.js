const Joi = require('joi');

const placementCompanySchema = Joi.object({
    company_name: Joi.string().required(),
    registration_number: Joi.string().allow('', null),
    contact_person: Joi.string().allow('', null),
    email: Joi.string().email().allow('', null),
    phone: Joi.string().allow('', null),
    job_profiles: Joi.array().items(Joi.object({
        role: Joi.string().required(),
        ctc: Joi.number().required(),
        criteria: Joi.string().allow('', null)
    })).allow(null),
    last_visit_date: Joi.date().iso().allow(null)
});

const placementRegistrationSchema = Joi.object({
    student_id: Joi.string().uuid().required(),
    academic_year: Joi.string().regex(/^\d{4}-\d{4}$/).required(),
    resume_ref: Joi.string().required()
});

const placementDriveSchema = Joi.object({
    company_id: Joi.string().uuid().required(),
    drive_date: Joi.date().iso().required(),
    job_profile: Joi.string().required(),
    eligibility: Joi.object().required()
});

const interviewResultSchema = Joi.object({
    result: Joi.string().valid('SELECTED', 'REJECTED', 'WAITLISTED').required(),
    remarks: Joi.string().allow('', null),
    round_no: Joi.number().integer().min(1).required()
});

const placementOfferSchema = Joi.object({
    student_id: Joi.string().uuid().required(),
    company_id: Joi.string().uuid().required(),
    offer_letter_ref: Joi.string().required(),
    compensation: Joi.object({
        ctc: Joi.number().required(),
        fixed: Joi.number().optional(),
        variable: Joi.number().optional()
    }).required(),
    status: Joi.string().valid('OFFERED', 'ACCEPTED', 'REJECTED').default('OFFERED')
});

const trainingProgramSchema = Joi.object({
    title: Joi.string().required(),
    program_type: Joi.string().valid('TRAINING', 'INTERNSHIP').required(),
    start_date: Joi.date().iso().required(),
    end_date: Joi.date().iso().required(),
    organizer: Joi.string().required()
});

const trainingEnrollmentSchema = Joi.object({
    program_id: Joi.string().uuid().required(),
    student_id: Joi.string().uuid().required()
});

module.exports = {
    validateCompany: (data) => placementCompanySchema.validate(data),
    validateRegistration: (data) => placementRegistrationSchema.validate(data),
    validateDrive: (data) => placementDriveSchema.validate(data),
    validateInterviewResult: (data) => interviewResultSchema.validate(data),
    validateOffer: (data) => placementOfferSchema.validate(data),
    validateTrainingProgram: (data) => trainingProgramSchema.validate(data),
    validateTrainingEnrollment: (data) => trainingEnrollmentSchema.validate(data)
};
