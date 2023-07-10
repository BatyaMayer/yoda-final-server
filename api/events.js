const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const Event = require('../db/eventSchema')
const User = require('../db/userSchema')
const cors = require('cors')
const { eventValidationSchema } = require('../db/validationSchema')

router.use(cors())



router.get('/registered-events-ids', async (req, res) => {
    try {
        const userId = req.user
        const user = await User.findOne({ _id: userId })
        if (!user) {
            return res.status(404).json({ success: false, data: null, error: 'user not found' })
        }

        const eventsId = user.registeredEvents
        res.status(200).json({ success: true, data: eventsId, error: null })
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ success: false, data: null, error: 'internal server error' })
    }
})



router.get('/registered-events', async (req, res) => {
    try {
        const userId = req.user
        const user = await User.findOne({ _id: userId })
        if (!user) {
            return res.status(404).json({ success: false, data: null, error: 'user not found' })
        }

        const eventsId = user.registeredEvents
        const events = await Event.find({ _id: { $in: eventsId } })
        if (events.length === 0) {
            return res.status(404).json({ success: false, data: null, error: 'No events found' })
        }

        const restructuredData = events.map(({ _id, title, shortDesc, date, image }) => ({
            id: _id,
            title,
            shortDesc,
            image: `http://localhost:999/public/uploads/${image}`,
            date
        }))

        res.status(200).json({ success: true, data: restructuredData, error: null })
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ success: false, data: null, error: 'Internal server error' })
    }
})


router.delete('/:id/register', async (req, res, next) => {
    const eventId = req.params.id
    const userId = req.user



    if (!userId || !eventId) {
        return res.status(400).json({ success: false, data: null, error: 'invalid userId or eventId' })
    }

    try {
        const user = await User.findOne({ _id: userId })


        if (!user) {
            return res.status(404).json({ success: false, data: null, error: 'user not found' })
        }

        const event = await Event.findById(eventId)


        if (!event) {
            return res.status(404).json({ success: false, data: null, error: 'event not found' })
        }

        if (user.registeredEvents.includes(eventId)) {
            user.registeredEvents.pull(eventId)
        } else {
            return res.status(400).json({ success: false, data: null, error: 'user not registered' })
        }


        if (event.registeredUsers.includes(userId)) {
            event.registeredUsers.pull(userId)
        } else {
            return res.status(400).json({ success: false, data: null, error: 'user not registered' })
        }


        await user.save()
        await event.save()

        const userRegisteredEvents = user.registeredEvent


        res.status(200).json({ success: true, data: userRegisteredEvents, error: null })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, data: null, error: 'Internal server error' })
    }
})




router.patch('/:id/register', async (req, res, next) => {
    const eventId = req.params.id
    const userId = req.user

    if (!userId || !eventId) {
        return res.status(400).json({ success: false, data: null, error: 'Invalid userId or eventId' })
    }

    try {
        const user = await User.findOne({ _id: userId })

        if (!user) {
            return res.status(404).json({ success: false, error: 'user not found' })
        }

        if (user.registeredEvents.includes(eventId)) {
            return res.status(400).json({ success: false, error: 'user already registered' })
        }


        const event = await Event.findById(eventId)

        if (!event) {
            return res.status(404).json({ success: false, error: 'event not found' })
        }

        // Check if the event date has not passed
        // const currentDate = new Date()
        // const eventDate = new Date(event.date)

        // if (eventDate < currentDate) {
        //     return res.status(400).json({ success: false, error: 'event date has passed' })
        // }


        if (event.registeredUsers.includes(userId)) {
            return res.status(400).json({ success: false, error: 'user already registered' })
        }

        user.registeredEvents.push(eventId)
        event.registeredUsers.push(userId)

        await user.save()
        await event.save()

        const userRegisteredEvents = user.registeredEvents

        res.status(200).json({ success: true, data: userRegisteredEvents, error: null })

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, data: null, error: 'Internal server error' })
    }

})





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

            })
        } catch (err) {
            console.log(err)
            res.status(500).json({ success: false, data: null, error: err })
        }
    }
})




router.get('/:id', async (req, res, next) => {
    const eventId = req.params.id
    const userId = req.user

    if (!userId || !eventId) {
        return res.status(400).json({ success: false, data: null, error: 'Invalid userId or eventId' })
    }

    try {
        const event = await Event.findOne({ _id: eventId })
        if (!event) {
            return res.status(404).json({ success: false, data: null, error: 'Event not found' })
        }

        const user = await User.findOne({ _id: userId })
        if (!user) {
            return res.status(404).json({ success: false, data: null, error: 'User not found' })
        }

        // const isRegistered = user.registeredEvents.includes(eventId)

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
            alt: event.alt,
            // isRegistered: isRegistered
        }

        const userRegisteredEvents = user.registeredEvents

        res.status(200).json({
            success: true,
            data: {
                event: restructuredEventData,
                userRegisteredEvents: userRegisteredEvents
            },
            error: null
        })
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

        res.status(200).json({ success: true, data: restructuredData, error: null })
    } catch (error) {
        res.status(500).json({ success: false, data: null, error: 'Internal server error' })
    }
})

module.exports = router
