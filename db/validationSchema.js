const Joi = require('joi')

const signupValidationSchema = Joi.object({
    firstName: Joi.string().min(2).max(20).required().pattern(/^[A-Za-z]+$/),
    lastName: Joi.string().min(2).max(20).required().pattern(/^[A-Za-z]+$/),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).pattern(/^(?=.*[a-zA-Z])(?=.*\d).+/),
    confirmPassword: Joi.ref('password'),
    agreeToTerms: Joi.boolean().required().valid(true)
})

const loginValidationSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).pattern(/^(?=.*[a-zA-Z])(?=.*\d).+/),
})

module.exports = {
    signupValidationSchema,
    loginValidationSchema

}
