const express = require('express')
const router = express.Router()
const Event = require('../db/eventSchema')
const cors = require('cors')
const { eventValidationSchema } = require('../db/validationSchema')

router.use(cors())


router.post('/', async (req, res, next) => {

    const validationResult = await eventValidationSchema.validate(req.body)

    if (validationResult.error) {
        return res.status(422).json({
            success: false,
            data: null,
            error: validationResult.error.details[0].message,
        })
    } else {
        const { title,
            longDesc,
            shortDesc,
            date,
            time,
            location,
            host,
            hostDesc,
            tags, alt, } = req.body
        const newEvent = await Event.create({
            title,
            longDesc,
            shortDesc,
            date,
            time,
            location,
            host,
            hostDesc,
            tags,
            alt,
            image: req.file.filename,

        })

        try {
            newEvent.save().then((evt) => {
                res.status(200).json({
                    success: true,
                    data: newEvent,
                    error: null
                })
                console.log(newEvent)
            })
        } catch (err) {
            console.log(err)
            res.status(500).json({ success: false, data: null, error: err })
        }
    }
})


router.get('/:id', async (req, res, next) => {

    try {
        const event = await Event.findOne({ _id: req.params.id })
        if (!event) {
            return res.status(404).json({ success: false, data: null, error: 'event not found' })
        } else {
            const restructuredEventData = {
                id: event._id,
                title: event.title,
                shortDesc: event.shortDesc,
                longDesc: event.longDesc,
                date: event.date,
                time: event.time,
                location: event.location,
                host: event.host,
                hostDesc: event.hostDesc,
                tags: event.tags,
                image: `http://localhost:999/public/uploads/${event.image}`,
                alt: event.alt
            }
            res.status(200).json({ success: true, data: restructuredEventData, error: null })

        }



    } catch (err) {
        console.log(err)
        res.status(500).json({ success: false, data: null, error: 'Internal server error' })
    }
})

router.get('/', async (req, res, next) => {
    try {
        const events = await Event.find({})
        if (!events || events.length === 0) {
            return res.status(404).json({ success: false, data: null, error: 'No events found' })
        }

        const restructuredData = events.map(({ title, shortDesc, date, _id, image }) => ({
            id: _id,
            title,
            shortDesc,
            image: `http://localhost:999/public/uploads/${image}`,
            date
        }))
        console.log(restructuredData)
        res.status(200).json({ success: true, data: restructuredData, error: null })
    } catch (error) {
        res.status(500).json({ success: false, data: null, error: 'Internal server error' })
    }
})

module.exports = router
