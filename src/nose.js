const http = require('http');
const Route = require('./route');
const Url = require('./url');
const Middleware = require('./middleware');
class Nose {
	#routes;
	#middleware;
	constructor() {
		this.#middleware = new Middleware();
		this.#routes = new Array();
	}

	Use(callback) {
		this.#middleware.Use(callback);
	}

	SetRoute(route, router) {
		if (typeof route == 'string' && router instanceof Route) {
			if (route[route.length - 1] == '/')
				route = route.substr(0, route.length - 1);
			this.#routes.push({ route: route, router: router });
			for (let subroute of router.Subroutes) {
				if (subroute.subroute[0] == '/')
					subroute.subroute = subroute.subroute.substr(1);
				if (route[route.length - 1] == '/')
					route = route.substr(0, route.length - 1);

				let subrouteUrl = route + '/' + subroute.subroute;
				this.#routes.push({ route: subrouteUrl, router: subroute.router });
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
				let [route, params] = Url.matchurl(request.url, this.#routes);
				if (params != undefined) request.params = params;

				if (route != undefined) {
					this.#middleware.Run(request, response, () => {
						route.Handle(request, response);
					});
				} else {
					PageNotFound(response);
				}
			})
			.listen(PORT);

		let PageNotFound = (response) => {
			response.setHeader('Content-type', 'text/plain;charset=utf-8');
			response.writeHead(404, 'Page not found');
			response.end('404 - Page not found');
		};
	}
}

module.exports = Nose;
