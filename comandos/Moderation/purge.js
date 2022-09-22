const Comando = require("../../base/Comando.js"),
	Discord = require("discord.js");

class Purge extends Comando {
	constructor (client) {
		super(client, {
			name: "purge",
			dirname: __dirname,
			enabled: true,
			guildOnly: true,
			aliases: [ "clear", "bulkdelete", "bd" ],
			memberPermissions: [ "MANAGE_MESSAGES" ],
			botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS", "MANAGE_MESSAGES" ],
			nsfw: false,
			ownerOnly: false,
			cooldown: 3000
		});
	}
	
	async run (message, args) {
		if(args[0] === "all") {
			await message.delete();
			
			const embed = new Discord.MessageEmbed()
				.setAuthor(message.translate("moderation/purge:TITLE", {
					gName: message.guild.name
				}), message.guild.iconURL())
				.setThumbnail(this.client.user.displayAvatarURL())
				.setDescription(message.translate("moderation/purge:ALL_DESC"))
				.setColor(this.client.config.embed.color)
				.setTimestamp(new Date())
				.setFooter(this.client.config.embed.footer, this.client.user.displayAvatarURL());
			
			const msg = await message.channel.send(embed);
			
			await msg.react("✅");
			
			const filter = (reaction, user) => {
				return [ "✅" ].includes(reaction._emoji.name) && user.id === message.author.id;
			};
			
			msg.awaitReactions(filter, {
				max: 1,
				time: 30000,
				errors: [ "time" ]
			}).then(async(collected) => {
				const reaction = collected.first();
				
				if(reaction._emoji.name === "✅") {
					msg.delete();
					
					const position = message.channel.position;
					const newChannel = await message.channel.clone();
					await message.channel.delete();
					
					newChannel.setPosition(position);
					
					newChannel.send(message.translate("moderation/purge:CHANNEL_CLEARED"));
				} else {
					msg.delete();
				}
			}).catch(err => {
				msg.delete();
				message.error("misc:TIMES_UP");
			});
		} else {
			let amount = args[0];
			
			if(!amount || isNaN(amount) || parseInt(amount) < 1){
				return message.error("moderation/purge:MISSING_AMOUNT");
			} else {
				await message.delete();
				
				const userMentioned = message.mentions.users.first();
				
				let fetchMsg = await message.channel.messages.fetch({ limit:100 });
				fetchMsg = fetchMsg.array();
				
				let toDelete = null;
				
				if(userMentioned) {
					let fetchedMsg = fetchMsg.filter((m) => m.author.id === userMentioned.id);
					
					if(fetchedMsg.length > amount) {
						fetchedMsg.length = parseInt(amount, 10);
					} else {
						fetchedMsg = fetchedMsg.filter((m) => !m.pinned);
					}
					
					message.channel.bulkDelete(fetchedMsg, true);
					
					amount++;
					
					toDelete = await message.success("moderation/purge:CLEARED_MEMBER", {
						amount: --amount,
						username: userMentioned.tag
					});
				} else {
					message.channel.bulkDelete(amount, true);
				
					amount++;
					toDelete = await message.success("moderation/purge:CLEARED", {
						amount: --amount
					});
				}
				
				setTimeout(function(){
					toDelete.delete();
				}, 2000);
			}
		}
	}
}

module.exports = Purge;