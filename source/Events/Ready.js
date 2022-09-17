const client = global.client;
const settings = require("../Configurations/Client_Settings.js");
const { joinVoiceChannel } = require("@discordjs/voice");

module.exports = async () => {
  client.user.setPresence({
    activities: [
        {
            name: settings.clientActivity,
            type: settings.activityType
        }
    ],
    status: "online"
});

const VoiceChannel = client.channels.cache.get(settings.voiceChannel);
joinVoiceChannel({
  channelId: VoiceChannel.id,
  guildId: VoiceChannel.guild.id,
  adapterCreator: VoiceChannel.guild.voiceAdapterCreator,
  selfDeaf: true,
  selfMute:true
}); 
};

module.exports.config = {
  name: "ready",
};
