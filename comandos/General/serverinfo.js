const Comando = require("../../base/Comando.js"),
	Discord = require("discord.js"),
	moment = require("moment");

class Serverinfo extends Comando {

	constructor (client) {
		super(client, {
			name: "serverinfo",
			dirname: __dirname,
			enabled: false,
			guildOnly: true,
			aliases: [ "si", "svinfo", "servinfo" ],
			memberPermissions: [],
			botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
			nsfw: false,
			ownerOnly: false
		});
	}

	async run (message, args, data) {
		if(args[0]){
			let guildMsg = message.guild;
			
		} else {
			guild = await guild.fetch();
			
			const embed = new Discord.MessageEmbed()
				.setAuthor(message.translate("general/serverinfo:TITLE", {
					gName: guild.name
				}), guild.iconURL({ dynamic: true }))
				.setThumbnail(guild.iconURL({ dynamic: true }))
				.addField(this.client.emojisPersonalizados.title + " " + message.translate("common:NAME"), guild.name, true)
				.addField(this.client.emojisPersonalizados.calendar + " " + message.translate("common:CREATION"), moment(guild.createdAt).format("dddd, MMMM Do YYYY"), true)
				.addField(this.client.emojisPersonalizados.users + " " + message.translate("common:MEMBERS"), message.translate("general/serverinfo:MEMBERS", {
					count: guild.members.cache.filter(m => !m.user.bot).size
				})+" | "+message.translate("general/serverinfo:BOTS", {
					count: guild.members.cache.filter(m => m.user.bot).size
				}), true)
				.addField(this.client.emojisPersonalizados.afk + " " + message.translate("general/serverinfo:AFK_CHANNEL"), guild.afkChannel || message.translate("general/serverinfo:NO_AFK_CHANNEL"), true)
				.addField(this.client.emojisPersonalizados.id + " " + message.translate("common:ID"), guild.id, true)
				.addField(this.client.emojisPersonalizados.crown + " " + message.translate("common:OWNER"), guild.owner, true)
				.addField(this.client.emojisPersonalizados.boost + " " + message.translate("general/serverinfo:BOOSTS"), guild.premiumSubscriptionCount || 0, true)
				.addField(this.client.emojisPersonalizados.channels + " " + message.translate("common:CHANNELS"), message.translate("general/serverinfo:TEXT_CHANNELS", {
					count: guild.channels.cache.filter(c => c.type === "text").size
				}) + " | " + message.translate("general/serverinfo:VOICE_CHANNELS", {
					count: guild.channels.cache.filter(c => c.type === "voice").size
				}) + " | " + message.translate("general/serverinfo:CAT_CHANNELS", {
					count: guild.channels.cache.filter(c => c.type === "category").size
				}), true)
				.setColor(data.config.embed.color)
				.setTimestamp(new Date())
				.setFooter(data.config.embed.footer, this.client.user.displayAvatarURL());

			message.channel.send(embed);
		}
	}
}

module.exports = Serverinfo;