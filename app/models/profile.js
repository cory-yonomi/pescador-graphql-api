const mongoose = require('mongoose')
const user = require('./user')
const station = require('./station')

const profileSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: user,
            required: true,
            unique: true
        },
        favoriteStation: {
            type: mongoose.Schema.Types.ObjectId,
            ref: station
        },
        firstName: String,
        lastName: String,
        zipCode: Number,
        style: String
    }
)

module.exports = mongoose.model('Profile', profileSchema)