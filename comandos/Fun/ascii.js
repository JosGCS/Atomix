const Comando = require("../../base/Comando.js"),
	figlet = require("figlet"),
	util = require("util"),
	figletAsync = util.promisify(figlet);

class Ascii extends Comando {

	constructor (client) {
		super(client, {
			name: "ascii",
			dirname: __dirname,
			enabled: true,
			guildOnly: false,
			aliases: [],
			memberPermissions: [],
			botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
			nsfw: false,
			ownerOnly: false,
			cooldown: 5000
		});
	}

	async run (message, args) {
		const text = args.join(" ");
		if (!text || text.length > 20) {
			return message.error("fun/ascii:TEXT_MISSING");
		} else {
			const rendered = await figletAsync(text);
			message.channel.send("```" + rendered + "```");
		}
	}
}

module.exports = Ascii;