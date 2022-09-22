const Comando = require("../../base/Comando.js");

class Pause extends Comando {
	constructor (client) {
		super(client, {
			name: "pause",
			dirname: __dirname,
			enabled: true,
			guildOnly: true,
			aliases: [],
			memberPermissions: [],
			botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
			nsfw: false,
			ownerOnly: false,
			cooldown: 5000
		});
	}
	
	async run (message) {
		const serverQueue = this.client.player.getQueue(message);
		const voice = message.member.voice.channel;
		
		if(!voice) {
			return message.error("music/play:NO_VOICE_CHANNEL");
		} else {
			if(!queue) {
				return message.error("music:play:NOT_PLAYING");
			} else {
				// Obtén la canción actual
				await this.client.player.pause(message);
				
				// Envia mensaje de confirmación
				message.sendT("music/pause:SUCCESS");
			}
		}
	}
}

module.exports = Pause;