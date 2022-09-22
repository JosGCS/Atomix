const chalk = require("chalk");
const fs = require("graceful-fs");

module.exports = class {
	constructor (client) {
		this.client = client;
	}
  
	async run() {
		const client = this.client;
    
		// Registra alguna información usando Logger
		client.logger.log(`Cargando ${client.commands.size} comando(s).`, "log");
		client.logger.log(`¡${client.user.tag} iniciado con ${client.users.cache.size} usuarios en ${client.guilds.cache.size} servidores!`, "ready");
    
		// Actualiza el estado del bot cada 10 segundos
		const status = require("../config").estados;
		const { prefix } = require("../config");
		const botVersion = require("../package.json").version;
		let i = 0;
    
		setInterval(function() {
			const toDisplay = status[parseInt(i, 10)].nombre.replace("{contadorServer}", client.guilds.cache.size).replace("{contadorUser}", client.users.cache.size).replace("{botPrefix}", prefix).replace("{botName}", client.user.username).replace("{botVersion}", botVersion).replace("{contadorCmd}", client.commands.size);
			client.user.setActivity(toDisplay, { type: status[parseInt(i, 10)].tipo });
			if(status[parseInt(i+1, 10)]) {
				i++;
			} else {
				i = 0;
			}
		}, 10000); // 10 segundos
	}
}