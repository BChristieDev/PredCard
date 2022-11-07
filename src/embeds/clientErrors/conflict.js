function conflict(interaction, client, Discord) {
	const conflictEmbed = new Discord.EmbedBuilder()
		.setColor(client.errorColor)
		.setTitle("409 Conflict")
		.setDescription(`A PredCard for ${interaction.member.user.tag} has already been created.`)
		.setThumbnail(interaction.member.user.displayAvatarURL())

	return conflictEmbed
}

module.exports = conflict
