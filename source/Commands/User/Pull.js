const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const config = require("../../Configurations/Server_Settings");

module.exports = {
    config: {
        aliases: ["çek", "pull"],
        name: "Çek",
        help: "pull [@Chewy/ID]",
        enabled: true
    },

    run: async ({ client, message, args, embed, guild, author }) => {

        if (!message.member.permissions.has(config.Roles.Staff.transporter)) return message.reply({ content: `Gerekli olan yetkileri üzerinde taşımıyorsun.` }).then(message.react(config.Others.Emojis.reject)).sil(10);
      
        const chewy = await client.users.fetch("920723217956634715");

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!message.member.voice.channel) return message.reply({ content: `İlk önce bir ses kanalına bağlan.` }).then(message.react(config.Others.Emojis.reject)).sil(10);
        if (!member) return message.reply({ content: `Bir kullanıcı belirt. \`.çek [@Chewy/ID]\`` }).then(message.react(config.Others.Emojis.reject)).sil(10);
        if (message.member.roles.highest.rawPosition < member.roles.highest.rawPosition) return message.reply({ content: `Bu kullanıcıya kanalına çekemezsin.` }).then(message.react(config.Others.Emojis.reject)).sil(10);
        if (member.id === client.user.id) return message.reply({ content: `Bu kullanıcıya kanalına çekemezsin.` }).then(message.react(config.Others.Emojis.reject)).sil(10);
        if (member.id === message.author.id)return message.reply({ content: `Kendi üzerinde bu işlemi uygulayamazsın.` }).then(message.react(config.Others.Emojis.reject)).sil(10);
        if (!member.voice.channel) return message.reply({ content: `Belirtilen **${member.user.tag}** kullanıcısı bir sesli kanala bağlı değil.` }).then(message.react(config.Others.Emojis.reject)).sil(10);
        if (message.member.voice.channel.id === member.voice.channel.id) return message.reply({ content: `Belirtilen **${member.user.tag}** kullanıcısıyla zaten aynı ses kanalındasınız.` }).then(message.react(config.Others.Emojis.reject)).sil(10);

        let comps = new MessageActionRow()
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
        .setDescription(`${message.author} kullanıcısı seni bulunduğu kanala ( <#${message.member.voice.channel.id}> ) çekmek istiyor.`)

        let res = await message.reply({ content: `${member}`, embeds: [request], components: [comps] })
        var filter = (interaction) => interaction.member.id === member.user.id
        const collector = res.createMessageComponentCollector({ filter, time: 30000 });

        collector.on("collect", async (interaction) => {
            if (interaction.customId ===  "kabul") {
                if (interaction.member.id !== member.user.id) return interaction.reply({ content: `Başka bir kullanıcıya ait etkileşimi kullanamazsın.`})

                message.guild.members.cache.get(member.id).voice.setChannel(message.member.voice.channel),
                interaction.reply({ content: `<#${message.member.voice.channel.id}> kanalına taşındın.`}).then(+ setTimeout(() => res.delete(), 2000), message.delete())
           
            } else if (interaction.customId === "red") {
                if (interaction.member.id !== member.user.id) return interaction.reply({ content: `Başka bir kullanıcıya ait etkileşimi kullanamazsın.`})

                interaction.reply({ content: `<#${message.member.voice.channel.id}> kanalına gelme teklifini reddettin.`}).then(+ setTimeout(() => res.delete(), 2000), message.delete())
            }
        })
}};