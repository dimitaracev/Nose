const http = require('http');

class Request {
	constructor(request) {
		if (request instanceof http.IncomingMessage) this.request = request;
		else
			throw TypeError(
				'Request(request) - provided request not of type IncomingMessage'
			);
	}
}

module.exports = Request;
