// Cargar Paquetes
const { MessageEmbed, Util } = require("discord.js");
const { GiveawaysManager } = require("discord-giveaways");
const { Player } = require("discord-player");
const { Client, Collection } = require("discord.js");
const { Client: Joker } = require("blague.xyz");

const util = require("util"),
    AmeClient = require("amethyste-api"),
    path = require("path"),
    moment = require("moment");

moment.relativeTimeThreshold("s", 60);
moment.relativeTimeThreshold("ss", 5);
moment.relativeTimeThreshold("m", 60);
moment.relativeTimeThreshold("h", 60);
moment.relativeTimeThreshold("d", 24);
moment.relativeTimeThreshold("M", 12);

// Crear la clase AtomixBot
class Atomix extends Client {
    constructor(options) {
		super(options);
		this.config = require("../config"); // Cargar archivo de configuración
		this.emojisPersonalizados = require("../emojis.json"); // Cargar emojis personalizados
		this.idiomas = require("../idiomas/idioma-meta.json"); // Cargar idiomas del bot.
		this.commands = new Collection(); // Crear colección para los comandos
		this.aliases = new Collection(); // Crear colección para los apodos de los comandos
		this.logger = require("../ayudantes/logger"); // Cargar archivo para mostrar logs
		this.wait = util.promisify(setTimeout); // client.wait(1000) - Espera 1 segundo
		this.functions = require("../ayudantes/functions"); // Cargar archivo de funciones
		this.guildsData = require("../base/Guild"); // Modelo Mongoose de Guilds
		this.usersData = require("../base/User"); // Modelo Mongoose de Usuarios
		this.membersData = require("../base/Member"); // Modelo Mongoose de Miembros
		this.logs = require("../base/Log"); // Modelo Mongoose de Registros
		this.dashboard = require("../panel/app"); // Cargar panel de AtomixBot
		this.queues = new Collection(); // Crear colección para la música
		this.states = {}; // Usado para el panel
		this.knownGuilds = [];
    
		// Registros de la SQL
		this.databaseCache = {};
		this.databaseCache.users = new Collection(); // Crear colección para los usuarios
		this.databaseCache.guilds = new Collection(); // Crear colección para los servidores
		this.databaseCache.members = new Collection(); // Crear colección para los miembros
    
		this.databaseCache.usersReminds = new Collection(); // Miembros con recordatorios activos
		this.databaseCache.mutedUsers = new Collection(); // Miembros silenciados
	
		// API's
		if(this.config.apiKeys.amethyste){
			this.AmeAPI = new AmeClient(this.config.apiKeys.amethyste);
		}
		
		if(this.config.apiKeys.blagueXYZ) {
			this.joker = new Joker(this.config.apiKeys.blagueXYZ, {
				defaultLanguage: "en"
			});
		}
		
		this.player = new Player(this, {
			leaveOnEmpty: false
		});
		this.player
			.on("trackStart", (message, track) => {
				message.success("music/play:NOW_PLAYING", {
					songName: track.title
				});
			})
			.on("playlistStart", (message, queue, playlist, track) => {
				message.channel.send(this.emojisPersonalizados.success+" | "+message.translate("music/play:PLAYING_PLAYLIST", {
					playlistTitle: playlist.title,
					playlistEmoji: this.emojisPersonalizados.playlist,
					songName: track.title
				}));
			})
			.on("searchResults", (message, query, tracks) => {
				if (tracks.length > 11) tracks = tracks.slice(0, 11);
				const embed = new MessageEmbed()
					.setDescription(Util.escapeSpoiler(tracks.map((t, i) => `**${++i} -** ${t.title}`).join("\n")))
					.setFooter(message.translate("music/play:RESULTS_FOOTER"))
					.setColor(this.config.embed.color);
				message.channel.send(embed);
			})
			.on("searchInvalidResponse", (message, query, tracks, content, collector) => {
				if (content === "cancel") {
					collector.stop();
					return message.success("music/play:RESULTS_CANCEL");
				}
				message.error("misc:INVALID_NUMBER_RANGE", {
					min: 1,
					max: tracks.length
				});
			})
			.on("searchCancel", (message) => {
				message.error("misc:TIMES_UP");
			})
			.on("botDisconnect", (message) => {
				message.error("music/play:STOP_DISCONNECTED");
			})
			.on("noResults", (message) => {
				message.error("music/play:NO_RESULT");
			})
			.on("queueEnd", (message) => {
				message.success("music/play:QUEUE_ENDED");
			})
			.on("playlistAdd", (message, queue, playlist) => {
				message.success("music/play:ADDED_QUEUE_COUNT", {
					songCount: playlist.items.length
				});
			})
			.on("trackAdd", (message, queue, track) => {
				message.success("music/play:ADDED_QUEUE", {
					songName: track.title
				});
			})
			.on("channelEmpty", () => {
				// do nothing, leaveOnEmpty is not enabled
			})
			.on("error", (message, error) => {
				switch (error) {
					case "NotConnected":
						message.error("music/play:NO_VOICE_CHANNEL");
						break;
					case "UnableToJoin":
						message.error("music/play:VOICE_CHANNEL_CONNECT");
						break;
					case "NotPlaying":
						message.error("music/play:NOT_PLAYING");
						break;
					case "LiveVideo":
						message.error("music/play:LIVE_VIDEO");
						break;
					default:
						message.error("music/play:ERR_OCCURRED", {
							error
						});
						break;
				}
			});
		this.giveawaysManager = new GiveawaysManager(this, {
			storage: "./giveaways.json",
			updateCountdownEvery: 10000,
			default: {
				botsCanWin: false,
				exemptPermissions: [ "MANAGE_MESSAGES", "ADMINISTRATOR" ],
				embedColor: "#FF0000",
				reaction: "🎉"
			}
		});
	}
  
