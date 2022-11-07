function notFound(interaction, client, Discord, description, value) {
	const notFoundEmbed = new Discord.EmbedBuilder()
		.setColor(client.errorColor)
		.setTitle("404 Not Found")
		.setDescription(description)
		.addFields({
			name: "Solution",
			value: value,
		})
		.setThumbnail(interaction.member.user.displayAvatarURL())

	return notFoundEmbed
}

module.exports = notFound
