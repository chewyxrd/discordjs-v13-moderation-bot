const { MessageEmbed } = require('discord.js');

module.exports = {
	config: {
		aliases: ["ping"],
		name: "ping",
        help: "ping",
		enabled: true
	},

	run: async ({ client, message, args, embed, guild, author }) => {

		const chewy = await client.users.fetch("920723217956634715");

		message.reply({ embeds: [new MessageEmbed()
.setColor("RANDOM")
.setAuthor({name:message.member.displayName , iconURL:message.member.displayAvatarURL()})
.setFooter({ text: "Chewy 💙", iconURL: chewy.avatarURL({ dynamic: true }) })
.setDescription(`
**${client.ws.ping}ms**
`)
] })
}};