	// Obtener idioma por defecto del bot
	get defaultLanguage(){
		return this.idiomas.find((idioma) => idioma.default).nombre;
	}
	
	translate(key, args, locale){
		if(!locale) locale = this.defaultLanguage;
		const language = this.translations.get(locale);
		if (!language) throw "Invalid language set in data.";
		return language(key, args);
	}

	printDate(date, format, locale){
		if(!locale) locale = this.defaultLanguage;
		const languageData = this.idiomas.find((language) => language.nombre === locale || language.apodos.includes(locale));
		if(!format) format = languageData.formatoDefaultMoment;
		return moment(new Date(date))
			.locale(languageData.moment)
			.format(format);
	}

	convertTime(time, type, noPrefix, locale){
		if(!type) time = "to";
		if(!locale) locale = this.defaultLanguage;
		const languageData = this.idiomas.find((language) => language.nombre === locale || language.apodos.includes(locale));
		const m = moment(time)
			.locale(languageData.moment);
		return (type === "to" ? m.toNow(noPrefix) : m.fromNow(noPrefix));
	}
  
	// Cargar Comandos
	loadCommand(dirComando, nombreComando) {
		try {
			const props = new (require(`.${dirComando}${path.sep}${nombreComando}`))(this);
			this.logger.log(`Cargando comando: ${props.help.name}.`, "log");
			props.conf.location = dirComando;
			if (props.init) {
				props.init(this);
			} else {
				this.commands.set(props.help.name, props);
				props.help.aliases.forEach((alias) => {
					this.aliases.set(alias, props.help.name);
				});
				return false;
			}				
		} catch (err) {
			return `Imposible cargar el comando ${nombreComando}: ${err}`;
		}
	}
	
	// Descargar Comandos
	async unloadCommand(dirComando, nombreComando) {
		let comando;
		if(this.commands.has(nombreComando)) {
			comando = this.commands.get(nombreComando);
		} else if(this.aliases.has(nombreComando)) {
			comando = this.commands.get(this.aliases.get(nombreComando));
		}
		
		if(!comando) {
			return `El comando \`${nombreComando}\` parece que no existe, o no tiene un alías. ¡Prueba otra vez!`;
		} else {
			return;
		}
		
		if(comando.shutdown) {
			await comando.shutdown(this);
		} else {
			delete require.cache[require.resolve(`.${dirComando}${path.sep}${nombreComando}.js`)];
			return false;
		}
	}
	
	// Función utilizada para buscar o crear los datos del usuarios
	async findOrCreateUser({ id: userID }, isLean){
		if(this.databaseCache.users.get(userID)){
			return isLean ? this.databaseCache.users.get(userID).toJSON() : this.databaseCache.users.get(userID);
		} else {
			let userData = (isLean ? await this.usersData.findOne({ id: userID }).lean() : await this.usersData.findOne({ id: userID }));
			if(userData){
				if(!isLean) this.databaseCache.users.set(userID, userData);
				return userData;
			} else {
				userData = new this.usersData({ id: userID });
				await userData.save();
				this.databaseCache.users.set(userID, userData);
				return isLean ? userData.toJSON() : userData;
			}
		}
	}
	
