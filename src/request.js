const http = require('http');

module.exports = class {
	constructor(request) {
		if (request instanceof http.IncomingMessage) this.request = request;
		else
			throw TypeError(
				'Request(request) - provided request not of type IncomingMessage'
			);
	}
};
