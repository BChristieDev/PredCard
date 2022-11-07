const DiscordRest = require("@discordjs/rest")
const DiscordAPITypes = require("discord-api-types/v10")
const chalk = require("chalk")
const fs = require("fs")

const rest = new DiscordRest.REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN)

module.exports = (client) => {
	client.commandHandler = async () => {
		const commandFolders = fs.readdirSync("./src/commands")

		for (const folder of commandFolders) {
			const commandFiles = fs.readdirSync(`./src/commands/${folder}`).filter((file) => file.endsWith(".js"))

			for (const file of commandFiles) {
				const command = require(`../../commands/${folder}/${file}`)

				client.commandCollection.set(command.data.name, command)
				client.commandArray.push(command.data.toJSON())
			}
		}

		try {
			console.log(chalk.green("Started refreshing application (/) commands"))

			await rest.put(DiscordAPITypes.Routes.applicationCommands(process.env.CLIENT_ID), {
				body: client.commandArray,
			})

			/*await rest.put(DiscordAPITypes.Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), {
				body: client.commandArray,
			})*/

			console.log(chalk.green("Successfully reloaded application (/) commands"))
		} catch (e) {
			console.log(chalk.red(e))
		}
	}
}
