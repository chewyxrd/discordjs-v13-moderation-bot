const config = require("../../Configurations/Server_Settings.js");
const { MessageEmbed } = require("discord.js");

module.exports = {
    config: {
	aliases: ["where", "nerede"],
	name: "where",
	help: "where [@Chewy/ID]",
	enabled: true
	},

	run: async ({ client, message, args, embed, guild, author }) => {

        if (!message.member.permissions.has(config.Roles.Staff.botCommand)) return message.reply({ content: `Gerekli olan yetkileri üzerinde taşımıyorsun.` }).then(message.react(config.Others.Emojis.reject)).sil(10);

let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
if(!member) return message.reply({ content: `Lütfen geçerli bir kullanıcı belirt!`}).then(message.react(config.Others.Emojis.reject)).sil(10);

let kanal = member.voice.channel
if(!kanal) return message.reply({ embeds: [embed.setDescription(`${member} kullanıcısı herhangi bir sesli kanalda bulunmuyor.`)] }).then(message.react(config.Others.Emojis.reject)).sil(10);

let mic = member.voice.selfMute ? "kapalı" : "açık";
let kulak = member.voice.selfDeaf ? "kapalı" : "açık";

kanal.createInvite().then(chewy =>
    message.reply({ embeds: [embed.setDescription(`${member} kullanıcısı **${kanal.name}** kanalında bulunmakta.

Mikrofon Durumu: **${mic}**
Kulaklık Durumu: **${kulak}**`)] }));
}};