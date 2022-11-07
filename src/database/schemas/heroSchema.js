const mongoose = require("mongoose")

const heroSchema = new mongoose.Schema({
	heroName: {
		type: String,
		require: true,
		unique: true,
	},
	heroRole: {
		type: String,
		require: true,
	},
	heroPortrait: {
		type: String,
		require: true,
		unique: true,
	},
})

module.exports = mongoose.model("heroes", heroSchema)
