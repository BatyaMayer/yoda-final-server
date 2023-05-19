const express = require('express');
require('./mongo/connection');
const cors = require('cors');
const path = require('path');
const passport = require('passport');
const User = require('./mongo/userSchema');
require('dotenv').config();
require('./passport/config')(passport);
const signupRouter = require('./routes/signup');
const loginRouter = require('./routes/login');

const PORT = 999;
const app = express();

app.use(passport.initialize());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/signup', signupRouter);
app.use('/api/login', loginRouter);

app.listen(PORT, () => console.log('Server up on port', PORT));
