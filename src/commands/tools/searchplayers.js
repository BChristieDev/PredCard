const Discord = require("discord.js")
const Member = require("../../database/schemas/memberSchema")
const badRequest = require("../../embeds/clientErrors/badRequest")
const notFound = require("../../embeds/clientErrors/notFound")

module.exports = {
	data: new Discord.SlashCommandBuilder()
		.setName("searchplayers")
		.setDescription("Display up to fifty (50) currently online players based on the chosen option.")
		.addStringOption((option) => {
			return option.setName("mains").setDescription("Search for players who main one or more of the specified heroes.")
		}),
	async execute(interaction, client) {
		const mainsOption = interaction.options.getString("mains")
		let findMemberById
		let playerList = []
		let message = ""

		if (mainsOption == null) {
			const value = `${interaction.member.user.tag} must add mains to search for.`
			const badRequestEmbed = badRequest(interaction, client, Discord, value)

			await interaction.reply({
				embeds: [badRequestEmbed],
			})
		} else {
			const mains = mainsOption.replaceAll(" ", "")
			const mainsSpaces = mains.replace(/([a-z])([A-Z])/g, "$1 $2").split(",")
			const onlineMemberIds = Array.from(
				await interaction.guild.members.cache.filter((member) => !member.user.bot && member.presence?.status === "online").keys()
			)

			if (playerList.length < 50) {
				for (const memberId of onlineMemberIds) {
					try {
						findMemberById = (await Member.where("memberId").equals(memberId).populate("memberMains"))[0]
					} catch {
						findMemberById == null
					}

					for (const main of mainsSpaces) {
						if (findMemberById != null && findMemberById.memberMains != null) {
							for (const memberMain of findMemberById.memberMains) {
								if (memberMain.heroName === main) {
									playerList.push(`${findMemberById.memberName} mains: ${main}.`)
								}
							}
						}
					}
				}
			}

			if (playerList.length > 0) {
				for (player of playerList) {
					if (message.length === 0) {
						message = player
					} else message += `\n${player}`
				}

				const searchPlayersEmbed = new Discord.EmbedBuilder()
					.setColor(client.successColor)
					.setTitle("Search Complete")
					.setDescription(message)
					.setThumbnail(interaction.member.user.displayAvatarURL())

				await interaction.reply({
					embeds: [searchPlayersEmbed],
				})
			} else {
				description = "No online players were found with the specified mains."
				value = "Try being less restrictive with your search results."
				const notFoundEmbed = notFound(interaction, client, Discord, description, value)

				await interaction.reply({
					embeds: [notFoundEmbed],
				})
			}
		}
	},
}
