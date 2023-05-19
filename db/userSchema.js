const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: false
    },
    lastName: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    agreeToTerms: {
        type: Boolean,
        required: false
    },
    salt: {
        type: String,
        required: false
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    role: {
        type: String,
        required: true,
        enum: ['user', 'admin'],
        default: 'user'
    }
})

module.exports = mongoose.model('User', userSchema)
