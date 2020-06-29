const http = require('http');
const Route = require('./route');
const Url = require('./url');
const Middleware = require('./middleware');
const bodyparser = require('./bodyparser');
const staticf = require('./staticf');
const trim = require('./trim');
const fs = require('fs');
const path = require('path');
const { type } = require('os');
class Nose {
	#notfound;
	#routes;
	#middleware;
	#options;
	constructor(options) {
		this.#options = Object.assign(this.DefaultOptions(), options);
		this.#middleware = new Middleware();
		this.#routes = new Map();
		this.#notfound = this.DefaultNotFound();
	}

	DefaultOptions() {
		return {
			static: undefined,
			port: process.env.PORT || 8080,
		};
	}

	DefaultNotFound() {
		return (req, res) => {
			res.setHeader('Content-type', 'text/plain;charset=utf-8');
			res.writeHead(404, 'Page not found');
			res.end('404 - Page not found');
		};
	}

	Use(callback) {
		this.#middleware.Use(callback);
	}

	SetRoute(url, route) {
		if (typeof url == 'string' && route instanceof Route) {
			url = trim.slash(url);
			this.#routes.set(url, { url: url, route: route });
			for (let childrouter of route.ChildRoutes) {
				childrouter.url = trim.slash(childrouter.url);
				let childrouterUrl = url + '/' + childrouter.url;
				this.#routes.set(childrouterUrl, {
					url: childrouterUrl,
					route: childrouter.route,
				});
			}
		} else
			throw TypeError(
				'SetRoute(url, route) - provided route/router not of type string/Route.'
			);
	}

	SetNotFound(callback) {
		if (typeof callback == 'function') {
			this.#notfound = callback;
		} else {
			throw TypeError(
				'SetNotFoundPage(callback) - provided callback not of type function.'
			);
		}
	}

	Listen() {
		if (this.#options['static'] != undefined) {
			this.SetRoute('/static', staticf.serve(this.#options['static']));
			http.ServerResponse.prototype.render = (filename) => {
				if (this.#options['static'] == undefined) {
					throw Error('Static Folder not defined.');
				} else {
					let fpath = path.join(this.options['static'], filename);
					let data = fs.readFileSync(fpath);
					response.setHeader('Content-type', 'text/html;charset=utf8;');
					response.end(data);
				}
			};
		}

		http
			.createServer((req, res) => {
				let route = undefined,
					params = undefined;
				req.url = trim.slash(req.url);
				if (this.#routes.has(req.url)) {
					route = this.#routes.get(req.url)['route'];
				} else {
					[route, params] = Url.matchurl(req.url, this.#routes.values());
					if (params != undefined) req.params = params;
				}
				if (route != undefined) {
					bodyparser.parseBody(req).then(() => {
						this.#middleware.Run(req, res, () => {
							route.Handle(req, res);
						});
					});
				} else {
					this.#middleware.Run(req, res, () => {
						this.#notfound(req, res);
					});
				}
			})
			.listen(this.#options['port']);
	}
}

module.exports = Nose;
