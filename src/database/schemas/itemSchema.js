const mongoose = require("mongoose")

const itemDescriptions = new mongoose.Schema({
	itemDescriptionType: {
		type: String,
	},
	itemDescription: {
		type: String,
	},
})

const itemSchema = new mongoose.Schema({
	itemName: {
		type: String,
		require: true,
		unique: true,
	},
	itemCost: {
		type: Number,
		require: true,
	},
	itemRarity: {
		type: String,
		require: true,
	},
	itemTags: [
		{
			type: String,
			require: true,
		},
	],
	itemComponents: [
		{
			type: String,
		},
	],
	itemStats: {
		type: Object,
	},
	itemDescriptions: [itemDescriptions],
})

module.exports = mongoose.model("items", itemSchema)
