const express = require('express')
const bcrypt = require('bcrypt')
require('./mongo/connection')
const cors = require('cors')
const path = require('path')
const passport = require('passport')
const User = require('./mongo/userSchema')
require('dotenv').config()
require('./passport/config')(passport)

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
    const saltRounds = 13
    const salt = await bcrypt.genSalt(saltRounds)
    const hash = await bcrypt.hash(password, saltRounds)

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
        console.log(newUser)
        res.json({ success: true, user: newUser })
        // res.status(201).json(newUser)
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
})


app.get('/login', (req, res) => {
    console.log('login page')

})

app.listen(PORT, () => console.log('server up'))






