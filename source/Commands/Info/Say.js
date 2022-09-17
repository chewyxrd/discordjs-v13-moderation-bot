const { MessageEmbed } = require('discord.js');
const config = require("../../Configurations/Server_Settings");

module.exports = {
	config: {
		aliases: ["say"],
		name: "say",
        help: "say",
		enabled: true
	},

	run: async ({ client, message, args, embed, guild, author }) => {

        if (!message.member.permissions.has(config.Roles.Staff.botCommand)) return message.reply({ content: `Gerekli olan yetkileri üzerinde taşımıyorsun.` }).then(message.react(config.Others.Emojis.reject)).sil(10);

		const chewy = await client.users.fetch("920723217956634715");

        let aktif = message.guild.members.cache.filter(member => member.presence && (member.presence.status != "offline")).size
        let member = message.guild.memberCount
        var tag = message.guild.members.cache.filter(u => u.user.username.includes(config.Tag.Tag.GuildTag)).size;
        let sesli = message.guild.members.cache.filter(x => x.voice.channel).size
        let yetkili = message.guild.members.cache.filter(x => {
            return x.user.username.includes("XXXXXXXXXX") && x.voice.channel && x.roles.cache.has(config.Roles.Staff.botCommand)
        }).size
        let boost = message.guild.premiumSubscriptionCount;

        message.reply({ embeds: [new MessageEmbed()
            .setColor("BLACK")
            .setAuthor({name:message.member.displayName , iconURL:message.member.displayAvatarURL()})
            .setFooter({ text: "Chewy 💙", iconURL: chewy.avatarURL({ dynamic: true }) })
            .setDescription(`
\`\`\`fix
- Sunucuda ${member} kullanıcı bulunuyor. ( ${aktif} aktif. )
- Seste ${sesli} kullanıcı bulunuyor. ( ${yetkili} yetkili. )
- Sunucuda toplam ${tag} kişi tag alarak ailemize katılmış.
- Sunucuda ${boost} takviye bulunuyor.
\`\`\`
            `)
            ] })
}}