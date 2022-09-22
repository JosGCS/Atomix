const Discord = require("discord.js");

module.exports = class {

	constructor (client) {
		this.client = client;
	}
    
	async run (guild) {		
		// Envia un Embed con el Registro
		const logsEmbed = new Discord.MessageEmbed()
			.setAuthor(`${this.client.user.username} - guildDelete Logs`, this.client.user.displayAvatarURL())
			.setColor(this.client.config.embed.color)
			.setThumbnail(guild.iconURL())
			.addField(`${this.client.emojisPersonalizados.error} Removed Guild:`, `${guild.name}\n(${guild.id})`, true)
			.addField(`:fleur_de_lis: Guild Owner:`, `<@${guild.owner.id}>\n(${guild.owner.id})`, true)
			.setTimestamp(new Date())
			.setFooter(this.client.config.embed.footer, this.client.user.displayAvatarURL());
		this.client.channels.cache.get(this.client.config.support.logs).send(logsEmbed);
	}
};