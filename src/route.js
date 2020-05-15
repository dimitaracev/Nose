const Middleware = require('./middleware');
class Route {
	#childroutes;
	#middleware;
	#Callbacks;
	constructor() {
		this.#childroutes = [];
		this.#middleware = new Middleware();
		this.#Callbacks = {};
	}

	get ChildRoutes() {
		return this.#childroutes;
	}

	set Middleware(middleware) {
		this.#middleware = middleware;
	}

	Use(callback) {
		this.#middleware.Use(callback);
	}

	ChildGet(url, callback) {
		if (typeof url == 'string' && typeof callback == 'function') {
			let childrouter = new Route();
			childrouter.Get(callback);
			childrouter.Middleware = this.#middleware;
			this.#childroutes.push({ url: url, route: childrouter });
		}
	}

	ChildPost(url, callback) {
		if (typeof url == 'string' && typeof callback == 'function') {
			let childrouter = new Route();
			childrouter.Post(callback);
			childrouter.Middleware = this.#middleware;
			this.#childroutes.push({ url: url, route: childrouter });
		}
	}

	ChildDelete(url, callback) {
		if (typeof url == 'string' && typeof callback == 'function') {
			let childrouter = new Route();
			childrouter.Delete(callback);
			childrouter.Middleware = this.#middleware;
			this.#childroutes.push({ url: url, route: childrouter });
		}
	}

	ChildPut(url, callback) {
		if (typeof url == 'string' && typeof callback == 'function') {
			let childrouter = new Route();
			childrouter.Put(callback);
			childrouter.Middleware = this.#middleware;
			this.#childroutes.push({ url: url, route: childrouter });
		}
	}

	Get(callback) {
		if (typeof callback == 'function') this.#Callbacks['GET'] = callback;
	}

	Post(callback) {
		if (typeof callback == 'function') this.#Callbacks['POST'] = callback;
	}

	Delete(callback) {
		if (typeof callback == 'function') this.#Callbacks['DELETE'] = callback;
	}

	Put(callback) {
		if (typeof callback == 'function') this.#Callbacks['PUT'] = callback;
	}

	Handle(request, response) {
		if (this.#Callbacks[request.method] != undefined) {
			this.#middleware.Run(request, response, () => {
				this.#Callbacks[request.method](request, response);
			});
		}
	}
}

module.exports = Route;
