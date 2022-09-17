const { MessageEmbed } = require('discord.js');
const config = require("../../Configurations/Server_Settings");
const db = require("orio.db");
const moment = require("moment");
moment.locale("tr");

module.exports = {
	config: {
		aliases: ["jail", "karantina"],
		name: "jail",
        help: "jail [@Chewy/ID]",
		enabled: true
	},

	run: async ({ client, message, args, embed, guild, author }) => {

        if (!message.member.permissions.has(config.Roles.Staff.jailHammer)) return message.reply({ content: `Gerekli olan yetkileri üzerinde taşımıyorsun.` }).then(message.react(config.Others.Emojis.reject)).sil(10);

		const chewy = await client.users.fetch("920723217956634715");

        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if(!member) return message.reply({ content: `Lütfen geçerli bir kullanıcı belirt!`}).then(message.react(config.Others.Emojis.reject)).sil(10);

        if (member.id === author.id) return message.reply({ embeds: [embed.setDescription("Bu komutu kendinde kullanamazsınız.")] }).sil(10);

        if (member.roles.cache.get(config.Roles.Member.jailRole)) return message.reply({ embeds: [embed.setDescription(`Kullanıcının devam eden karantina cezası var!`)] }).then(message.react(config.Others.Emojis.reject)).sil(10);

        let reason = args.splice(1).join(" ")
        if(!reason) return message.reply({ content: `Lütfen geçerli bir sebep belirt!`}).then(message.react(config.Others.Emojis.reject)).sil(10);

        if (!message.member.permissions.has("ADMINISTRATOR") && member && member.roles.highest.position >= message.member.roles.highest.position) return message.reply({ content: `Kendinle aynı yetkide veya üstte birine bu komutu kullanamazsın!`}).then(message.react(config.Others.Emojis.reject)).sil(10);

        db.set(`roles.${member.id}`, member.roles.cache.map(x => x.id))
        db.set(`isim.${member.id}`, member.displayName)
        member.setNickname(`[CEZALI] ${member.displayName}`)
        member.roles.set([config.Roles.Member.jailRole])

        message.reply({ embeds: [new MessageEmbed()
            .setColor("BLACK")
            .setAuthor({name:message.member.displayName , iconURL:message.member.displayAvatarURL()})
            .setFooter({ text: "Chewy 💙", iconURL: chewy.avatarURL({ dynamic: true }) })
            .setDescription(`
${member} kullanıcısı, **${reason}** sebebiyle karantinaya atıldı!
            `)
            ] }).then(message.react(config.Others.Emojis.check))

            member.roles.add(config.Roles.Member.jailRole)
            db.add(`cezaıd_${guild.id}`, 1)

            client.channels.cache.get(config.Channels.Log.muteLog).send({ embeds: [embed.setDescription(`
            > ${member} kullanıcısı ${message.author} tarafından karantinaya atıldı.

            • Kullanıcı: ${member} - ( **${member.id}** )
            • Yetkili: ${author} - ( **${author.id}** )
            • Sebep: **${reason}**
            • Ceza ID: **#${db.fetch(`cezaıd_${guild.id}`)}**
            
            → Karantinaya Atılma Tarihi: **${moment(Date.now()).format("LLL")}**
            `)] });

            db.push(`sicil_${member.id}`, `${author} tarafından **${moment(Date.now()).format("LLL")}** tarihinde **${reason}** sebebiyle **[ KARANTİNA ]** cezası almış.`)
            db.push(`jails_${member.id}`, `${author} tarafından **${moment(Date.now()).format("LLL")}** tarihinde **${reason}** sebebiyle **[ KARANTİNA ]** cezası almış.`)
            db.add(`points_${member}`, config.Others.Points.Jail)
            db.add(`jail_${member.id}`, 1)
            db.add(`cezaıd_${guild.id}`, 1)

            const cezaID = await db.fetch(`cezaıd_${guild.id}`)
            db.set(`${cezaID}`, `${author} tarafından **${moment(Date.now()).format("LLL")}** tarihinde **${reason}** sebebiyle **[ KARANTİNA ]** cezası almış.`)
    }
}