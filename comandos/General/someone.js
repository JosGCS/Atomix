const Comando = require("../../base/Comando.js"),
	Discord = require("discord.js");

class Someone extends Comando {

	constructor (client) {
		super(client, {
			name: "someone",
			dirname: __dirname,
			enabled: true,
			guildOnly: true,
			aliases: [ "somebody", "something", "alguien" ],
			memberPermissions: [],
			botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
			nsfw: false,
			ownerOnly: false,
			cooldown: 500
		});
	}

	async run (message, args, data) {
        
		const member = message.guild.members.cache.random(1)[0];
        
		const embed = new Discord.MessageEmbed()
			.setAuthor(`${message.translate("general/someone:TITLE", {
				name: this.client.user.username
			})}`, this.client.user.displayAvatarURL())
			.addField(`:spy: ${message.translate("common:USERNAME")}`, `\`\`\`${member.user.username}\`\`\``, false)
			.addField(`:hash: ${message.translate("common:DISCRIMINATOR")}`, `\`\`\`${member.user.discriminator}\`\`\``, false)
			.addField(`:id: ${message.translate("common:ID")}`, `\`\`\`${member.user.id}\`\`\``, false)
			.setThumbnail(member.user.displayAvatarURL())
			.setColor(data.config.embed.color)
			.setTimestamp(new Date())
			.setFooter(data.config.embed.footer, this.client.user.displayAvatarURL())
		message.channel.send(embed);
        
	}

}

module.exports = Someone;