const config = require("../../Configurations/Server_Settings.js");
const { MessageEmbed } = require("discord.js");
const db = require("orio.db");

module.exports = {
    config: {
	aliases: ["sicil"],
	name: "sicil",
	help: "sicil [@Chewy/ID]",
	enabled: true
	},

	run: async ({ client, message, args, embed, guild, author }) => {

        if (!message.member.permissions.has(config.Roles.Staff.jailHammer)) return message.reply({ content: `Gerekli olan yetkileri üzerinde taşımıyorsun.` }).then(message.react(config.Others.Emojis.reject)).sil(10);

        const chewy = await client.users.fetch("920723217956634715");

        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if(!member) return message.reply({ content: `Lütfen geçerli bir kullanıcı belirt!`}).then(message.react(config.Others.Emojis.reject)).sil(10);

        let sicil = db.get(`sicil_${member.user.id}`);
        if(!sicil) return message.reply({ content: `${member} kullanıcısının sicil geçmişi bulunmamakta!`}).then(message.react(config.Others.Emojis.reject)).sil(10);

        message.reply({ embeds: [new MessageEmbed()
            .setColor("BLACK")
            .setAuthor({name:message.member.displayName , iconURL:message.member.displayAvatarURL()})
            .setFooter({ text: "Chewy 💙", iconURL: chewy.avatarURL({ dynamic: true }) })
            .setDescription(sicil.map((data) => `${data}`).join("\n")
            )
        ] 
        }
            )
        }
    }