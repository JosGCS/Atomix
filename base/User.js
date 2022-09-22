const mongoose = require("mongoose"),
	Canvas = require("canvas");

const genToken = () => {
	let token = "";
	const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwzy0123456789.-_";
	for (let i = 0; i < 32; i++){
		token += characters.charAt(Math.floor(Math.random() * characters.length));
	}
	return token;
};

const userSchema = new mongoose.Schema({

	/* REQUERIDO */
	id: { type: String }, // ID del Usuario en Discord

	/* ECONOMIA (GLOBAL) */
	rep: { type: Number, default: 0 }, // Puntos de Reputación del Usuario
	bio: { type: String }, // Biográfia del Usuario
	birthdate: { type: Number }, // Cumpleaños del Usuario
	lover: { type: String }, // Persona en Relación con el Usuario

	/* ESTADÍSTICAS */
	registeredAt: { type: Number, default: Date.now() }, // Fecha de Registro del Usuario

	/* LOGROS */
	achievements: { type: Object, default: {
		married: {
			achieved: false,
			progress: {
				now: 0,
				total: 1
			}
		},
		work: {
			achieved: false,
			progress: {
				now: 0,
				total: 10
			}
		},
		firstCommand: {
			achieved: false,
			progress: {
				now: 0,
				total: 1
			}
		},
		slots: {
			achieved: false,
			progress: {
				now: 0,
				total: 3
			}
		},
		tip: {
			achieved: false,
			progress: {
				now: 0,
				total: 1
			}
		},
		rep: {
			achieved: false,
			progress: {
				now: 0,
				total: 20
			},
		},
		invite: {
			achieved: false,
			progress: {
				now: 0,
				total: 1
			}
		}
	}},

	/* TIEMPO DE ESPERA */
	cooldowns: { type: Object, default: {
		rep: 0
	}},

	/* OTRA INFORMACIÓN */
	afk: { type: String, default: null }, // Detector AFK del Usuario
	reminds: { type: Array, default: [] }, // Recordatorias del Usuario
	logged: { type: Boolean, default: false }, // Si el usuario está conectado al Panel
	apiToken: { type: String, default: genToken() } // El API Token del Usuario

});

userSchema.method("genApiToken", async function(){
	this.apiToken = genToken();
	await this.save();
	return this.apiToken;
});

userSchema.method("getAchievements", async function(){
	const canvas = Canvas.createCanvas(1800, 250),
		ctx = canvas.getContext("2d");
	const images = [
		await Canvas.loadImage("./assets/img/logros/logro"+(this.achievements.work.achieved ? "_colored" : "")+"1.png"),
		await Canvas.loadImage("./assets/img/logros/logro"+(this.achievements.firstCommand.achieved ? "_colored" : "")+"2.png"),
		await Canvas.loadImage("./assets/img/logros/logro"+(this.achievements.married.achieved ? "_colored" : "")+"3.png"),
		await Canvas.loadImage("./assets/img/logros/logro"+(this.achievements.slots.achieved ? "_colored" : "")+"4.png"),
		await Canvas.loadImage("./assets/img/logros/logro"+(this.achievements.tip.achieved ? "_colored" : "")+"5.png"),
		await Canvas.loadImage("./assets/img/logros/logro"+(this.achievements.rep.achieved ? "_colored" : "")+"6.png"),
		await Canvas.loadImage("./assets/img/logros/logro"+(this.achievements.invite.achieved ? "_colored" : "")+"7.png")
	];
	let dim = 0;
	for(let i = 0; i < images.length; i++){
		await ctx.drawImage(images[i], dim, 10, 350, 200);
		dim += 200;
	}
	return canvas.toBuffer();
});

module.exports = mongoose.model("User", userSchema);