const Comando = require("../../base/Comando.js");

class Eightball extends Comando {

	constructor (client) {
		super(client, {
			name: "8ball",
			dirname: __dirname,
			enabled: true,
			guildOnly: false,
			aliases: [ "eight-ball", "eightball", "bola8", "bola-ocho", "bolaocho" ],
			memberPermissions: [],
			botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
			nsfw: false,
			ownerOnly: false,
			cooldown: 3000
		});
	}

	async run (message, args) {
        
		if (!args[0] || !message.content.endsWith("?")) {
			return message.error("fun/8ball:ERR_QUESTION");
		} else {
			const answerNO = parseInt(Math.floor(Math.random() * 10), 10);
			const answer = message.translate(`fun/8ball:RESPONSE_${answerNO + 1}`);
			message.reply(`${answer}`);
		}
	}
}

module.exports = Eightball;