const { Client, Collection } = require('discord.js');
const client = (global.client = new Client({ intents: 32767}));
const Settings = require('./source/Configurations/Client_Settings');

client.commands = new Collection();
client.aliases = new Collection();

require("./source/Utilities/eventHandler");
require("./source/Utilities/commandHandler");
require('./source/Utilities/functions')(client);

client.login(Settings.botToken)
.then(() => console.log(`[CLIENT] ${client.user.username} ismiyle bot aktif!`))
.catch((err) => console.log(`[CLIENT] bot aktif değil. Sebep: ${err}`));