const Discord = require("discord.js")
const Item = require("../../database/schemas/itemSchema")
const badRequest = require("../../embeds/clientErrors/badRequest")
const notFound = require("../../embeds/clientErrors/notFound")

module.exports = {
	data: new Discord.SlashCommandBuilder()
		.setName("searchitems")
		.setDescription("Search for items in Predecessor.")
		.addStringOption((option) => {
			return option.setName("item").setDescription("Search for an item based on its name.")
		}),
	async execute(interaction, client) {
		let itemOption = interaction.options.getString("item")
		let findItemByName

		if (itemOption != null) {
			itemOption = itemOption.trim()

			try {
				findItemByName = (await Item.where("itemName").equals(itemOption))[0]
			} catch {
				findItemByName = null
			}
		} else {
			findItemByName = null
		}

		if (findItemByName == null) {
			const description = `${itemOption} was not found.`
			const value = `${itemOption} may not have been found because it does not exist, or there was a typo.`
			const notFoundEmbed = notFound(interaction, client, Discord, description, value)

			await interaction.reply({
				embeds: [notFoundEmbed],
			})
		} else {
			if (itemOption == null) {
				const value = `${interaction.member.user.tag} must enter criteria for an item search.`
				const badRequestEmbed = badRequest(interaction, client, Discord, value)

				await interaction.reply({
					embeds: [badRequestEmbed],
				})
			} else {
				const item = findItemByName

				const searchItemEmbed = new Discord.EmbedBuilder()
					.setColor(client.successColor)
					.setTitle(`(In Development) ${item.itemName}`)
					.setDescription(`Rarity: ${item.itemRarity}\tCost: ${item.itemCost}\nDescription:\n${item.itemDescriptions}`)
					.addFields({
						name: "Tags",
						value: `${item.itemTags}`,
					})
				/*.addFields({
						name: "Components",
						value: `${item?.itemComponents}`,
					})
					.addFields({
						name: "Stats",
						value: `${item?.itemStats}`,
					})*/

				await interaction.reply({
					embeds: [searchItemEmbed],
				})
			}
		}
	},
}
