const express = require('express')
const router = express.Router()
const { loginValidationSchema } = require('../db/validationSchema')
const User = require('../db/userSchema')
const utils = require('../passport/utils')



router.get('/', async (req, res, next) => {
    const id = req.body.id

    const user = await User.findOne({ id: id })
    const { registeredEvents } = user

    if (!user) {
        return res.status(401).json({ success: false, data: null, error: 'user not found' })
    } else {
        res.status(200).json({
            success: true,
            data: { registeredEvents },
            error: null,
        })
    }

})

router.post('/', async (req, res, next) => {
    const validationResult = await loginValidationSchema.validate(req.body)

    if (validationResult.error) {
        return res.status(422).json({
            success: false,
            data: null,
            error: validationResult.error.details[0].message,
        })
    } else {

        try {
            const { email, password } = req.body
            const user = await User.findOne({ email: email })

            if (!user) {
                return res.status(401).json({ success: false, data: null, error: 'user not found' })
            }

            const isValid = utils.validPassword(password, user.password, user.salt)

            if (isValid) {
                const { firstName, lastName, profileImage, email, type, subjects, about, id } = user
                const tokenObject = utils.issueJWT(user)
                const token = tokenObject.token.split(' ')[1]

                const userData = {
                    firstName, lastName, profileImage: `http://localhost:999/public/uploads/${profileImage}`, email, type, subjects, about
                }

                res.status(200).json({
                    success: true,
                    data: { userData, token, id },
                    error: null,
                })
            } else {
                res.status(401).json({ success: false, data: null, error: 'wrong password' })
            }
        } catch (err) {
            next(err)
        }
    }
})

module.exports = router
