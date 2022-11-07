const Discord = require("discord.js")
const Member = require("../../database/schemas/memberSchema")
const notFound = require("../../embeds/clientErrors/notFound")

module.exports = {
	data: new Discord.SlashCommandBuilder()
		.setName("viewcard")
		.setDescription("View your PredCard.")
		.addStringOption((option) => {
			return option.setName("player").setDescription("View PredCard of another player.")
		}),
	async execute(interaction, client) {
		let playerOption = interaction.options.getString("player")
		let findMember
		let memberMainsField = []
		let displayCardEmbed
		let imagePath
		let imageName
		let image
		let imageURL

		if (playerOption != null) {
			playerOption = playerOption.trim()

			try {
				findMember = (await Member.where("memberName").equals(playerOption).populate("memberMains"))[0]
			} catch {
				findMember = null
			}
		} else {
			try {
				findMember = (await Member.where("memberId").equals(interaction.member.user.id).populate("memberMains"))[0]
			} catch {
				findMember = null
			}
		}

		if (findMember == null) {
			const description = `${interaction.member.user.tag} has not created a PredCard.`
			const value = "Use the /createcard command to create a PredCard."

			if (playerOption == null) {
				const notFoundEmbed = notFound(interaction, client, Discord, description, value)

				await interaction.reply({
					embeds: [notFoundEmbed],
				})
			} else {
				const notFoundPlayerOptionEmbed = new Discord.EmbedBuilder()
					.setColor(client.errorColor)
					.setTitle("404 Not Found")
					.setDescription(`${playerOption} was not found.`)
					.addFields({
						name: "Solution",
						value: 'Was there a typo in your search? Did you add the discriminator after the name (example: "#1234")',
					})

				await interaction.reply({
					embeds: [notFoundPlayerOptionEmbed],
				})
			}
		} else {
			const member = findMember

			for (const main of member.memberMains) {
				memberMainsField.push({
					name: main.heroName,
					value: main.heroRole,
					inline: true,
				})
			}

			if (member.memberImage == null) {
				if (interaction.member.user.id === member.memberId) {
					imageURL = interaction.member.user.displayAvatarURL()
				} else {
					await interaction.guild.members.fetch(member.memberId).then((member) => {
						imageURL = member.user.displayAvatarURL()
					})
				}
			} else {
				imagePath = member.memberImage
				imageName = imagePath.split("/")[5]
				image = new Discord.AttachmentBuilder(imagePath)
				imageURL = `attachment://${imageName}`
			}

			displayCardEmbed = new Discord.EmbedBuilder()
				.setColor(client.defaultColor)
				.setTitle(`${member.memberName}'s PredCard`)
				.addFields(memberMainsField)
				.setThumbnail(imageURL)

			if (member.memberImage == null) {
				await interaction.reply({
					embeds: [displayCardEmbed],
				})
			} else {
				await interaction.reply({
					embeds: [displayCardEmbed],
					files: [image],
				})
			}
		}
	},
}
