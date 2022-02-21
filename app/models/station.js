const { Decimal128, Long } = require('mongodb')
const mongoose = require('mongoose')
const water = require('./water')

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

module.exports = stationSchema 