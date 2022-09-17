const { MessageEmbed } = require('discord.js');
const config = require("../../Configurations/Server_Settings");
const moment = require("moment")

module.exports = {
	config: {
		aliases: ["tasarımcı", "designer"],
		name: "designer",
        help: "designer [@Chewy/ID]",
		enabled: true
	},

	run: async ({ client, message, args, embed, guild, author}) => {

        if (!message.member.permissions.has(config.Roles.Staff.botCommand)) return message.reply({ content: `Gerekli olan yetkileri üzerinde taşımıyorsun.` }).then(message.react(config.Others.Emojis.reject)).sil(10);

		const chewy = await client.users.fetch("920723217956634715");

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0])

        if(!member) return message.reply({ content: `Lütfen geçerli bir üye veya ID belirtin.` }).then(message.react(config.Others.Emojis.reject)).sil(10);

        member.roles.add(config.Roles.Member.Designer)
        
        message.reply({ embeds: [new MessageEmbed()
            .setColor("BLACK")
            .setAuthor({name:message.member.displayName , iconURL:message.member.displayAvatarURL()})
            .setFooter({ text: "Chewy 💙", iconURL: chewy.avatarURL({ dynamic: true }) })
            .setDescription(`
${member} isimli kullanıcı sunucumuzun tasarımcı ekibine katıldı!
            `)
            ] })
            .then(message.react(config.Others.Emojis.check)).sil(30);

client.channels.cache.get(config.Channels.Log.rolLog).send({ embeds: [embed.setDescription(`
\`Rolü Verilen Kullanıcı:\` ${member} - **${member.id}**
\`Rol Veren Yetkili:\` ${message.author} - **${message.author.id}**
\`Verilen Rol:\` ${config.Roles.Member.Designer}
\`Rol Verilme Tarihi:\` **${moment(Date.now()).format("LLL")}**
`)] });
}};
