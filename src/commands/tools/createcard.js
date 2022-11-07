const Discord = require("discord.js")
const Member = require("../../database/schemas/memberSchema")
const Hero = require("../../database/schemas/heroSchema")
const conflict = require("../../embeds/clientErrors/conflict")

module.exports = {
	data: new Discord.SlashCommandBuilder()
		.setName("createcard")
		.setDescription("Create a PredCard.")
		.addStringOption((option) => {
			return option.setName("addheroes").setDescription("Add up to six (6) Heroes you main to your PredCard.")
		})
		.addStringOption((option) => {
			return option.setName("setheroimage").setDescription("Set the Hero image that will be displayed on your PredCard.")
		}),
	async execute(interaction, client) {
		const addHeroesOption = interaction.options.getString("addheroes")
		const setHeroImageOption = interaction.options.getString("setheroimage")
		let findMemberById
		let issues = "None"
		let findHeroErrorMsg
		let findHeroImageErrorMsg

		try {
			findMemberById = (await Member.where("memberId").equals(interaction.member.user.id))[0]
		} catch {
			findMemberById = null
		}

		if (findMemberById != null && findMemberById?.memberId === interaction.member.user.id) {
			const conflictEmbed = conflict(interaction, client, Discord)

			await interaction.reply({
				embeds: [conflictEmbed],
			})
		} else {
			const member = await Member.create({
				memberId: interaction.member.user.id,
				memberName: interaction.member.user.tag,
			})

			if (addHeroesOption != null && addHeroesOption.length > 0) {
				const heroes = addHeroesOption.replaceAll(" ", "")
				const heroesSpaces = heroes.replace(/([a-z])([A-Z])/g, "$1 $2").split(",")

				for (const hero of heroesSpaces) {
					try {
						const heroQuery = (await Hero.where("heroName").equals(hero))[0]

						if (member.memberMains.indexOf(heroQuery._id) === -1 && member.memberMains.length < 6) {
							member.memberMains.push(heroQuery._id)
						}
					} catch {
						if (findHeroErrorMsg == null) {
							findHeroErrorMsg = ` The following Hero(es) were either not found or do not exist:\n\n- ${hero}`
						} else {
							findHeroErrorMsg += `\n- ${hero}`
						}
					}
				}

				await member.save()
			}

			if (findHeroErrorMsg != null) {
				issues = findHeroErrorMsg
			}

			if (setHeroImageOption != null && setHeroImageOption.length > 0) {
				const removeExcessSpaces = setHeroImageOption.replaceAll(" ", "")
				const heroTitleCase = removeExcessSpaces.replace(/([a-z])([A-Z])/g, "$1 $2")

				try {
					const heroQuery = (await Hero.where("heroName").equals(heroTitleCase))[0]

					member.memberImage = heroQuery.heroPortrait
				} catch {
					findHeroImageErrorMsg = "Could not set Hero Image either because the Hero was not found or does not exist"
				}

				await member.save()
			}

			if (findHeroImageErrorMsg != null) {
				if (findHeroErrorMsg == null) {
					issues = findHeroImageErrorMsg
				} else {
					issues = `\n\n${findHeroImageErrorMsg}`
				}
			}

			const cardCreateEmbed = new Discord.EmbedBuilder()
				.setColor(client.successColor)
				.setTitle("PredCard Created")
				.setDescription(`PredCard for ${interaction.member.user.tag} created successfully.`)
				.addFields({
					name: "Issues",
					value: issues,
				})
				.setThumbnail(interaction.member.user.displayAvatarURL())

			await interaction.reply({
				embeds: [cardCreateEmbed],
			})
		}
	},
}
