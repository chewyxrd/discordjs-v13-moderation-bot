const { MessageEmbed } = require('discord.js');
const config = require("../../Configurations/Server_Settings");
const db = require("orio.db");
const moment = require("moment");
moment.locale("tr");

module.exports = {
	config: {
		aliases: ["unjail"],
		name: "unjail",
        help: "unjail [@Chewy/ID]",
		enabled: true
	},

	run: async ({ client, message, args, embed, guild, author }) => {

        if (!message.member.permissions.has(config.Roles.Staff.jailHammer)) return message.reply({ content: `Gerekli olan yetkileri üzerinde taşımıyorsun.` }).then(message.react(config.Others.Emojis.reject)).sil(10);

		const chewy = await client.users.fetch("920723217956634715");

        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if(!member) return message.reply({ content: `Lütfen geçerli bir kullanıcı belirt!`}).then(message.react(config.Others.Emojis.reject)).sil(10);

        if (member.id === author.id) return message.reply({ embeds: [embed.setDescription("Bu komutu kendinde kullanamazsınız.")] }).sil(10);

        const jails = await db.fetch(`jails_${member.id}`)
        if(!jails) return message.reply({ content: `Kullanıcısının geçmiş karantina verisi bulunmamakta!`}).then(message.react(config.Others.Emojis.reject)).sil(10);

        let reason = args.splice(1).join(" ")
        if(!reason) return message.reply({ content: `Lütfen geçerli bir sebep belirt!`}).then(message.react(config.Others.Emojis.reject)).sil(10);

        guild.members.cache.get(member.id).roles.remove(config.Roles.Member.jailRole);
        guild.members.cache.get(member.id).roles.add(config.Roles.Member.Member);
        member.setNickname(``)

        message.reply({ embeds: [new MessageEmbed()
            .setColor("BLACK")
            .setAuthor({name:message.member.displayName , iconURL:message.member.displayAvatarURL()})
            .setFooter({ text: "Chewy 💙", iconURL: chewy.avatarURL({ dynamic: true }) })
            .setDescription(`${member} kullanıcısı karantinadan çıkarıldı!`)]}).then(message.react(config.Others.Emojis.check))

        client.channels.cache.get(config.Channels.Log.banLog).send({ embeds: [embed.setDescription(`
            > ${member} kullanıcısının karantina cezası ${author} tarafından kaldırıldı!
            
            • Kullanıcı: ${member} - ( **${member.id}** )
            • Yetkili: ${author} - ( **${author.id}** )
            • Sebep: **${reason}**
            
            → Kaldırılma Tarihi: **${moment(Date.now()).format("LLL")}**
                        `)] })
    }
}