const http = require('http');

module.exports = class {
	constructor(response) {
		if (response instanceof http.OutgoingMessage) this.response = response;
		else
			throw TypeError(
				'Response(response) - provided response not of type OutgoingMessage'
			);
	}

	json(json) {
		this.response.setHeader('Content-Type', 'application/json');
		this.response.write(json);
	}
};
