const { MessageEmbed } = require('discord.js');
const config = require("../../Configurations/Server_Settings");
const moment = require("moment")

module.exports = {
	config: {
		aliases: ["rol-ver"],
		name: "rol-ver",
        help: "rol-ver [@Chewy/ID]",
		enabled: true
	},

	run: async ({ client, message, args, embed, guild, author }) => {

        if (!message.member.permissions.has(config.Roles.Staff.botCommand)) return message.reply({ content: `Gerekli olan yetkileri üzerinde taşımıyorsun.` }).then(message.react(config.Others.Emojis.reject)).sil(10);

		const chewy = await client.users.fetch("920723217956634715");

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        const rol = message.mentions.roles.first() || message.guild.roles.cache.get(args[1])

        if(!member) return message.reply({ content: `Lütfen geçerli bir üye veya ID belirtin.` }).then(message.react(config.Others.Emojis.reject)).sil(10);
        if(!rol) return message.reply({ content: `Lütfen geçerli bir rol veya ID belirtin.` }).then(message.react(config.Others.Emojis.reject)).sil(10);

        member.roles.add(rol)

        message.reply({ embeds: [new MessageEmbed()
            .setColor("BLACK")
            .setAuthor({name:message.member.displayName , iconURL:message.member.displayAvatarURL()})
            .setFooter({ text: "Chewy 💙", iconURL: chewy.avatarURL({ dynamic: true }) })
            .setDescription(`
${member} isimli kullanıcıya, ${rol} isimli rol verildi!
            `)
            ] })
            .then(message.react(config.Others.Emojis.check)).sil(30);

            client.channels.cache.get(config.Channels.Log.rolLog).send({ embeds: [embed.setDescription(`
\`Rolü Verilen Kullanıcı:\` ${member} - **${member.id}**
\`Rol Veren Yetkili:\` ${message.author} - **${message.author.id}**
\`Verilen Rol:\` ${rol}
\`Rol Verilme Tarihi:\` **${moment(Date.now()).format("LLL")}**
`)] });
}};