module.exports = {
	token: "NOPE", // Token del Bot
	prefix: "a!", // Prefijo por defecto del bot
	embed: {
		color: "#009432", // Color de los Embeds
		footer: "© Copyright 2021 | Atomix" // Pie de los Embeds
	},
	support: {
		id: "SERVER_NUMBER_ID", // ID del Servidor de Soporte
		logs: "CHANNEL_NUMBER_ID" // Canal de Registros del Bot
	},
	panel: {
		mantenimiento: false, // Activa o desactiva el modo mantenimiento del panel
		puerto: 80, // Puerto web para mostrar el panel
		claveSesionExpress: "CualquierC0s4_" // Clave de seguridad para las sesiones de express (puede ser cualquiera)
	},
	owner: {
		id: "199237487648833556",
		nombre: "JosGCS#0001"
	},
	mongoDB: "mongodb://localhost:27017/Atomix",
	votes: {
		port: 5000,
		password: "NOPE",
		channel: "CHANNEL_NUMBER_ID"
	},
	apiKeys: {
		amethyste: "NOPE",
		dbl: "NOPE",
		blagueXYZ: "NOPE"
	},
	estados: [
		{
			nombre: "{botPrefix}help | {botName} {botVersion}",
			tipo: "WATCHING"
		},
		{
			nombre: "+{contadorServer} servers.",
			tipo: "WATCHING"
		},
		{
			nombre: "+{contadorUser} users.",
			tipo: "WATCHING"
		},
		{
			nombre: "+{contadorCmd} commands.",
			tipo: "WATCHING"
		}
	]
}
