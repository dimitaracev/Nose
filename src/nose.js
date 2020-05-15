const http = require('http');
const Route = require('./route');
const Url = require('./url');
const Middleware = require('./middleware');
const bodyparser = require('./bodyparser');
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

	SetRoute(url, route) {
		if (typeof url == 'string' && route instanceof Route) {
			if (url[url.length - 1] == '/') url = url.substr(0, url.length - 1);
			this.#routes.push({ url: url, route: route });
			for (let childrouter of route.ChildRoutes) {
				if (childrouter.url[0] == '/')
					childrouter.url = childrouter.url.substr(1);
				if (url[url.length - 1] == '/') url = url.substr(0, route.length - 1);
				let childrouterUrl = url + '/' + childrouter.url;
				this.#routes.push({ url: childrouterUrl, route: childrouter.route });
			}
		} else
			throw TypeError(
				'SetRoute(url, route) - provided route/router not of type string/Route'
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
					bodyparser.parseBody(request).then(() => {
						this.#middleware.Run(request, response, () => {
							route.Handle(request, response);
						});
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
