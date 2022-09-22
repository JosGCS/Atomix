/*
  Clase de Registros para mejorar la información
  mostrada en la consola del bot
*/

const { bgBlue, black, green } = require("chalk");

function dateTimePad(value, digits){
	let number = value;
	while (number.toString().length < digits) {
		number = "0" + number;
	}
	return number;
}

function format(tDate){
	return (tDate.getFullYear() + "-" +
    dateTimePad((tDate.getMonth() + 1), 2) + "-" +
    dateTimePad(tDate.getDate(), 2) + " " +
    dateTimePad(tDate.getHours(), 2) + ":" +
    dateTimePad(tDate.getMinutes(), 2) + ":" +
    dateTimePad(tDate.getSeconds(), 2) + "." +
    dateTimePad(tDate.getMilliseconds(), 3));
}

module.exports = class Logger {
	static log (contenido, tipo = "log") {
		const fecha = `[${format(new Date(Date.now()))}]:`;
		switch (tipo) {
			// Revisa el tipo de registro y luego lo envia en la consola.
			case "log": {
				return console.log(`${fecha} ${bgBlue(tipo.toUpperCase())} ${contenido}`);
			}
			case "warn": {
				return console.log(`${fecha} ${black.bgYellow(tipo.toUpperCase())} ${contenido}`);
			}
			case "error": {
				return console.log(`${fecha} ${black.bgRed(tipo.toUpperCase())} ${contenido}`);
			}
			case "debug": {
				return console.log(`${fecha} ${green(tipo.toUpperCase())} ${contenido}`);
			}
			case "cmd": {
				return console.log(`${fecha} ${black.bgWhite(tipo.toUpperCase())} ${contenido}`);
			}
			case "ready": {
				return console.log(`${fecha} ${black.bgGreen(tipo.toUpperCase())} ${contenido}`);
			}
			default: throw new TypeError("El registro debe ser WARN, DEBUG, LOG, READY, CMD o sino ERROR.");
		}
	}
}