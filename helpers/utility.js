const ErrorStackParser = require('error-stack-parser');
const logger = require('./winston')
const httpContext = require('express-http-context');
module.exports = {
	error: function (message = 'ERROR', code = 400, httpCode = 400, meta = {}) {
		return {
			error_code: `${code}`,
			error_msg: message,
			http_code: httpCode,
			assetDetails: meta
		};
	},
	timeout: function (ms) {
		return new Promise(reject => setTimeout(reject, ms));
	},
	log: function (message = "", profile = null, level = "info", errorObj = "") {
		let reqObj = {};
		let loggerMessage = {
			level: level ? level : 'info',
		};
		if(profile){
			loggerMessage.customMessage= message
		}
		else {
			loggerMessage.message= message
		}
		if(level !== 'info'){
			reqObj.reqHeader = httpContext.get('reqHeader')?httpContext.get('reqHeader'):'server error';
			reqObj.reqBody = httpContext.get('reqBody')?httpContext.get('reqBody'):'server error';
			reqObj.reqQuery = httpContext.get('reqQuery')?httpContext.get('reqQuery'):'server error';
		}
		if (httpContext.get('reqType')) {
			reqObj.reqType = httpContext.get('reqType')
		}
		if (httpContext.get('url')) {
			reqObj.url = httpContext.get('url')
		}
		if (httpContext.get('clientIp')) {
			reqObj.clientIp = httpContext.get('clientIp')
		}
		if (httpContext.get('reqId')) {
			reqObj.reqId = httpContext.get('reqId')
		}
		if (httpContext.get('reqTime')) {
			reqObj.reqTime = httpContext.get('reqTime')
		}
		if (reqObj) {
			loggerMessage = {...loggerMessage, ...reqObj}
		}
		if (level === 'error' && errorObj.hasOwnProperty("stack")) {
			loggerMessage = {...loggerMessage, ...ErrorStackParser.parse(errorObj)[0]}
		} else {
			loggerMessage = {...loggerMessage, ...errorObj}
		}
		if (profile) {
			profile.done(loggerMessage);
		} else {
			logger.log(loggerMessage);
		}
	},
	logger: logger
}
