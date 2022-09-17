const { MessageEmbed } = require('discord.js');
const config = require("../../Configurations/Server_Settings");
const db = require("orio.db");
const moment = require("moment");
moment.locale("tr");
const ms = require("ms")

module.exports = {
	config: {
		aliases: ["mute", "sustur"],
		name: "mute",
        help: "mute [@Chewy/ID]",
		enabled: true
	},

	run: async ({ client, message, args, embed, guild, author }) => {

        if (!message.member.permissions.has(config.Roles.Staff.muteHammer)) return message.reply({ content: `Gerekli olan yetkileri üzerinde taşımıyorsun.` }).then(message.react(config.Others.Emojis.reject)).sil(10);

		const chewy = await client.users.fetch("920723217956634715");

        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if(!member) return message.reply({ content: `Lütfen geçerli bir kullanıcı belirt!`}).then(message.react(config.Others.Emojis.reject)).sil(10);

        if (member.id === author.id) return message.reply({ embeds: [embed.setDescription("Bu komutu kendinde kullanamazsınız.")] }).sil(10);

        if (member.roles.cache.get(config.Roles.Member.MutedRole)) return message.reply({ embeds: [embed.setDescription(`Kullanıcının devam eden susturma cezası var!`)] }).then(message.react(config.Others.Emojis.reject)).sil(10);
        
        let time = args[1]
        if(!time) return message.reply({ content: `Lütfen geçerli bir süre belirt!`}).then(message.react(config.Others.Emojis.reject)).sil(10);

        let reason = args.splice(1).join(" ")
        if(!reason) return message.reply({ content: `Lütfen geçerli bir sebep belirt!`}).then(message.react(config.Others.Emojis.reject)).sil(10);

        time
        .replace("s", " Saniye")
        .replace("m", " Dakika")
        .replace("h", " Saat")
        .replace("d", " Gün")
        .replace("w", "Hafta")

        if (!message.member.permissions.has("ADMINISTRATOR") && member && member.roles.highest.position >= message.member.roles.highest.position) return message.reply({ content: `Kendinle aynı yetkide veya üstte birine bu komutu kullanamazsın!`}).then(message.react(config.Others.Emojis.reject)).sil(10);

        message.reply({ embeds: [new MessageEmbed()
            .setColor("BLACK")
            .setAuthor({name:message.member.displayName , iconURL:message.member.displayAvatarURL()})
            .setFooter({ text: "Chewy 💙", iconURL: chewy.avatarURL({ dynamic: true }) })
            .setDescription(`
${member} kullanıcısı, **${reason}** sebebiyle susturuldu!
            `)
            ] }).then(message.react(config.Others.Emojis.check))

            member.roles.add(config.Roles.Member.MutedRole)
            db.add(`cezaıd_${guild.id}`, 1)

            client.channels.cache.get(config.Channels.Log.muteLog).send({ embeds: [embed.setDescription(`
            > ${member} kullanıcısı ${message.author} tarafından susturuldu.

            • Kullanıcı: ${member} - ( **${member.id}** )
            • Yetkili: ${author} - ( **${author.id}** )
            • Sebep: **${reason}**
            • Ceza ID: **#${db.fetch(`cezaıd_${guild.id}`)}**

            → Susturulma Tarihi: **${moment(Date.now()).format("LLL")}**
            `)] });

            db.push(`sicil_${member.id}`, `${author} tarafından **${moment(Date.now()).format("LLL")}** tarihinde **${reason}** sebebiyle **[ SUSTURMA ]** cezası almış.`)
            db.add(`points_${member}`, config.Others.Points.Mute)
            db.add(`mute_${member.id}`, 1)
            db.add(`cezaıd_${guild.id}`, 1)
            db.set(`mute_${member.id}`, true);

            const cezaID = await db.fetch(`cezaıd_${guild.id}`)
            db.set(`${cezaID}`, `${author} tarafından **${moment(Date.now()).format("LLL")}** tarihinde **${reason}** sebebiyle **[ SUSTURMA ]** cezası almış.`)

            setTimeout(() => {
                if (db.get(`mute_${member.id}`)) {
                member.roles.remove(config.Roles.Member.MutedRole)
                client.channels.cache.get(config.Channels.Log.muteLog).send({ embeds: [embed.setDescription(`
${member} Kullanıcısının susturma süresi bittiği için <@&${config.Roles.Member.MutedRole}> rolü alındı!
                `)] })
                }
              }, ms(time))
    }
}