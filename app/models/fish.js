const mongoose = require('mongoose')
const user = require('./user')

const fishSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: user
        },
        waterId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: stream
        },
        species: String,
        length: Number,
        weight: Number,
        description: String
    },
    {
		timestamps: true,
		toObject: {
			// remove `userId` field when we call `.toObject`
			transform: (_doc, fish) => {
				delete fish.userId
				return fish
			},
		},
	}
)

module.exports = mongoose.model('Fish', fishSchema)