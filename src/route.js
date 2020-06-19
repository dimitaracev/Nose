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
		else
			throw TypeError(
				'Get(callback) - provided callback not of type function.'
			);
	}

	Post(callback) {
		if (typeof callback == 'function') this.#Callbacks['POST'] = callback;
		else
			throw TypeError(
				'Post(callback) - provided callback not of type function.'
			);
	}

	Delete(callback) {
		if (typeof callback == 'function') this.#Callbacks['DELETE'] = callback;
		else
			throw TypeError(
				'Delete(callback) - provided callback not of type function.'
			);
	}

	Put(callback) {
		if (typeof callback == 'function') this.#Callbacks['PUT'] = callback;
		else
			throw TypeError(
				'Put(callback) - provided callback not of type function.'
			);
	}

	Handle(request, response) {
		if (this.#Callbacks[request.method] != undefined) {
			this.#middleware.Run(request, response, () => {
				this.#Callbacks[request.method](request, response);
			});
		} else {
			throw Error('Handle(request, response) - Requested route not found.');
		}
	}
}

module.exports = Route;
