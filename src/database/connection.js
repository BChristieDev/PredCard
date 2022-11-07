require("dotenv").config()
const mongoose = require("mongoose")
const chalk = require("chalk")

const dbOptions = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
}

async function connect() {
	mongoose
		.connect(process.env.MONGO_URI, dbOptions)
		.then(() => {
			console.log(chalk.green("Successfully connected to database"))
		})
		.catch((e) => {
			console.log(chalk.red(e.message))
		})
}

module.exports = connect
