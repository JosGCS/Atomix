const Comando = require("../../base/Comando.js");

class Play extends Comando {
	constructor (client) {
		super(client, {
			name: "play",
			dirname: __dirname,
			enabled: true,
			guildOnly: true,
			aliases: [],
			memberPermissions: [],
			botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS", "CONNECT", "SPEAK" ],
			nfsw: false,
			ownerOnly: false,
			cooldown: 5000
		});
	}
	
	async run (message, args) {
		const songName = args.join(" ");
		
		if(!songName) {
			return message.error("music/play:MISSING_SONG_NAME");
		} else {
			const voice = message.member.voice.channel;
			if(!voice) {
				return message.error("music/play:NO_VOICE_CHANNEL");
			} else {
				// Revisar permisos
				const perms = voice.permissionsFor(this.client.user);
				if(!perms.has("CONNECT") && !perms.has("SPEAK")) {
					return message.error("music/play:VOICE_CHANNEL_CONNECT");
				} else {
					await this.client.player.play(message, songName);
				}
			}
		}
	}
}

module.exports = Play;