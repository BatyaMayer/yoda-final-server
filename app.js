const express = require('express')
const bcrypt = require('bcrypt')
require('./mongo/connection')
const cors = require('cors')
const path = require('path')
const passport = require('passport')
const User = require('./mongo/userSchema')
require('dotenv').config()
require('./passport/config')(passport)
const utils = require('./passport/utils')

const PORT = 999
const app = express()

app.use(passport.initialize())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.use(express.static(path.join(__dirname, 'public')))

app.get('/signup', (req, res) => {
    console.log('signup page')
})

app.post('/signup', async (req, res) => {

    const { email, password, firstName, lastName, phoneNumber, city, agreeToTerms } = req.body

    const saltHash = utils.genPassword(password)
    const salt = saltHash.salt
    const hash = saltHash.hash

    try {
        const existingUser = await User.findOne({ email: email })
        if (existingUser) {
            return res.status(409).json({
                errors: { email: 'Email already exists' }
            })
        }

        const newUser = await User.create({
            email,
            password: hash,
            salt: salt,
            firstName,
            lastName,
            phoneNumber,
            city,
            agreeToTerms
        })

        try {
            newUser.save().then((user) => {

                const tokenObject = utils.issueJWT(user)

                res.status(200).json({ success: true, user: user, token: tokenObject.token, expiresIn: tokenObject.expires })
                console.log(newUser)
            })
        } catch (err) {
            console.log(err)
            res.status(500).json(err)
        }
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
})

app.get('/login', (req, res) => {
    console.log('login page')
})



app.post('/login', (req, res, next) => {

    const { email, password } = req.body

    User.findOne({ email: email })

        .then((user) => {

            if (!user) {
                res.status(401).json({ success: false, msg: 'User not found' })
            }

            const isvalid = utils.validPassword(password, user.password, user.salt)

            if (isvalid) {

                const tokenObject = utils.issueJWT(user)

                res.status(200).json({ success: true, user: user, token: tokenObject.token, expiresIn: tokenObject.expires })

            } else {

                res.status(401).json({ success: false, msg: "you entered the wrong password" })

            }
        })
        .catch((err) => {
            next(err)
        })

})

app.listen(PORT, () => console.log('server up'))
