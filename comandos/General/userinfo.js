const Comando = require("../../base/Comando.js"),
	Discord = require("discord.js"),
	fetch = require("node-fetch"),
	moment = require("moment");

class Userinfo extends Comando {

	constructor (client) {
		super(client, {
			name: "userinfo",
			dirname: __dirname,
			enabled: true,
			guildOnly: false,
			aliases: [ "ui", "usrinfo" ],
			memberPermissions: [],
			botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
			nsfw: false,
			ownerOnly: false,
			cooldown: 5000
		});
	}

	async run (message, args, data) {
        
		let displayPresence = true;

		const isID = !isNaN(args[0]);

		var user;
		if(!args[0]){
			user = message.author;
		}
		if(message.mentions.users.first()){
			user = message.mentions.users.first();
		}
		if(isID && !user){
			user = this.client.users.cache.get(args[0]);
			if(!user){
				user = await this.client.users.fetch(args[0], true).catch(() => {});
				displayPresence = false;
			}
		}
        
		if(!user){
			return message.error("general/userinfo:INVALID_USER", {
				search: args[0]
			});
		}

		let member = null;
		if(message.guild){
			member = await message.guild.members.fetch(user).catch(() => {});
		}

		const embed = new Discord.MessageEmbed()
			.setAuthor(message.translate("general/userinfo:TITLE", {
				usertag: user.tag
			}), user.displayAvatarURL())
			.setThumbnail(user.displayAvatarURL({ dynamic: true }))
			.addField(":man: "+message.translate("common:USERNAME"), user.username, true)
			.addField(this.client.emojisPersonalizados.discriminator+" "+message.translate("common:DISCRIMINATOR"), user.discriminator, true)
			.addField(this.client.emojisPersonalizados.bot+" "+message.translate("common:ROBOT"), (user.bot ? message.translate("common:YES") : message.translate("common:NO")), true)
			.addField(this.client.emojisPersonalizados.calendar+" "+message.translate("common:CREATION"), moment(user.createdAt).format("dddd, MMMM Do YYYY"), true)
			.addField(this.client.emojisPersonalizados.avatar+" "+message.translate("common:AVATAR"), user.displayAvatarURL(), false)
			.setTimestamp(new Date())
			.setColor(data.config.embed.color)
			.setFooter(data.config.embed.footer, this.client.user.displayAvatarURL());

		if(displayPresence){
			embed.addField(this.client.emojisPersonalizados.games+" "+message.translate("common:GAME"), (user.presence.activity ? user.presence.activity.name : message.translate("general/userinfo:NO_GAME")), true)
				.addField(this.client.emojisPersonalizados.status.online+" "+message.translate("common:STATUS"), message.translate("common:STATUS_"+(user.presence.status.toUpperCase())), true);
		}
            
		if(member){
			embed.addField(this.client.emojisPersonalizados.up+" "+message.translate("common:ROLE"), (member.roles.highest ? member.roles.highest : message.translate("general/userinfo:NO_ROLE")), true)
				.addField(this.client.emojisPersonalizados.calendar2+" "+message.translate("common:JOIN"), moment(member.joinedAt).format("dddd, MMMM Do YYYY"),true)
				.addField(this.client.emojisPersonalizados.color+" "+message.translate("common:COLOR"), member.displayHexColor, true)
				.addField(this.client.emojisPersonalizados.pencil+" "+message.translate("common:NICKNAME"), (member.nickname ? member.nickname : message.translate("general/userinfo:NO_NICKNAME")), true)
				.addField(this.client.emojisPersonalizados.roles+" "+message.translate("common:ROLES"), (
					member.roles.size > 10
						? member.roles.cache.map((r) => r).slice(0, 9).join(", ")+" "+message.translate("general/userinfo:MORE_ROLES", { count: member.roles.cache.size - 10 })
						: (member.roles.cache.size < 1) ? message.translate("general/userinfo:NO_ROLE") : member.roles.cache.map((r) => r).join(", ")
				));
		}

		if(user.bot && this.client.config.apiKeys.dbl && (this.client.config.apiKeys.dbl !== "")){
			const res = await fetch("https://discordbots.org/api/bots/"+user.id, {
				headers: { "Authorization": this.client.config.apiKeys.dbl }
			});
			const data = await res.json();
			if(!data.error){
				embed.addField(this.client.emojisPersonalizados.desc+" "+message.translate("common:DESCRIPTION"), data.shortdesc, true)
					.addField(this.client.emojisPersonalizados.stats+" "+message.translate("common:STATS"), message.translate("general/userinfo:BOT_STATS", {
						votes: data.monthlyPoints || 0,
						servers: data.server_count || 0,
						shards: (data.shards || [0]).length,
						lib: data.lib || "unknown"
					}), true)
					.addField(this.client.emojisPersonalizados.link+" "+message.translate("common:LINKS"), 
						`${data.support ? `[${message.translate("common:SUPPORT")}](${data.support}) | ` : ""}${data.invite ?  `[${message.translate("common:INVITE")}](${data.invite}) ` : ""}${data.github ?  `[GitHub](${data.github}) | ` : ""}${data.website ?  `[${message.translate("common:WEBSITE")}](${data.website})` : ""}`
						, true);
			}
		}

		message.channel.send(embed);
	}

}

module.exports = Userinfo;