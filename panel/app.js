const config = require("../config"),
	utils = require("./utils"),
	CheckAuth = require("./auth/CheckAuth");

module.exports.load = async(client) => {
	// Iniciar App con Express
	const express = require("express"),
		session = require("express-session"),
		path = require("path"),
		app = express();
  
	// Rutas
	const rutasPrincipales = require("./rutas/index"),
        discordAPIRouter = require("./rutas/discord"),
        logoutRouter = require("./rutas/logout"),
        settingsRouter = require("./rutas/settings");
  
	// Configuración de la APP
	app
		.use(express.json())
		.use(express.urlEncoded({ extended: true }))
		// Establecer el motor en HTML (para formato .ejs)
		.engine("html", require("ejs").renderfile)
		.set("view engine", "ejs")
		// Establece el directorio de CSS y JS para ./public
		.use(express.static(path.join(__dirname, "/public")))
		// Establece las plantillas .ejs en ./views
		.set("views", path.join(__dirname, "/views"))
		// Establece el puerto del panel de control del KrystalBot
		.set("port", config.panel.puerto)
		// Establece la contraseña y configuración para la sesión de express
		.use(session({ secret: config.panel.claveSesionExpress, resave: false, saveUninitialized: false }))
		// Añade soporte multi-idioma
		.use(async function(req, res, next) {
			req.user = req.session.user
		});
};
