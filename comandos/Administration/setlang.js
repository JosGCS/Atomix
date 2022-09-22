const Comando = require("../../base/Comando.js");

class Setlang extends Comando {

	constructor (client) {
		super(client, {
			name: "setlang",
			dirname: __dirname,
			enabled: true,
			guildOnly: true,
			aliases: [],
			memberPermissions: [ "MANAGE_GUILD" ],
			botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
			nsfw: false,
			ownerOnly: false,
			cooldown: 10000
		});
	}

	async run (message, args, data) {

		const language = this.client.idiomas.find((l) => l.nombre === args[0] || l.apodos.includes(args[0]));

		if(!args[0] || !language){
			return message.error("administration/setlang:MISSING_LANG", {
				list: this.client.idiomas.map((l) => "`"+l.nombre+"`").join(", ")
			});
		} else {
			data.guild.language = language.nombre;
			await data.guild.save();
			return message.sendT("administration/setlang:SUCCESS");
		}        
	}
}

module.exports = Setlang;