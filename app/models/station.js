const mongoose = require('mongoose')
const water = require('./water')
const user = require('./user')

const stationSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        usgsId: {
            type: String,
            required: true
        },
        longitude: {
            type: Number,
            required: true
        },
        latitude: {
            type: Number,
            required: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: user
        }
    }
)

module.exports = mongoose.model('Station', stationSchema) 