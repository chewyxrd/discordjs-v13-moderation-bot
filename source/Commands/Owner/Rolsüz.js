const { MessageEmbed } = require('discord.js');
const config = require("../../Configurations/Server_Settings");

module.exports = {
	config: {
		aliases: ["rolsüz"],
		name: "rolsüz",
        help: "rolsüz ver [@Chewy/ID]",
		enabled: true
	},

	run: async ({ client, message, args, embed, guild, author }) => {

        if (!message.member.permissions.has(config.Roles.Staff.botCommand)) return message.reply({ content: `Gerekli olan yetkileri üzerinde taşımıyorsun.` }).then(message.react(config.Others.Emojis.reject)).sil(10);

		const chewy = await client.users.fetch("920723217956634715");

        let chewyxd = message.guild.members.cache.filter(m => m.roles.cache.filter(r => r.id !== message.guild.id).size == 0)
        
        if (args[0] == "ver") {
            chewyxd.forEach(r => {
                r.roles.add(config.Roles.Member.Member)
            });

            message.reply({ embeds: [new MessageEmbed()
                .setColor("BLACK")
                .setAuthor({name:message.member.displayName , iconURL:message.member.displayAvatarURL()})
                .setFooter({ text: "Chewy 💙", iconURL: chewy.avatarURL({ dynamic: true }) })
                .setDescription("Sunucuda rolü olmayan **"+ chewyxd.size +"** kişiye <@&MEMBERROLID> rolü verildi.")] })

        } else if (!args[0]) {
                        message.reply({ embeds: [new MessageEmbed()
                .setColor("BLUE")
                .setAuthor({name:message.member.displayName , iconURL:message.member.displayAvatarURL()})
                .setFooter({ text: "Chewy 💙", iconURL: chewy.avatarURL({ dynamic: true }) })
                .setDescription("Sunucumuzda rolü olmayan **"+ chewyxd.size +"** kişi var.")] })
        }
    }
}