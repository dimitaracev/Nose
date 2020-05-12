const http = require('http');
const Route = require('./route');
const Url = require('./url');

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
				'Either route is not of type string or router is not of type Route'
			);
	}

	Listen(PORT) {
		http
			.createServer((request, response) => {
				let router = Url.matchurl(request.url, this.routes);
				if (router != undefined) {
					request.params = router.params;
					router.router.Route(request, response);
				}
				else {
					response.writeHead(404, 'Page not found');
					response.write('404 Error - Page not found');
				}
				response.end('');
			})
			.listen(PORT);
	}
};
