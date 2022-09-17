const config = require("../../Configurations/Server_Settings.js");
const { MessageEmbed } = require("discord.js");
const db = require("orio.db");

module.exports = {
    config: {
	aliases: ["sicil-clear", "sicil-temizle"],
	name: "sicil-clear",
	help: "sicil-clear [@Chewy/ID]",
	enabled: true
	},

	run: async ({ client, message, args, embed, guild, author }) => {

        if (!message.member.permissions.has(config.Roles.Staff.botCommand)) return message.reply({ content: `Gerekli olan yetkileri üzerinde taşımıyorsun.` }).then(message.react(config.Others.Emojis.reject)).sil(10);

        const chewy = await client.users.fetch("920723217956634715");

        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if(!member) return message.reply({ content: `Lütfen geçerli bir kullanıcı belirt!`}).then(message.react(config.Others.Emojis.reject)).sil(10);

        let sicil = db.delete(`sicil_${member.id}`) || [];

        message.reply({ embeds: [new MessageEmbed()
            .setColor("BLACK")
            .setAuthor({name:message.member.displayName , iconURL:message.member.displayAvatarURL()})
            .setFooter({ text: "Chewy 💙", iconURL: chewy.avatarURL({ dynamic: true }) })
            .setDescription(`${member} isimli kullanıcının sicil geçmişi temizlendi!
            `)
        ] 
        }
            )
        }
    }