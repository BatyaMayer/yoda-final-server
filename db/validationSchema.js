const Joi = require('joi')

const signupValidationSchema = Joi.object({
    firstName: Joi.string().min(2).max(20).required().pattern(/^[A-Za-z]+$/),
    lastName: Joi.string().min(2).max(20).required().pattern(/^[A-Za-z]+$/),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).pattern(/^(?=.*[a-zA-Z])(?=.*\d).+/).required(),
    confirmPassword: Joi.ref('password'),
    agreeToTerms: Joi.boolean().required().valid(true).required(),
    type: Joi.string().required(),
    subjects: Joi.array().required(),
    profileImage: Joi.string(),
    about: Joi.string().required().min(10).max(1000)
})

const loginValidationSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).pattern(/^(?=.*[a-zA-Z])(?=.*\d).+/),
})

const eventValidationSchema = Joi.object({
    title: Joi.string().min(2),
    longDesc: Joi.string().min(2),
    shortDesc: Joi.string().min(2),
    date: Joi.string(),
    time: Joi.string(),
    location: Joi.string(),
    host: Joi.string(),
    hostDesc: Joi.string(),
    // tags: Joi.array, 
    image: Joi.string(),
    alt: Joi.string()


})

module.exports = {
    signupValidationSchema,
    loginValidationSchema,
    eventValidationSchema
}
