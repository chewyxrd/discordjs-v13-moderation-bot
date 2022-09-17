const { readdirSync } = require("fs");
const client = global.client;

const files = readdirSync("./source/Events");
files
	.filter((x) => x.endsWith(".js"))
	.forEach((file) => {
		const event = require(`../Events/${file}`);
		if (!event.config) return;
		client.on(event.config.name, event);
	});
