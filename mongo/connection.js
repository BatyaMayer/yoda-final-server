const mongoose = require('mongoose')
require('dotenv').config()
const genKeyPair = require('../passport/genKeyPair')

async function connect() {
    try {
        await mongoose.connect(process.env.MONGOURI)
        console.log('Connected to MongoDB')
    } catch (error) {
        console.error('Error connecting to MongoDB: ', error.message)
    }
}

connect()
genKeyPair()
