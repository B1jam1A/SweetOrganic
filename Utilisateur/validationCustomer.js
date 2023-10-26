const Joi = require('@hapi/joi');
const JoiPhone = Joi.extend(require('joi-phone-number'));

const addressSchema = Joi.object({
    _id: Joi.object()
        .optional(),
    adresse: Joi.object({
        numero: Joi.number().
            required(),
        rue: Joi.string()
            .required(),
        ville: Joi.string()
            .required(),
        codePostal: Joi.string()
            .required(),
        pays: Joi.string()
            .required()
    })
});

//Register Validation
const registerValidationCustomer = (data) => {
    const schema = Joi.object({
        _id: Joi.object()
            .optional(),
        nom: Joi.string()
            .min(2)
            .required(),
        prenom: Joi.string()
            .min(2)
            .required(),
        email: Joi.string()
            .min(6)
            .required()
            .email(),
        password: Joi.string()
            .min(6)
            .required(),
        telephone: JoiPhone.string()
            .phoneNumber(),
        adresses : Joi.array()
            .items(addressSchema)
            .required(),
        date: Joi.date()
            .optional(),
        authTokens: Joi.array()
            .optional(),
        __v: Joi.number()
            .optional()
    });

    return schema.validate(data);
}

//Login Validation
const loginValidationCustomer = (data) => {
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

module.exports.registerValidationCustomer =  registerValidationCustomer;
module.exports.loginValidationCustomer =  loginValidationCustomer;