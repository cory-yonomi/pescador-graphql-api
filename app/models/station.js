const { Decimal128 } = require('mongodb')
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
            type: Decimal128,
            required: true
        },
        latitude: {
            type: Decimal128,
            required: true
        }
    }
)

module.exports = stationSchema