const Comando = require("../../base/Comando.js"),
	Discord = require("discord.js");

class Avatar extends Comando {
	constructor (client) {
		super(client, {
			name: "avatar",
			dirname: __dirname,
			enabled: true,
			guildOnly: false,
			aliases: [ "foto" ],
			memberPermissions: [],
			botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS", "ATTACH_FILES" ],
			nsfw: false,
			ownerOnly: false,
			cooldown: 5000
		});
	}

	async run (message, args) {
		let user = await this.client.resolveUser(args[0]);
		
		if(!user) {
			user = message.author;
			const avatarURL = user.displayAvatarURL({ size: 512, dynamic: true }).replace(".webp", ".png");
			if(message.content.includes("-v")) {
				message.channel.send("<" + avatarURL + ">");
			} else {
				const attachment = new Discord.MessageAttachment(avatarURL, `avatar.${avatarURL.split(".").pop().split("?")[0]}`);
				message.channel.send(attachment);
			}
		} else {
			const avatarURL = user.displayAvatarURL({ size: 512, dynamic: true }).replace(".webp", ".png");
			if(message.content.includes("-v")) {
				message.channel.send("<" + avatarURL + ">");
			} else {
				const attachment = new Discord.MessageAttachment(avatarURL, `avatar.${avatarURL.split(".").pop().split("?")[0]}`);
				message.channel.send(attachment);
			}
		}
	}
}

module.exports = Avatar;