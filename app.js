const express = require('express')
require('./mongo/connection')
const cors = require('cors')
const path = require('path')
const passport = require('passport')
const User = require('./mongo/userSchema')
require('dotenv').config()
require('./passport/config')(passport)
const utils = require('./passport/utils')
// const genKeyPair = require('./genKeyPair')

const PORT = 999
const app = express()

app.use(passport.initialize())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.use(express.static(path.join(__dirname, 'public')))

// genKeyPair()

app.get('/signup', (req, res) => {
    console.log('signup page')
})

app.post('/signup', async (req, res) => {
    const { email, password, firstName, lastName, agreeToTerms } = req.body

    const saltHash = utils.genPassword(password)
    const salt = saltHash.salt
    const hash = saltHash.hash

    try {
        const existingUser = await User.findOne({ email: email })

        if (existingUser) {
            return res.status(409).json({
                success: false,
                data: null,
                error: { email: 'Email already exists' },
            })
        }

        const newUser = await User.create({
            email,
            password: hash,
            salt: salt,
            firstName,
            lastName,
            agreeToTerms,
        })

        try {
            newUser.save().then((user) => {
                const tokenObject = utils.issueJWT(user)

                res.status(200).json({
                    success: true,
                    data: {
                        user: user,
                        token: tokenObject.token.split(' ')[1],
                        expiresIn: tokenObject.expires,
                    },
                    error: null,
                })
                console.log(newUser)
            })
        } catch (err) {
            console.log(err)
            res.status(500).json({ success: false, data: null, error: err })
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({ success: false, data: null, error: err })
    }
})


app.get('/login', (req, res) => {
    console.log('login page')
})


app.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email: email })

        if (!user) {
            return res.status(401).json({ success: false, data: null, error: 'user not found' })
        }

        const isValid = utils.validPassword(password, user.password, user.salt)

        if (isValid) {
            const { firstName, lastName, email } = user
            const tokenObject = utils.issueJWT(user)
            const token = tokenObject.token.split(' ')[1]

            res.status(200).json({
                success: true,
                data: { firstName, lastName, email, token },
                error: null,
            })
        } else {
            res.status(401).json({ success: false, data: null, error: 'wrong password' })
        }
    } catch (err) {
        next(err)
    }
})



app.listen(PORT, () => console.log('server up'))
