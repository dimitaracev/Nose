const http = require('http');

class Response {
	constructor(response) {
		if (response instanceof http.OutgoingMessage) this.response = response;
		else
			throw TypeError(
				'Response(response) - provided response not of type OutgoingMessage'
			);
	}

	json(json) {
		if (!this.response.getHeader('content-type'))
			this.response.setHeader('Content-Type', 'application/json;charset=utf-8');
		this.response.write(json);
	}

	write(text) {
		if (!this.response.getHeader('content-type'))
			this.response.setHeader('Content-Type', 'text/plain;charset=utf-8');
		this.response.write(text);
	}
}

module.exports = Response;
