const Comando = require("../../base/Comando.js"),
	Discord = require("discord.js");
	
class Skip extends Comando {
	constructor (client) {
		super(client, {
			name: "skip",
			dirname: __dirname,
			enabled: true,
			guildOnly: true,
			aliases: [ "next" ],
			memberPermissions: [],
			botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
			nsfw: false,
			ownerOnly: false,
			cooldown: 5000
		});
	}
	
	async run (message, args, data) {
		const serverQueue = this.client.player.getQueue(message);
		const voice = message.member.voice.channel;
		
		if(!voice) {
			return message.error("music/play:NO_VOICE_CHANNEL");
		} else {
			if(!serverQueue) {
				return message.error("music/play:NOT_PLAYING");
			} else {
				if(!serverQueue.tracks[0]) {
					return message.error("music/skip:NO_NEXT_SONG");
				} else {
					const members = voice.members.filter((m) => !m.user.bot);
					
					const embed = new Discord.MessageEmbed()
						.setAuthor(message.translate("music/skip:TITLE", {
							gName: message.guild.name
						}), message.guild.iconURL())
						.setDescription(message.translate("music/skip:SUCCESS"))
						.setThumbnail(serverQueue.tracks[0].thumbnail)
						.setColor(this.client.config.embed.color)
						.setTimestamp(new Date())
						.setFooter(this.client.config.embed.footer, this.client.user.displayAvatarURL());

					const m = await message.channel.send(embed);
					
					if(members.size > 1) {
						m.react("⏭");
						
						const mustVote = Math.floor(members.size/2+1);
						
						embed.setDescription(message.translate("music/skip:VOTE_CONTENT", {
							songName: serverQueue.tracks[0].name,
							voteCount: 0,
							requiredCount: mustVote
						}));
						m.edit(embed);
						
						const filter = (reaction, user) => {
							const member = message.guild.members.cache.get(user.id);
							const voiceChannel = member.voice.channel;
							if(voiceChannel){
								return voiceChannel.id === voice.id;
							} else {
								return;
							}
						};
						
						const collector = await m.createReactionCollector(filter, {
							time: 25000
						});
						
						collector.on("collect", (reaction) => {
							const haveVoted = reaction.count-1;
							if(haveVoted >= mustVote) {
								this.client.player.skip(message);
								embed.setDescription(message.translate("music/skip:SUCCESS"));
								m.edit(embed);
								collector.stop(true);
							} else {
								embed.setDescription(message.translate("music/skip:VOTE_CONTENT", {
									songName: queue.tracks[0].title,
									voteCount: haveVoted,
									requiredCount: mustVote
								}));
								m.edit(embed);
							}
						});

						collector.on("end", (collected, isDone) => {
							if(!isDone){
								return message.error("misc:TIMES_UP");
							} else {
								return;
							}
						});
					} else {
						this.client.player.skip(message);
						embed.setDescription(message.translate("music/skip:SUCCESS"));
						m.edit(embed);
					}
				}
			}
		}
	}
}

module.exports = Skip;