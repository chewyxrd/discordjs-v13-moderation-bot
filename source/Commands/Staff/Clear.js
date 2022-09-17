const config = require("../../Configurations/Server_Settings.js");

module.exports = {
    config: {
	aliases: ["sil", "temizle", "clear"],
	name: "Sil",
	help: "clear [1/100]",
	enabled: true
	},

	run: async ({ client, message, args, embed, guild, author }) => {

        if (!message.member.permissions.has(config.Roles.Staff.botCommand)) return message.reply({ content: `Gerekli olan yetkileri üzerinde taşımıyorsun.` }).then(message.react(config.Others.Emojis.reject)).sil(10);

        if (!args[0]) return message.reply({ content: `Lütfen mesaj miktarı belirt. [\`1/100\`]` }).then(message.react(config.Others.Emojis.reject)).sil(10);
        if(!args[0] || (args[0] && isNaN(args[0])) || Number(args[0]) < 1 || Number(args[0]) > 100) return message.reply({ content: `\`1-100\` arasında bir sayı belirtmen gerekiyor.` }).then(message.react(config.Others.Emojis.reject)).sil(10);
        
        await message.channel.bulkDelete(Number(args[0])).then(msg => message.channel.send({ content: `Başarıyla **${msg.size}** adet mesaj temizlendi. ` })).then(message.react(config.Others.Emojis.check)).sil(30);
}};
