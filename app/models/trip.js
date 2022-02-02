const mongoose = require('mongoose')
const stream = require('./stream')

const tripSchema = new mongoose.Schema(
    {
        date: {
            type: Date,
            required: true
        },
        weather: String,
        description: String,
        streamId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: stream,
            required: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: user
        }
    },
    {
		timestamps: true,
		toObject: {
			// remove `userId` field when we call `.toObject`
			transform: (_doc, trip) => {
				delete trip.userId
				return trip
			},
		},
	}
)

module.exports = mongoose.model('Trip', tripSchema)