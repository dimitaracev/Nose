const http = require('http');
const Route = require('./route');
const Url = require('./url');
const Response = require('./response');

module.exports = class {
	constructor() {
		this.routes = new Array();
	}

	AddRoute(route, router) {
		if (typeof route == 'string' && router instanceof Route) {
			if (route[route.length - 1] == '/')
				route = route.substr(0, route.length - 1);
			this.routes.push({ route: route, router: router });
		} else
			throw TypeError(
				'AddRoute(route, router) - provided route/router not of type string/Route'
			);
	}

	Listen(PORT) {
		if (typeof PORT != 'number')
			throw TypeError('Listen(port) - provided port not of type number');
		http
			.createServer((request, response) => {
				let route = Url.matchurl(request.url, this.routes);

				if (route != undefined) {
					if (route.params != undefined) request.params = route.params;
					if (route.router != undefined)
						route.router.Route(request, new Response(response));
				} else {
					response.writeHead(404, 'Page not found');
					response.write('404 Error - Page not found');
				}

				response.end('');
			})
			.listen(PORT);
	}
};
