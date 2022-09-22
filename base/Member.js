const mongoose = require("mongoose");

module.exports = mongoose.model("Member", new mongoose.Schema({

	/* REQUERIDO */
	id: { type: String }, // ID del Usuario en Discord
	guildID: { type: String }, // ID del Servidor donde está conectado el Usuario

	/* ECONOMIA DEL SERVIDOR */
	money: { type: Number, default: 0 }, // Dinero del Usuario
	workStreak: { type: Number, default: 0 }, // Racha de Trabajo del Usuario
	bankSold: { type: Number, default: 0 }, // Fondos en el Banco del Usuario
	exp: { type: Number, default: 0 }, // Puntos de Experiencia del Usuario
	level: { type: Number, default: 0 }, // Nivel del Usuario

	/* ESTADÍSTICAS */
	registeredAt: { type: Number, default: Date.now() }, // Fecha de Registro del Miembro

	/* TIEMPO DE ESPERA */
	cooldowns: { type: Object, default: {
		work: 0,
		rob: 0
	}},

	/* OTRA INFORMACIÓN */
	sanctions: { type: Array, default: [] }, // Historial de Sanciones del Usuario (mute, ban, kick, etc...)
	mute: { type: Object, default: { // Información de los miembros silenciados
		muted: false,
		case: null,
		endDate: null
	}},
    
}));