const client = global.client;
const { readdirSync, readdir } = require('fs');

readdirSync('./source/Commands/').forEach((dir) => {
  readdir(`./source/Commands/${dir}/`, (err, files) => {
      if(err) return console.log('error', err);
      files = files.filter(dosya => dosya.endsWith('.js'));
      if(files.length == 0) return;

      console.log(`[${dir}] dosyasından, ${files.length} adet komut yüklendi!`);

      files.forEach(file => {
          const command = require(`../Commands/${dir}/${file}`);
          if(command.onLoad && typeof command.onLoad === "function") command.onLoad(global.client);

          client.commands.set(command.config.name, command);
          if (command.config.aliases && Array.isArray(command.config.aliases)) {
            command.config.aliases.forEach((alias) => client.aliases.set(alias, command.config.name));
        };
      });
  });
});
