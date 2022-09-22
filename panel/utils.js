const Discord = require("discord.js");

// Conseguir información de los servidores
/*
	@param {string} guildID - La ID del servidor de Discord
	@param {object} client - La instancia del bot
	@param {array} guilds - Los servidores del usuario
*/
async function fetchGuild(guildID, client, guilds) {
	const guild = client.guilds.cache.get(guildID);
	const conf = await client.findOrCreateGuild({ id: guild.id });
	return { ...guild, ...conf.toJSON(), ...guilds.find((g) => g.id === guild.id) };
}

// Conseguir información del usuario (estadísticas, servidores y más...)
/*
	@param {object} userData - Información oAuth2 del Usuario
	@param {object} client - La instancia del bot
	@param {string} query - Busqueda opcional para los servidores
	@param {object} - Información del Usuario
*/
