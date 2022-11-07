function badRequest(interaction, client, Discord, value) {
	const badRequestEmbed = new Discord.EmbedBuilder()
		.setColor(client.errorColor)
		.setTitle("400 Bad Request")
		.setDescription("A command was requested with-out using the correct format")
		.addFields({
			name: "Solution",
			value: value,
		})
		.setThumbnail(interaction.member.user.displayAvatarURL())

	return badRequestEmbed
}

module.exports = badRequest
