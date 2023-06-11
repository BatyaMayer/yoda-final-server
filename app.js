const express = require('express')
require('./db/connection')
const cors = require('cors')
const path = require('path')
const ejs = require('ejs')
const passport = require('passport')
const User = require('./db/userSchema')
require('dotenv').config()
require('./passport/config')(passport)

const multer = require('multer')

const { validToken } = require('./passport/utils')
const connect = require('./db/connection')
const signupRouter = require('./api/signup')
const loginRouter = require('./api/login')
const eventsRouter = require('./api/events')
const upload = require('./middleware/upload')

const PORT = 999
const app = express()

app.use(express.static('./public'))
app.use(passport.initialize())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.use('/public', express.static(path.join(__dirname, 'public')))



// Routes
app.use('/api/signup', signupRouter)
app.use('/api/login', loginRouter)
app.use('/api/events', upload.single('image'), eventsRouter)



app.listen(PORT, () => console.log('Server up on port', PORT))
