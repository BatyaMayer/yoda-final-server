const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now
    },
})

const Event = mongoose.model('Event', eventSchema)

module.exports = Event
