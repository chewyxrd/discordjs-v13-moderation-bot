const { MessageEmbed } = require('discord.js');
const Settings = require('../../Configurations/Client_Settings');

module.exports = {
	config: {
		aliases: ["help", "y", "h"],
		name: "yardım",
		enabled: true,
		cooldown:5000
	},

	run: async ({ client, message, args, embed, guild, author }) => {

	const chewy = await client.users.fetch("920723217956634715");

const list = client.commands
		.filter((x) => x.config.help)
		.sort((a, b) => b.config.help - a.config.help)
		.map((x) => `\`${Settings.prefix}${x.config.help}\``)
		.join("\n");

		message.reply({ embeds: [new MessageEmbed()
.setColor("BLACK")
.setAuthor({name:message.member.displayName , iconURL:message.member.displayAvatarURL()})
.setFooter({ text: "Chewy 💙", iconURL: chewy.avatarURL({ dynamic: true }) })
.setDescription(`
Botta toplamda \`${client.commands.size}\` komut bulunmakta;

${list}
`)
] })
}};