const mongoose = require('mongoose')

const waterSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true
        },
        type: {
            type: String,
            required: true
        },
        stations: [stationSchema]
    }
)

module.exports = mongoose.model('Water', waterSchema)