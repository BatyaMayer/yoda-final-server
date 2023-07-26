const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const User = require('../db/userSchema')
const cors = require('cors')


router.use(cors())


router.get('/header', async (req, res, next) => {
    const userId = req.user
    try {
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ success: false, data: null, error: 'user not found' })
        }
        return res.status(200).json({ success: true, data: user.firstName, error: null })
    } catch (error) {
        return res.status(500).json({ success: false, data: null, error: error.message })
    }
})

//mentor/student card on page 
router.get('/type/:userType', async (req, res, next) => {
    const userId = req.user
    const userType = req.params.userType

    try {
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ success: false, data: null, error: 'user not found' })
        }

        const users = await User.find({ type: userType })

        if (!users) {
            return res.status(404).json({ success: false, data: null, error: 'no users found' })
        }

        const restructuredData = users.map(user => ({
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            subjects: user.subjects,
            type: user.type,
            image: `http://localhost:999/public/uploads/${user.profileImage}`,
        }))

        return res.status(200).json({ success: true, data: restructuredData, error: null })
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ success: false, error: 'server error', message: error.message })
    }
})


//user profile page 
router.get('/:id', async (req, res, next) => {
    const userProfileId = req.params.id
    const userId = req.user

    if (!userProfileId || !userId) {
        return res.status(400).json({ success: false, data: null, error: 'invalid userId or user profile id' })
    }

    try {
        const userProfile = await User.findOne({ _id: userProfileId })
        if (!userProfile) {
            return res.status(404).json({ success: false, data: null, error: 'user profile not found' })
        }

        const restructuredUserProfileData = {
            id: userProfile._id,
            firstName: userProfile.firstName,
            lastName: userProfile.lastName,
            type: userProfile.type,
            about: userProfile.about,
            subjects: userProfile.subjects,
            email: userProfile.email,
            phone: 'empty',
            location: 'empty',
            education: 'empty',
            profileImage: `http://localhost:999/public/uploads/${userProfile.profileImage}`
        }

        res.status(200).json({
            success: true,
            data: restructuredUserProfileData,
            error: null
        })
    } catch (error) {
        next(error)
    }
})


//user card on home page 
router.get('/', async (req, res, next) => {
    const userId = req.user

    try {
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ success: false, data: null, error: 'user not found' })
        }

        const userType = user.type === "student" ? "mentor" : "student"
        const otherUsers = await User.find({ type: userType })

        if (!otherUsers.length) {
            return res.status(200).json({ success: true, data: [], error: 'no users found' })
        }

        const restructuredData = otherUsers.map(user => ({
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            subjects: user.subjects,
            type: user.type,
            image: `http://localhost:999/public/uploads/${user.profileImage}`,
        }))

        return res.status(200).json({ success: true, data: restructuredData, error: null })
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ success: false, error: 'server error', message: error.message })
    }
})

module.exports = router
