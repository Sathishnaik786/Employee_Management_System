const Joi = require('joi');

const studentSchema = Joi.object({
    student_id: Joi.string().required(),
    full_name: Joi.string().required(),
    dob: Joi.date().iso().allow(null),
    gender: Joi.string().allow(null, ''),
    email: Joi.string().email().required(),
    mobile: Joi.string().allow(null, ''),
    department: Joi.string().required(),
    program_type: Joi.string().required(),
    enrollment_date: Joi.date().iso().allow(null),
    current_semester: Joi.number().integer().min(1).max(12).required(),
    permanent_address: Joi.string().allow(null, ''),
    current_address: Joi.string().allow(null, ''),
    emergency_contact: Joi.object().allow(null)
});

const updateStudentSchema = Joi.object({
    full_name: Joi.string(),
    dob: Joi.date().iso(),
    gender: Joi.string().allow(null, ''),
    mobile: Joi.string().allow(null, ''),
    department: Joi.string(),
    program_type: Joi.string(),
    current_semester: Joi.number().integer().min(1).max(12),
    permanent_address: Joi.string().allow(null, ''),
    current_address: Joi.string().allow(null, ''),
    emergency_contact: Joi.object().allow(null)
}).min(1);

module.exports = {
    validateStudent: (data) => studentSchema.validate(data),
    validateUpdateStudent: (data) => updateStudentSchema.validate(data)
};
