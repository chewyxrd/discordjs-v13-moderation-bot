const { MessageEmbed } = require('discord.js');
const config = require("../../Configurations/Server_Settings");

module.exports = {
	config: {
		aliases: ["tag"],
		name: "tag",
        help: "tag",
		enabled: true
	},

	run: async ({ client, message, args, embed, guild, author }) => {

		const chewy = await client.users.fetch("920723217956634715");

		message.reply({ embeds: [new MessageEmbed()
.setColor("BLUE")
.setAuthor({name:message.member.displayName , iconURL:message.member.displayAvatarURL()})
.setFooter({ text: "Chewy 💙", iconURL: chewy.avatarURL({ dynamic: true }) })
.setDescription(`
${config.Tag.Tag.GuildTag}
`)
] })
}};