const { string } = require('joi')
const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        // required: true,
    },
    host: {
        type: String,
        // required: true,
    },
    hostDesc: {
        type: String,
        // required: true,
    },
    date: {
        type: String,
        // required: true,
    },
    time: {
        type: String,
        // required: true,

    },
    longDesc: {
        type: String,
        // required: true,
    },
    shortDesc: {
        type: String,
        // required: true,

    },

    image: {
        type: String,
        // required: true,
    },
    alt: {
        type: String,
        // required: true,

    },
    tags: {
        type: Array,
   

    },
    location: {
        type: String,
        // required: true,
    },

    created_at: {
        type: Date,
        default: Date.now
    },
})

const Event = mongoose.model('Event', eventSchema)

module.exports = Event
