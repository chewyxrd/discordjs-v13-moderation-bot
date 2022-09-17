const settings = require("../Configurations/Client_Settings");
const { MessageEmbed } = require("discord.js");
const client = global.client;

/**
 * @param {Message} message
 * @returns {Promise<void>}
 */

module.exports = async (message) => {
    const prefix = settings.prefix.find((x) => message.content.toLowerCase().startsWith(x));
    if (message.author.bot || !message.guild || !prefix) return;
    let args = message.content.substring(prefix.length).trim().split(" ");
    let commandName = args[0].toLowerCase();

    const embed = new MessageEmbed()
    .setAuthor({ name: message.member.displayName, iconURL: message.member.displayAvatarURL({ dynamic: true }) })
    .setColor("9B59B6")

    const guild = message.guild
    const author = message.author

    args = args.splice(1);
    let cmd = client.commands.has(commandName) ? client.commands.get(commandName) : client.commands.get(client.aliases.get(commandName));
    if (!cmd || (cmd.config.owner && !settings.clientOwner.includes(message.author.id)) || !cmd.config.enabled) return;

    cmd.run({ client, message, args, embed, guild, author });
};

module.exports.config = {
    name: "messageCreate"
};