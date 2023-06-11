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
        const { title, description, date } = req.body
        const newEvent = await Event.create({
            title: title,
            description: description,
            date: date,
            image: req.file ? req.file.filename : null
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



router.get('/', async (req, res, next) => {
    try {
        const events = await Event.find({})
        if (!events || events.length === 0) {
            return res.status(200).json({ success: false, data: null, error: 'No events found' })
        }

        const restructuredData = events.map(({ title, description, date, _id, image }) => ({
            id: _id,
            title,
            description,
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
