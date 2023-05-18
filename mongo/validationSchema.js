const Joi = require('joi')

const validationSchema = Joi.object({
    firstName: Joi.string().min(2).max(20).required().pattern(/^[A-Za-z]+$/),
    lastName: Joi.string().min(2).max(20).required().pattern(/^[A-Za-z]+$/),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).pattern(/^(?=.*[a-zA-Z])(?=.*\d).+/),
    confirmPassword: Joi.ref('password'),
    agreeToTerms: Joi.boolean().required().valid(true)
})

module.exports = validationSchema
