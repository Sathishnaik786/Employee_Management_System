const Joi = require('joi');

const facultySchema = Joi.object({
    faculty_id: Joi.string().required(),
    full_name: Joi.string().required(),
    dob: Joi.date().iso().allow(null),
    gender: Joi.string().allow(null, ''),
    email: Joi.string().email().required(),
    mobile: Joi.string().allow(null, ''),
    department: Joi.string().required(),
    qualifications: Joi.string().allow(null, ''),
    research_areas: Joi.string().allow(null, ''),
    expertise: Joi.string().allow(null, ''),
    credentials: Joi.object().allow(null),
    is_active: Joi.boolean().default(true)
});

const updateFacultySchema = Joi.object({
    full_name: Joi.string(),
    dob: Joi.date().iso(),
    gender: Joi.string().allow(null, ''),
    mobile: Joi.string().allow(null, ''),
    department: Joi.string(),
    qualifications: Joi.string().allow(null, ''),
    research_areas: Joi.string().allow(null, ''),
    expertise: Joi.string().allow(null, ''),
    credentials: Joi.object().allow(null),
    is_active: Joi.boolean()
}).min(1);

module.exports = {
    validateFaculty: (data) => facultySchema.validate(data),
    validateUpdateFaculty: (data) => updateFacultySchema.validate(data)
};
