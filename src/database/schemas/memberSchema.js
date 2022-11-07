const mongoose = require("mongoose")

const memberSchema = new mongoose.Schema({
	memberId: {
		type: String,
		require: true,
		unique: true,
	},
	memberName: {
		type: String,
		require: true,
		unique: true,
	},
	memberImage: {
		type: String,
	},
	memberMains: [
		{
			type: mongoose.SchemaTypes.ObjectId,
			ref: "heroes",
		},
	],
	memberRole: {
		type: String,
	},
})

module.exports = mongoose.model("members", memberSchema)
