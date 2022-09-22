require("./ayudantes/extenders");

// Cargar Paquetes
const config = require("./config");

// Cargar Sentry
const Sentry = require("@sentry/node"),
    util = require("util"),
    fs = require("graceful-fs"),
    mongoose = require("mongoose"),
    chalk = require("chalk");

// Cargar clase de AtomixBot
const Atomix = require("./base/Atomix"),
    client = new Atomix();

// Iniciar el Bot
const init = async () => {
	// Buscar Categorías
	const directorio = await fs.readdirSync("./comandos/");
	client.logger.log(`Cargando ${directorio.length} categorías.`, "log");
  
	// Cargar Comandos
	directorio.forEach(async (dir) => {
		const cmds = await fs.readdirSync("./comandos/" + dir + "/");
		cmds.filter((cmd) => cmd.split(".").pop() === "js").forEach((cmd) => {
			const respuesta = client.loadCommand("./comandos/" + dir, cmd);
			if (respuesta) {
				client.logger.log(respuesta, "error");
			} else {
				return;
			}
		});
	});
  
	// Buscar Eventos
	const dirEventos = await fs.readdirSync("./eventos/");
	client.logger.log(`Cargando ${dirEventos.length} eventos.`, "log");
  
	// Cargar Eventos
	dirEventos.forEach((archivo) => {
		const nombreEvt = archivo.split(".")[0];
		client.logger.log(`Cargando evento: ${nombreEvt}`, "log");
		const evento = new (require(`./eventos/${archivo}`))(client);
		client.on(nombreEvt, (...args) => evento.run(...args));
		delete require.cache[require.resolve(`./eventos/${archivo}`)];
	});
  
	// Iniciar sesión en Discord
	client.login(client.config.token);
	
	// Conectarse a la base de datos
	mongoose.connect(client.config.mongoDB, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
		client.logger.log("¡Conectado a MongoDB!.", "log");
	}).catch((err) => {
		client.logger.log("No es posible conectarse con MongoDB. Error:"+err, "error");
	});
	
	const languages = require("./ayudantes/languages");
	client.translations = await languages();
}

init();

// Detector de errores
client.on("disconnect", () => client.logger.log("Bot is disconnecting...", "warn"))
	.on("reconnecting", () => client.logger.log("Bot reconnecting...", "log"))
	.on("error", (e) => client.logger.log(e, "error"))
	.on("warn", (info) => client.logger.log(info, "warn"));

process.on("unhandledRejection", (err) => {
	console.error(err);
});
