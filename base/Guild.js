const mongoose = require("mongoose"),
	Schema = mongoose.Schema,
	config = require("../config.js"),
	idiomas = require("../idiomas/idioma-meta.json");

module.exports = mongoose.model("Guild", new Schema({

	/* REQUERIDO */
	id: { type: String }, // ID del Servidor de Discord
    
	/* MEMBERSDATA */
	membersData: { type: Object, default: {} }, // Datos de los Miembros del Servidor
	members: [{ type: Schema.Types.ObjectId, ref: "Member" }],

	/* CONFIGURATION */
	language: { type: String, default: idiomas.find((l) => l.default).nombre }, // Idioma del Servidor
	prefix: { type: String, default: config.prefix }, // Prefijo default o personalizado del Servidor
	plugins: { type: Object, default: { // Datos de los Plugins
		// Mensajes de Bienvenida
		welcome: {
			enabled: false, // ¿Están activos los mensajes de bienvenida?
			message: null, // Mensaje
			channel: null, // Canal donde serán enviandos los mensajes de bienvenida
			withImage: null // ¿Está activa la imagén personalizada?
		},
		// Mensajes de Despedida
		goodbye: {
			enabled: false, // ¿Están activos los mensajes de despedida?
			message: null, // Mensaje
			channel: null, // Canal donde serán enviados los mensajes de despedida
			withImage: null // ¿Está activa la imagén personalizada?
		},
		// Auto Role
		autorole: {
			enabled: false, // ¿Está activado?
			role: null // Role que dará el bot
		},
		// Auto Moderación
		automod: {
			enabled: false, // ¿Está activo el módulo de automoderación?
			ignored: [] // Canales ignorados por el módulo
		},
		// Auto Sanciones
		warnsSanctions: {
			kick: false, // Auto Kickear cuando superen X advertencias
			ban: false // Auto Banear cuando superen X advertencias
		},
		// Tickets de Soporte
		tickets: {
			enabled: false, // ¿Están activos los Tickets de Soporte?
			category: null // Categoría donde estarán los tickets
		},
		suggestions: false, // Canal donde se enviarán las sugerencias
		modlogs: false, // Canal donde los registros de moderación (mute, kick, ban, etc...) serán enviados
		reports: false, // Canal donde los reportes serán enviados
		fortniteshop: false, // Canal donde la tienda de fortnite será enviada a las 2.05am
		logs: false // Canal donde los registros de sistema (message deleted, etc...) serán enviados
	}},
	slowmode: { type: Object, default: { // Modo Lento del Servidor
		users: [],
		channels: []
	}},
	casesCount: { type: Number, default: 0 },
	ignoredChannels: { type: Array, default: [] }, // Canales ignorados por el bot
	customCommands: { type: Array, default: [] }, // Comandos personalizados del servidor
	commands: { type: Array, default: [] }, // Registros de Comandos
	autoDeleteModCommands: { type: Boolean, default: false }, // ¿Auto eliminar comandos de moderación?
	disabledCategories: { type: Array, default: [] } // Categorías desactivadas
}));