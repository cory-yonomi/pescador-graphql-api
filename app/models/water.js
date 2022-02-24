const mongoose = require('mongoose')
const user = require('./user')

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
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: user
        }
    }
)

module.exports = mongoose.model('Water', waterSchema)