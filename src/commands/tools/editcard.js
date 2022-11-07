const Discord = require("discord.js")
const Member = require("../../database/schemas/memberSchema")
const Hero = require("../../database/schemas/heroSchema")
const badRequest = require("../../embeds/clientErrors/badRequest")
const notFound = require("../../embeds/clientErrors/notFound")

module.exports = {
	data: new Discord.SlashCommandBuilder()
		.setName("editcard")
		.setDescription("Edit your PredCard.")
		.addStringOption((option) => {
			return option.setName("addheroes").setDescription("Add up to six (6) Heroes you main to your PredCard.")
		})
		.addStringOption((option) => {
			return option.setName("removeheroes").setDescription("Remove Heroes you do not main from your PredCard.")
		})
		.addStringOption((option) => {
			return option.setName("setheroimage").setDescription("Set the Hero image that will be displayed on your PredCard.")
		}),
	async execute(interaction, client) {
		const addHeroesOption = interaction.options.getString("addheroes")
		const removeHeroesOption = interaction.options.getString("removeheroes")
		const setHeroImageOption = interaction.options.getString("setheroimage")
		let findMemberById
		let addHeroMsg = "None"
		let removeHeroMsg = "None"
		let setHeroImageMsg = "None"
		let findHeroErrorMsg = "None"
		let findHeroImageErrorMsg = "None"

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
			if (addHeroesOption == null && removeHeroesOption == null && setHeroImageOption == null) {
				const value = `${interaction.member.user.tag} must choose to add hero(es), remove hero(es), or set a hero image.`
				const badRequestEmbed = badRequest(interaction, client, Discord, value)

				await interaction.reply({
					embeds: [badRequestEmbed],
				})
			} else {
				const member = findMemberById

				if (addHeroesOption != null && addHeroesOption.length > 0) {
					const heroes = addHeroesOption.replaceAll(" ", "")
					const heroesSpaces = heroes.replace(/([a-z])([A-Z])/g, "$1 $2").split(",")

					for (const hero of heroesSpaces) {
						try {
							const heroQuery = (await Hero.where("heroName").equals(hero))[0]

							if (member.memberMains.indexOf(heroQuery._id) === -1 && member.memberMains.length < 6) {
								member.memberMains.push(heroQuery._id)

								if (addHeroMsg === "None") {
									addHeroMsg = `+ ${hero}`
								} else {
									addHeroMsg += `\n+ ${hero}`
								}
							}
						} catch {
							if (findHeroErrorMsg === "None") {
								findHeroErrorMsg = `~ ${hero}`
							} else {
								findHeroErrorMsg += `\n~ ${hero}`
							}
						}
					}

					if (addHeroMsg !== "None") {
						await member.save()
					}
				}

				if (removeHeroesOption != null && removeHeroesOption.length > 0) {
					const heroes = removeHeroesOption.replaceAll(" ", "")
					const heroesSpaces = heroes.replace(/([a-z])([A-Z])/g, "$1 $2").split(",")

					for (const hero of heroesSpaces) {
						try {
							const heroQuery = (await Hero.where("heroName").equals(hero))[0]

							if (member.memberMains.indexOf(heroQuery._id) !== -1) {
								member.memberMains.splice(heroQuery._id, 1)

								if (removeHeroMsg === "None") {
									removeHeroMsg = `- ${hero}`
								} else {
									removeHeroMsg += `\n- ${hero}`
								}
							}
						} catch {
							if (findHeroErrorMsg === "None") {
								findHeroErrorMsg = `~ ${hero}`
							} else {
								findHeroErrorMsg += `\n~ ${hero}`
							}
						}
					}

					if (removeHeroMsg !== "None") {
						await member.save()
					}
				}

				if (setHeroImageOption != null && setHeroImageOption.length > 0) {
					const removeExcessSpaces = setHeroImageOption.replaceAll(" ", "")
					const heroTitleCase = removeExcessSpaces.replace(/([a-z])([A-Z])/g, "$1 $2")

					try {
						const heroQuery = (await Hero.where("heroName").equals(heroTitleCase))[0]

						member.memberImage = heroQuery.heroPortrait

						setHeroImageMsg = "Updated"
					} catch {
						findHeroImageErrorMsg = "Could not set Hero Image either because the Hero was not found or does not exist."
					}

					await member.save()
				}

				const editCardEmbed = new Discord.EmbedBuilder()
					.setColor(client.defaultColor)
					.setTitle("PredCard Editing Completed")
					.setDescription(`PredCard for ${interaction.member.user.tag} edited successfully.`)
					.addFields({
						name: "Added Hero(es):",
						value: `\`\`\`diff\n${addHeroMsg}\n\`\`\``,
					})
					.addFields({
						name: "Removed Hero(es):",
						value: `\`\`\`diff\n${removeHeroMsg}\n\`\`\``,
					})
					.addFields({
						name: "Hero Image",
						value: `\`\`\`\n${setHeroImageMsg}\n\`\`\``,
					})
					.addFields({
						name: "400 Bad Request:",
						value: `\`\`\`\nFind Hero(es):\n${findHeroErrorMsg}\n\nFind Hero Image:\n${findHeroImageErrorMsg}\n\`\`\``,
					})
					.setThumbnail(interaction.member.user.displayAvatarURL())

				await interaction.reply({
					embeds: [editCardEmbed],
				})
			}
		}
	},
}
