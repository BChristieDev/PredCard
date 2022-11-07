const Discord = require("discord.js")
const chalk = require("chalk")
const internalServerError = require("../../embeds/serverErrors/internalServerError")

module.exports = {
	name: "interactionCreate",
	async execute(interaction, client) {
		if (interaction.isChatInputCommand()) {
			const command = client.commandCollection.get(interaction.commandName)

			try {
				await command.execute(interaction, client)
			} catch (e) {
				const internalServerErrorEmbed = internalServerError(interaction, client, Discord)
				console.log(chalk.red(e))

				await interaction.reply({
					embeds: [internalServerErrorEmbed],
				})
			}
		}
	},
}
