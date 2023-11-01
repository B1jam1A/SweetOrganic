const Joi = require('@hapi/joi');



//Login Validation
const loginValidationAdmin = (data) => {
    const schema = Joi.object({
        email: Joi.string()
            .min(6)
            .required()
            .email(),
        password: Joi.string()
            .min(6)
            .required()
    });

    return schema.validate(data);
}

module.exports.loginValidationAdmin = loginValidationAdmin;