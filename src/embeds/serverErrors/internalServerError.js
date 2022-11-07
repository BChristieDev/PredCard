function internalServerError(interaction, client, Discord) {
	const internalServerErrorEmbed = new Discord.EmbedBuilder()
		.setColor(client.errorColor)
		.setTitle("500 Internal Server Error")
		.setDescription(`Something went wrong while executing /${interaction.commandName}.`)
		.setThumbnail(interaction.member.user.displayAvatarURL())

	return internalServerErrorEmbed
}

module.exports = internalServerError
