const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const config =  require("../../Configurations/Server_Settings");

module.exports = {
    config: {
		aliases: ["kilit", "lock"],
		name: "Kilit",
		help: "lock",
		enabled: true
	},

	run: async ({ client, message, args, embed, guild, author }) => {

        if (!message.member.permissions.has(config.Roles.Staff.botCommand)) return message.reply({ content: `Gerekli olan yetkileri üzerinde taşımıyorsun.` }).then(message.react(config.Others.Emojis.reject)).sil(10);

        const chewy = await client.users.fetch("920723217956634715");

        const row = new MessageActionRow()
        .addComponents(new MessageButton()
        .setStyle("SECONDARY")
        .setLabel("Kanal Kilit")
        .setCustomId("channel_lock")
        )
        .addComponents(new MessageButton()
        .setStyle("SECONDARY")
        .setLabel("İptal Et")
        .setCustomId("iptal")
        )

        const response = new MessageEmbed()
.setColor("BLACK")
.setAuthor({name:message.member.displayName , iconURL:message.member.displayAvatarURL()})
.setFooter({ text: "Chewy 💙", iconURL: chewy.avatarURL({ dynamic: true }) })
        .setDescription(`
\`\`\`fix
- Bulunduğun kanalın kilit durumu: ${message.channel.permissionsFor(message.guild.id).has("SEND_MESSAGES") ? "Açık" : "Kapalı"}
\`\`\`
`)

    let res = await message.reply({ embeds: [response], components: [row] })
    var filter = (interaction) => interaction.member.id === message.author.id;
    const collector = res.createMessageComponentCollector({ filter, time: 15000 })

    collector.on("collect", async (interaction) => {
        if (interaction.customId === "channel_lock") {
            if (interaction.member.id !== message.author.id) return interaction.reply({ content: `Başka bir kullanıcıya ait etkileşimi kullanamazsın.`, ephemeral: true })
            if (message.channel.permissionsFor(message.guild.id).has("SEND_MESSAGES")) {
                message.channel.permissionOverwrites.edit(message.guild.id, { SEND_MESSAGES: false })
                .then(async () => { await interaction.reply({ content: "Kanal kilitlendi."}) }).then(+ setTimeout(() => res.delete(), 2000), message.delete())
            } else {
                message.channel.permissionOverwrites.edit(message.guild.id, { SEND_MESSAGES: true })
                .then(async () => { await interaction.reply({ content: "Kanal kilidi açıldı."}) }).then(+ setTimeout(() => res.delete(), 2000), message.delete())
            }
        } else if (interaction.customId === "iptal") {
            if (interaction.member.id !== message.author.id) return interaction.reply({ content: `Başka bir kullanıcıya ait etkileşimi kullanamazsın.`, ephemeral: true })

            interaction.reply({ content: "İşlem iptal edildi."}).then(+ setTimeout(() => res.delete(), 2000), message.delete())
        }
    })
}};