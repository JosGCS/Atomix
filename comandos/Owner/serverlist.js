const Comando = require("../../base/Comando.js"),
	Discord = require("discord.js");

class ServersList extends Comando {

	constructor (client) {
		super(client, {
			name: "serverlist",
			dirname: __dirname,
			enabled: true,
			guildOnly: false,
			aliases: [ "slist", "svlist", "svl" ],
			memberPermissions: [],
			botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
			nsfw: false,
			ownerOnly: true,
			cooldown: 5000
		});
	}

	async run (message, args, data) {
		await message.delete();
		
		// Variables
		let index1 = 0;
		let index2 = 10;
		let page = 1;
		
		// Establecer descripción
		let desc = `${message.translate("common:SERVERS")}: ${this.client.guilds.cache.size}\n\n` + this.client.guilds.cache.sort((a, b) => b.memberCount - a.memberCount).map((r) => r).map((r, i) => `**${i + 1}** - ${r.name} | ${r.memberCount} ${message.translate("common:MEMBERS").toLowerCase()}`).slice(0, 10).join("\n");
		
		// Crear embed
		const embed = new Discord.MessageEmbed()
			.setAuthor(message.translate("owner/serverlist:SERVERLIST_TITLE", {
				botName: this.client.user.username
			}), this.client.user.displayAvatarURL())
			.setThumbnail(this.client.user.displayAvatarURL())
			.setTitle(`${message.translate("common:PAGE")}: ${page}/${Math.ceil(this.client.guilds.cache.size / 10)}`)
			.setDescription(desc)
			.setColor(this.client.config.embed.color)
			.setTimestamp(new Date())
			.setFooter(this.client.config.embed.footer, this.client.user.displayAvatarURL());
			
		// Preparar embed
		const msg = await message.channel.send(embed);
		
		// Añadir reacciones
		await msg.react("◀");
		await msg.react("▶");
		await msg.react("❌");
		
		// Obtener reacciones
		const collector = msg.createReactionCollector((reaction, user) => user.id === message.author.id);
		
		// Procesar reacciones obtenidas
		collector.on("collect", async(reaction) => {
			if(reaction._emoji.name === "◀") {
				// Reacción previa
				if(index1 <= 0) {
					await reaction.users.remove(message.author.id);
					return;
				} else {
					// Actualizar variables
					index1 = index1 - 10;
					index2 = index2 - 10;
					page = page - 1;
				
					// Revisar si hay servidores
					if(index1 < 0) {
						await reaction.users.remove(message.author.id);
					} else {					
						// Actualizar descripción del embed
						desc = `${message.translate("common:SERVERS")}: ${this.client.guilds.cache.size}\n\n` + this.client.guilds.cache.sort((a, b) => b.memberCount - a.memberCount).map((r) => r).map((r, i) => `**${i + 1}** - ${r.name} | ${r.memberCount} ${message.translate("common:MEMBERS").toLowerCase()}`).slice(index1, index2).join("\n");
				
						// Actualizar información del embed
						embed.setTitle(`${message.translate("common:PAGE")}: ${page}/${Math.ceil(this.client.guilds.cache.size / 10)}`);
						embed.setDescription(desc);
				
						// Actualizar embed
						msg.edit(embed);
					}
				}
			} else if(reaction._emoji.name === "▶") {
				// Reacción siguiente
				if(index2 >= this.client.guilds.cache.size) {
					await reaction.users.remove(message.author.id);
					return;
				} else {
					// Actualizar variables
					index1 = index1 + 10;
					index2 = index2 + 10;
					page = page + 1;
				
					// Revisar si hay servidores
					if(index1 > this.client.guilds.cache.size) {
						await reaction.users.remove(message.author.id);
					} else {				
						// Actualizar descripción del embed
						desc = `${message.translate("common:SERVERS")}: ${this.client.guilds.cache.size}\n\n` + this.client.guilds.cache.sort((a,b) => b.memberCount - a.memberCount).map((r) => r).map((r, i) => `**${i + 1}** - ${r.name} | ${r.memberCount} ${message.translate("common:MEMBERS").toLowerCase()}`).slice(index1, index2).join("\n");
				
						// Actualizar información del embed
						embed.setTitle(`${message.translate("common:PAGE")}: ${page}/${Math.ceil(this.client.guilds.cache.size / 10)}`);
						embed.setDescription(desc);
				
						// Actualizar embed
						msg.edit(embed);
					}
				}
			} else if(reaction._emoji.name === "❌️") {
				// Reacción cancelar
				msg.delete();
			} else {
				//await reaction.users.remove(message.author.id);
				msg.delete();
			}
			
			// Eliminar las reacciones del usuario después de cada uso.
			await reaction.users.remove(message.author.id);
		});
	}

}

module.exports = ServersList;