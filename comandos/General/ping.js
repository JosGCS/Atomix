const Comando = require("../../base/Comando.js"),
	Discord = require("discord.js");

class Ping extends Comando {

	constructor (client) {
		super(client, {
			name: "ping",
			dirname: __dirname,
			enabled: true,
			guildOnly: false,
			aliases: [ "pong", "latency", "lag" ],
			memberPermissions: [],
			botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
			nsfw: false,
			ownerOnly: false,
			cooldown: 1000
		});
	}

	async run (message) {
		message.sendT("...").then((m) => {
			m.delete();
			let embed = new Discord.MessageEmbed()
				.setAuthor(message.translate("general/ping:TITLE", {
					name: this.client.user.username
				}), this.client.user.displayAvatarURL())
				.setColor(this.client.config.embed.color)
				.setThumbnail(this.client.user.displayAvatarURL())
				.addField(message.translate("general/ping:MESSAGE_TITLE"), `${m.createdTimestamp - message.createdTimestamp}ms`, false)
				.addField(message.translate("general/ping:API_TITLE"), `${this.client.ws.ping}ms` , false)
				.setTimestamp(new Date())
				.setFooter(this.client.config.embed.footer, this.client.user.displayAvatarURL());
			return message.channel.send(embed);
		})
	}

}

module.exports = Ping;