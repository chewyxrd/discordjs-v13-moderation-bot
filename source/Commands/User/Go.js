const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const config = require("../../Configurations/Server_Settings");

module.exports = {
    config: {
        aliases: ["git", "go"],
        name: "Git",
        help: "go [@Chewy/ID]",
        enabled: true
    },

    run: async ({ client, message, args, embed, guild, author }) => {       

        if (!message.member.permissions.has(config.Roles.Staff.transporter)) return message.reply({ content: `Gerekli olan yetkileri üzerinde taşımıyorsun.` }).then(message.react(config.Others.Emojis.reject)).sil(10);
        
        const chewy = await client.users.fetch("920723217956634715");

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!message.member.voice.channel) return message.reply({ content: `Bir sesli kanala bağlı değilsin.` }).then(message.react(config.Others.Emojis.reject)).sil(10)
        if (!member) return message.reply({ content: `Bir kullanıcı belirt. \`.git [@Chewy/ID]\`` }).then(message.react(config.Others.Emojis.reject)).sil(3)
        if (member.id === client.user.id) return message.reply({ content: `Bu kullanıcıya kanala katılma isteği gönderemezsin.` }).then(message.react(config.Others.Emojis.reject)).sil(10)
        if (member.id === message.author.id)return message.reply({ content: `Kendi üzerinde bu işlemi uygulayamazsın.` }).then(message.react(config.Others.Emojis.reject)).sil(10)
        if (!member.voice.channel) return message.reply({ content: `Belirtilen **${member.user.tag}** kullanıcısı bir sesli kanala bağlı değil.` }).then(message.react(config.Others.Emojis.reject)).sil(10)
        if (message.member.voice.channel.id === member.voice.channel.id) return message.reply({ content: `Belirtilen **${member.user.tag}** kullanıcısıyla aynı ses kanalındasınız.` }).then(message.react(config.Others.Emojis.reject)).sil(10)

        let row = new MessageActionRow()
        .addComponents(new MessageButton()
        .setStyle("SECONDARY")
        .setLabel("Kabul Et")
        .setCustomId("kabul")
        )
        .addComponents(new MessageButton()
        .setStyle("SECONDARY")
        .setLabel("Reddet")
        .setCustomId("red")
        )

        const request = new MessageEmbed()
        .setColor("BLUE")
        .setAuthor({name:message.member.displayName , iconURL:message.member.displayAvatarURL()})
        .setFooter({ text: "Chewy 💙", iconURL: chewy.avatarURL({ dynamic: true }) })
        .setDescription(`${message.author} kullanıcısı bulunduğun kanala ( <#${member.voice.channel.id}> ) gelmek istiyor.`)

        let msg = await message.reply({ content: `${member}`, embeds: [request], components: [row] })
        var filter = (interaction) => interaction.member.id === member.user.id
        const collector = msg.createMessageComponentCollector({ filter, time: 30000 });

        collector.on("collect", async (interaction) => {
            if (interaction.member.id !== member.user.id) return interaction.reply({ content: `Başka bir kullanıcıya ait etkileşimi kullanamazsın.`})
            if (interaction.customId === "kabul") {
                message.member.voice.setChannel(member.voice.channel);
                interaction.reply({ content: `${message.member} kullanıcısı bulunduğun <#${member.voice.channel.id}> kanalına taşındı.`}).then(+ setTimeout(() => msg.delete(), 2000), message.delete())
          
            } else if (interaction.customId === "red") {
                if (interaction.member.id !== member.user.id) return interaction.reply({ content: `Başka bir kullanıcıya ait etkileşimi kullanamazsın.`})
                interaction.reply({ content: `${message.member} kullanıcısının <#${member.voice.channel.id}> kanalına gelme isteği reddedildi.`}).then(+ setTimeout(() => msg.delete(), 2000), message.delete())
            
            }
        })
}};