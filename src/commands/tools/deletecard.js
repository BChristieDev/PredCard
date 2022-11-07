const Discord = require("discord.js")
const Member = require("../../database/schemas/memberSchema")
const badRequest = require("../../embeds/clientErrors/badRequest")
const notFound = require("../../embeds/clientErrors/notFound")

module.exports = {
	data: new Discord.SlashCommandBuilder()
		.setName("deletecard")
		.setDescription("Delete your PredCard.")
		.addStringOption((option) => {
			return option.setName("delete").setDescription(`Delete your PredCard by typing: "DELETE".`)
		}),
	async execute(interaction, client) {
		let findMemberById
		let deleteOption = interaction.options.getString("delete")

		if (deleteOption != null) {
			deleteOption = deleteOption.trim()
		}

		try {
			findMemberById = (await Member.where("memberId").equals(interaction.member.user.id))[0]
		} catch {
			findMemberById = null
		}

		if (findMemberById == null) {
			const description = `${interaction.member.user.tag} has not created a PredCard.`
			const value = "Use the /createcard command to create a PredCard."
			const notFoundEmbed = notFound(interaction, client, Discord, description, value)

			await interaction.reply({
				embeds: [notFoundEmbed],
			})
		} else {
			if (deleteOption !== "DELETE") {
				const value = `${interaction.member.user.tag} must choose the "delete" option and type: "DELETE. Received: "${deleteOption}".`
				const badRequestEmbed = badRequest(interaction, client, Discord, value)

				await interaction.reply({
					embeds: [badRequestEmbed],
				})
			} else {
				const member = findMemberById

				await member.remove()

				const cardDeleteEmbed = new Discord.EmbedBuilder()
					.setColor(client.successColor)
					.setTitle("PredCard Deleted")
					.setDescription(`PredCard for ${interaction.member.user.tag} deleted successfully.`)
					.setThumbnail(interaction.member.user.displayAvatarURL())

				await interaction.reply({
					embeds: [cardDeleteEmbed],
				})
			}
		}
	},
}
