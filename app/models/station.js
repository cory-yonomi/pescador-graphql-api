const mongoose = require('mongoose')

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
        }
    }
)

module.exports = mongoose.model('Station', stationSchema) 