const winston = require('winston');
const config = require('../config/winston');

const level = () => {
	return process.env.WINSTON_LEVEL
}

winston.addColors(config.winstonColor);

//log format
let format = winston.format.json();
if (process.env.LOG_FORMAT === 'on') {
	format = winston.format.combine(
		// winston.format.colorize({ all: true }),
		winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
		winston.format.align(),
		winston.format.printf((debug) => {
			const {
				timestamp, level, message,durationMs, ...args
			} = debug;

			const ts = timestamp.slice(0, 19).replace('T', ' ');
			return `${ts} [${level}]${(durationMs)?'[durationMs:'+durationMs+']':''}:${message} ${Object.keys(args).length ? JSON.stringify(args, null, 2) : ''}`;
		})
	)
}
const transports = [
	new winston.transports.Console(),
	// new winston.transports.File({ filename: __dirname+`/../config/error_log/winston_log.txt` }),
]

const Logger = winston.createLogger({
	level: level(),
	levels: config.winstonLevels,
	format,
	transports,
})


module.exports = Logger
