const Comando = require("../../base/Comando.js"),
	Discord = require("discord.js");

class Help extends Comando {
	constructor (client) {
		super(client, {
			name: "help",
			dirname: __dirname,
			enabled: true,
			guildOnly: false,
			aliases: [ "ayuda", "h", "commands", "cmds", "?" ],
			memberPermissions: [],
			botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
			nsfw: false,
			ownerOnly: false,
			cooldown: 5000
		});
	}
  
	async run (message, args, data) {
		if (args[0]) {
			const isCustom = (data.guild.customCommands ? data.guild.customCommands.find((c) => c.name === args[0]) : false);
			
			const cmd = this.client.commands.get(args[0]) || this.client.commands.get(this.client.aliases.get(args[0]));
			if(!cmd && isCustom) {
				return message.error("general/help:CUSTOM", {
					cmd: args[0]
				});
			} else if(!cmd) {
				return message.error("general/help:NOT_FOUND", {
					search: args[0]
				});
			} else {
				const description = message.translate(`${cmd.help.category.toLowerCase()}/${cmd.help.name}:DESCRIPTION2`);
				const usage = message.translate(`${cmd.help.category.toLowerCase()}/${cmd.help.name}:USAGE`, {
					prefix: message.guild ? data.guild.prefix : ""
				});
				
				const examples = message.translate(`${cmd.help.category.toLowerCase()}/${cmd.help.name}:EXAMPLES`, {
					prefix: message.guild ? data.guild.prefix : ""
				});
				
				// Crear mensaje embed
				const groupEmbed = new Discord.MessageEmbed()
					.setAuthor(message.translate("general/help:CMD_TITLE", { name: this.client.user.username }), this.client.user.displayAvatarURL())
					.setThumbnail(this.client.user.displayAvatarURL())
					.addField(`:information_source: ${message.translate("general/help:FIELD_DESCRIPTION")}`, description, false)
					.addField(`:jigsaw: ${message.translate("general/help:FIELD_USAGE")}`, usage, true)
					.addField(`:dart: ${message.translate("general/help:FIELD_ALIASES")}`, cmd.help.aliases.length > 0 ? cmd.help.aliases.map(a => "`" + a + "`").join(", ") : message.translate("general/help:NO_ALIAS"), true)
					.addField(`:grey_question: ${message.translate("general/help:FIELD_EXAMPLES")}`, `\`\`\`${examples}\`\`\``, false)
					.addField(`:closed_lock_with_key: ${message.translate("general/help:FIELD_PERMISSIONS")}`, cmd.conf.memberPermissions.length > 0 ? cmd.conf.memberPermissions.map((p) => "`" + p + "`").join(", ") : message.translate("general/help:NO_REQUIRED_PERMISSION"), false)
					.setColor(this.client.config.embed.color)
					.setTimestamp(new Date())
					.setFooter(this.client.config.embed.footer, this.client.user.displayAvatarURL());
				
				// Enviar embed
				return message.channel.send(groupEmbed);
			}
		} else {
			const categories = [];
			const commands = this.client.commands;
      
			commands.forEach((command) => {
				if (!categories.includes(command.help.category)) {
					if (command.help.category === "Owner" && message.author.id !== this.client.config.owner.id) {
						return;
					} else {
						categories.push(command.help.category);
					}
				} else {
					return;
				}
			});
      
			const emojis = this.client.emojisPersonalizados;
			
			const embed = new Discord.MessageEmbed()
				.setDescription(message.translate("general/help:INFO", { prefix: message.guild ? data.guild.prefix : "", name: this.client.user.username }))
				.setColor(data.config.embed.color)
				.setTimestamp(new Date())
				.setFooter(data.config.embed.footer, this.client.user.displayAvatarURL());
				
			categories.sort().forEach((cat) => {
				const tCommands = commands.filter((cmd) => cmd.help.category === cat);
				
				let prefix = message.guild ? data.guild.prefix : "";
				
				embed.addField(emojis.categories[cat.toLowerCase()] + " " + cat + " - (" + tCommands.size + ")",
					`\`\`\`${tCommands.map((cmd) => prefix + cmd.help.name + message.translate(cat.toLowerCase() + "/" + cmd.help.name + ":DESCRIPTION")).join("\n")}\`\`\``, false);
			});
			
			if(message.guild){
				if(data.guild.customCommands.length > 0) {
					embed.addField(emojis.categories.custom+" "+message.guild.name+" | "+message.translate("general/help:CUSTOM_COMMANDS")+" - ("+data.guild.customCommands.length+")", data.guild.customCommands.map((cmd) => "`"+cmd.name+"`").join(", "));
				} else {
					/*embed.addField("\u200B", message.translate("misc:STATS_FOOTER", {
						name: this.client.user.username,
						donateLink: "https://patreon.com/JosGCS",
						dashboardLink: "https://josgcs.tk",
						inviteLink: await this.client.generateInvite({
							permissions: [
								"ADMINISTRATOR"
							]
						}),
						githubLink: "https://github.com/JosGCS",
						supportLink: "https://josgcs.tk"
					}));*/
					
					embed.setAuthor(message.translate("general/help:TITLE", {
						name: this.client.user.username
					}), this.client.user.displayAvatarURL());
					
					return message.channel.send(embed);
				}
			} else {
				return;
			}
		}
	}
}

module.exports = Help;