	// Función utilizada para buscar o crear los datos del miembro
	async findOrCreateMember({ id: memberID, guildID }, isLean){
		if(this.databaseCache.members.get(`${memberID}${guildID}`)){
			return isLean ? this.databaseCache.members.get(`${memberID}${guildID}`).toJSON() : this.databaseCache.members.get(`${memberID}${guildID}`);
		} else {
			let memberData = (isLean ? await this.membersData.findOne({ guildID, id: memberID }).lean() : await this.membersData.findOne({ guildID, id: memberID }));
			if(memberData){
				if(!isLean) this.databaseCache.members.set(`${memberID}${guildID}`, memberData);
				return memberData;
			} else {
				memberData = new this.membersData({ id: memberID, guildID: guildID });
				await memberData.save();
				const guild = await this.findOrCreateGuild({ id: guildID });
				if(guild){
					guild.members.push(memberData._id);
					await guild.save();
				}
				this.databaseCache.members.set(`${memberID}${guildID}`, memberData);
				return isLean ? memberData.toJSON() : memberData;
			}
		}
	}
	
	// Función utilizada para buscar o crear datos de los servidores
	async findOrCreateGuild({ id: guildID }, isLean){
		if(this.databaseCache.guilds.get(guildID)){
			return isLean ? this.databaseCache.guilds.get(guildID).toJSON() : this.databaseCache.guilds.get(guildID);
		} else {
			let guildData = (isLean ? await this.guildsData.findOne({ id: guildID }).populate("members").lean() : await this.guildsData.findOne({ id: guildID }).populate("members"));
			if(guildData){
				if(!isLean) this.databaseCache.guilds.set(guildID, guildData);
				return guildData;
			} else {
				guildData = new this.guildsData({ id: guildID });
				await guildData.save();
				this.databaseCache.guilds.set(guildID, guildData);
				return isLean ? guildData.toJSON() : guildData;
			}
		}
	}
	
	// Función utilizada para resolver a un usuario desde un texto
	async resolveUser(search){
		let user = null;
		if(!search || typeof search !== "string") return;
		// Probar a buscar la ID
		if(search.match(/^<@!?(\d+)>$/)){
			const id = search.match(/^<@!?(\d+)>$/)[1];
			user = this.users.fetch(id).catch(() => {});
			if(user) return user;
		}
		// Probar a buscar al usuario
		if(search.match(/^!?(\w+)#(\d+)$/)){
			const username = search.match(/^!?(\w+)#(\d+)$/)[0];
			const discriminator = search.match(/^!?(\w+)#(\d+)$/)[1];
			user = this.users.find((u) => u.username === username && u.discriminator === discriminator);
			if(user) return user;
		}
		user = await this.users.fetch(search).catch(() => {});
		return user;
	}
	
	async resolveMember(search, guild){
		let member = null;
		if(!search || typeof search !== "string") return;
		// Probar a buscar la ID
		if(search.match(/^<@!?(\d+)>$/)){
			const id = search.match(/^<@!?(\d+)>$/)[1];
			member = await guild.members.fetch(id).catch(() => {});
			if(member) return member;
		}
		// Probar a buscar al miembro
		if(search.match(/^!?(\w+)#(\d+)$/)){
			guild = await guild.fetch();
			member = guild.members.cache.find((m) => m.user.tag === search);
			if(member) return member;
		}
		member = await guild.members.fetch(search).catch(() => {});
		return member;
	}
	
	async resolveRole(search, guild){
		let role = null;
		if(!search || typeof search !== "string") return;
		// Probar a buscar la ID
		if(search.match(/^<@&!?(\d+)>$/)){
			const id = search.match(/^<@&!?(\d+)>$/)[1];
			role = guild.roles.cache.get(id);
			if(role) return role;
		}
		// Probar a buscar el nombre
		role = guild.roles.cache.find((r) => search === r.name);
		if(role) return role;
		role = guild.roles.cache.get(search);
		return role;
	}
}

module.exports = Atomix;