const { MessageEmbed } = require('discord.js');
const db = require("orio.db");

module.exports = {
    config: {
        aliases: ["afk"],
        name: "afk",
        help: "afk <sebep>",
        enabled: true
    },

    run: async ({ client, message, args, embed, guild, author }) => {

        const chewy = await client.users.fetch("920723217956634715");

        if (message.member.displayName.startsWith("[AFK]")) return;

        let reason = args.slice(0).join(' ') || "Biraz dinlenmeye ihtiyacım var.";
        let nick = message.member.displayName;

        db.set(`reason_${message.member.id}_${message.guild.id}`, reason);
        db.set(`member_${message.member.id}_${message.guild.id}`, message.member.id);
        db.set(`nick_${message.member.id}_${message.guild.id}`, nick);

        let reasons = db.fetch(`reason_${message.member.id}_${message.guild.id}`);

        message.member.setNickname(`[AFK] ` + nick).catch(err => console.log(" "))

        message.reply({ embeds: [new MessageEmbed()
            .setColor("RANDOM")
            .setAuthor({name:message.member.displayName , iconURL:message.member.displayAvatarURL()})
            .setFooter({ text: "Chewy 💙", iconURL: chewy.avatarURL({ dynamic: true }) })
            .setDescription(`
**Afk** moduna giriş yaptın!
Sebep: **${reasons}**
            `)
            ] })
}};
