const mongoose = require('mongoose')
const user = require('./user')
const station = require('./station')

const profileSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: user,
            required: true
        },
        favoriteStation: {
            type: mongoose.Schema.Types.ObjectId,
            ref: station
        },
        zipCode: Number,
        style: String
    }
)

modules.export = mongoose.model('Profile', profileSchema)