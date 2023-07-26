const mongoose = require('mongoose')
const Event = require('./eventSchema')


const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    about: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    agreeToTerms: {
        type: Boolean,
        required: true
    },

    profileImage: {
        type: String,
        required: false
    },

    salt: {
        type: String,
        required: false
    },
    registeredEvents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: false
    }],
    created_at: {
        type: Date,
        default: Date.now
    },
    role: {
        type: String,
        required: true,
        enum: ['user', 'admin'],
        default: 'user'
    },
    type: {
        type: String,
        required: true,
        enum: ['student', 'mentor'],
    },
    subjects: {
        type: Array,
        required: true,
    }
})

module.exports = mongoose.model('User', userSchema)
