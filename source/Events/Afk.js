const { MessageEmbed, Message } = require("discord.js");
const db = require('orio.db');

/**
 * 
 * @param {Message} message 
 * @returns 
 */

module.exports = async message => {
    
    const chewy = await client.users.fetch("920723217956634715");

    if(message.author.bot || !message.guild) return;
    let memberData = await db.fetch(`member_${message.member.id}_${message.guild.id}`) 
    let embed = new MessageEmbed().setAuthor({ name: message.member.displayName, iconURL: message.member.displayAvatarURL({ dynamic: true }) }).setFooter({ text: "Chewy 💙", iconURL: chewy.avatarURL({ dynamic: true }) });

    if (memberData) {
        let reasonData = await db.fetch(`reason_${message.member.id}_${message.guild.id}`);
        if(message.member.displayName.includes("[AFK]") && message.member.manageable) await message.member.setNickname(message.member.displayName.replace("[AFK]", ""));
        message.reply({ embeds: [embed.setDescription(`Afk modundan çıkış yaptın.
Afk olma sebebin: **${reasonData}**`)] })
        db.delete(`reason_${message.author.id}_${message.guild.id}`)
        db.delete(`member_${message.member.id}_${message.guild.id}`, message.member.id);
        db.delete(`nick_${message.author.id}_${message.guild.id}`)
     }

     const member = message.mentions.members.first();
     if (!member) return;

     const afkData = await db.fetch(`member_${member.user.id}_${message.guild.id}`);
     if (!afkData) return;
const afkReason = await db.fetch(`reason_${member.user.id}_${message.guild.id}`);
    message.channel.send({ embeds: [embed.setDescription(`${member.toString()} kullanıcısı afk modunda!
Afk olma sebebi: **${afkReason}**`)] })
};

module.exports.config = {
    name: "messageCreate"
}
