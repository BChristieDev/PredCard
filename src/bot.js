/*
 * Programmer Name: Brandon Christie
 * Project Name:    PredCard
 * Version:         1.1.0 (Alpha)
 * Description:     PredCard is an open-source Discord Bot developed by Brandon Christie that allows users to create a "PredCard", a public profile with
 *                  information such the users main heroes and roles for the upcoming 3rd-Person MOBA game Predecessor. Users also have the ability to search
 *                  for other players in their Discord Server who have a PredCard based on specific criteria.
 */

require("dotenv").config()
const Discord = require("discord.js")
const fs = require("fs")
const connection = require("./database/connection")

const client = new Discord.Client({
	intents: [Discord.GatewayIntentBits.Guilds, Discord.GatewayIntentBits.GuildMessages, Discord.GatewayIntentBits.GuildPresences],
})
const functionFolders = fs.readdirSync("./src/functions")

client.commandCollection = new Discord.Collection()
client.commandArray = []
client.defaultColor = "0xFFFFFF"
client.successColor = "0x00FF00"
client.errorColor = "0xFF0000"

for (const folder of functionFolders) {
	const functionFiles = fs.readdirSync(`./src/functions/${folder}`).filter((file) => file.endsWith(".js"))

	for (const file of functionFiles) {
		require(`./functions/${folder}/${file}`)(client)
	}
}

connection()
client.eventHandler()
client.commandHandler()
client.login(process.env.DISCORD_TOKEN)
