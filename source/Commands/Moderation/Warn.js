const { MessageEmbed } = require('discord.js');
const config = require("../../Configurations/Server_Settings");
const db = require("orio.db");
const moment = require("moment");
moment.locale("tr");

module.exports = {
	config: {
		aliases: ["warn"],
		name: "warn",
        help: "warn [@Chewy/ID]",
		enabled: true
	},

	run: async ({ client, message, args, embed, guild, author }) => {

        if (!message.member.permissions.has(config.Roles.Staff.warnHammer)) return message.reply({ content: `Gerekli olan yetkileri üzerinde taşımıyorsun.` }).then(message.react(config.Others.Emojis.reject)).sil(10);

		const chewy = await client.users.fetch("920723217956634715");

        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if(!member) return message.reply({ content: `Lütfen geçerli bir kullanıcı belirt!`}).then(message.react(config.Others.Emojis.reject)).sil(10);

        if (member.id === author.id) return message.reply({ embeds: [embed.setDescription("Bu komutu kendinde kullanamazsınız.")] }).sil(10);

        let reason = args.splice(1).join(" ")
        if(!reason) return message.reply({ content: `Lütfen geçerli bir sebep belirt!`}).then(message.react(config.Others.Emojis.reject)).sil(10);

        if (!message.member.permissions.has("ADMINISTRATOR") && member && member.roles.highest.position >= message.member.roles.highest.position) return message.reply({ content: `Kendinle aynı yetkide veya üstte birine bu komutu kullanamazsın!`}).then(message.react(config.Others.Emojis.reject)).sil(10);

        db.push(`warns_${member.id}`, `${author} tarafından **${moment(Date.now()).format("LLL")}** tarihinde **${reason}** sebebiyle **[ UYARI ]** cezası almış.`)
        db.push(`sicil_${member.id}`, `${author} tarafından **${moment(Date.now()).format("LLL")}** tarihinde **${reason}** sebebiyle **[ UYARI ]** cezası almış.`)
        db.add(`warn_${member.id}`, 1)
        db.add(`author_${author.id}`, 1)
        db.add(`cezaıd_${guild.id}`, 1)
        db.add(`points_${member}`, config.Others.Points.Warn);
        const cezaID = await db.fetch(`ceza_${guild.id}`)
        db.set(`${cezaID}`, `${author} tarafından ${moment(Date.now()).format("LLL")} tarihinde ${reason} sebebiyle **[ UYARI ]** cezası almış.`)

        message.reply({ embeds: [new MessageEmbed()
            .setColor("BLACK")
            .setAuthor({name:message.member.displayName , iconURL:message.member.displayAvatarURL()})
            .setFooter({ text: "Chewy 💙", iconURL: chewy.avatarURL({ dynamic: true }) })
            .setDescription(`
${member} kullanıcısı, **${reason}** sebebiyle uyarıldı!
            `)
            ] }).then(message.react(config.Others.Emojis.check))

            client.channels.cache.get(config.Channels.Log.warnLog).send({ embeds: [embed.setDescription(`
            > ${member} kullanıcısı ${message.author} tarafından uyarıldı.

            • Kullanıcı: ${member} - ( **${member.id}** )
            • Yetkili: ${author} - ( **${author.id}** )
            • Sebep: **${reason}**
            • Ceza ID: **#${db.fetch(`cezaıd_${guild.id}`)}**

            → Uyarılma Tarihi: **${moment(Date.now()).format("LLL")}**
            `)] });
    }
}