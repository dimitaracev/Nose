const http = require('http');
const Route = require('./route');
const Url = require('./url');
const Response = require('./response');

class Nose {
	constructor() {
		this.routes = new Array();
	}

	SetRoute(route, router) {
		if (typeof route == 'string' && router instanceof Route) {
			if (route[route.length - 1] == '/')
				route = route.substr(0, route.length - 1);
			this.routes.push({ route: route, router: router });
			for (let subroute of router.subroutes) {
				let subrouteUrl = route + '/' + subroute.subroute;
				this.routes.push({ route: subrouteUrl, router: subroute.router });
			}
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
				let [route, params] = Url.matchurl(request.url, this.routes);
				if (route != undefined) {
					if (params != undefined) request.params = params;
					let resp = new Response(response);
					route.Handle(request, resp);
				} else {
					response.setHeader('Content-Type', 'text/html;charset=utf-8');
					response.writeHead(404, 'Page not found');
					response.write('404 Error - Page not found');
				}
				response.end('');
			})
			.listen(PORT);
	}
}

module.exports = Nose;
