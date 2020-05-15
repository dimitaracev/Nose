const Middleware = require('./middleware');
class Route {

	#subroutes;
	#middleware;
	#GetCallback;
	#DeleteCallback;
	#PostCallback;
	#PutCallback;
	constructor() {
		this.#subroutes = [];
		this.#middleware = new Middleware();
	}

	get Subroutes(){
		return this.#subroutes;
	}

	set Middleware(middleware)
	{
		this.#middleware = middleware;
	}

	Use(callback) {
		this.#middleware.Use(callback);
	}

	SubGet(route, callback) {
		if (typeof route == 'string' && typeof callback == 'function') {
			let subroute = new Route();
			subroute.Get(callback);
			subroute.Middleware = this.#middleware;
			this.#subroutes.push({ subroute: route, router: subroute });
		}
	}

	SubPost(route, callback) {
		if (typeof route == 'string' && typeof callback == 'function') {
			let subroute = new Route();
			subroute.Post(callback);
			subroute.Middleware = this.#middleware;
			this.#subroutes.push({ subroute: route, router: subroute });
		}
	}

	SubDelete(route, callback) {
		if (typeof route == 'string' && typeof callback == 'function') {
			let subroute = new Route();
			subroute.Delete(callback);
			subroute.Middleware = this.#middleware;
			this.#subroutes.push({ subroute: route, router: subroute });
		}
	}

	SubPut(route, callback) {
		if (typeof route == 'string' && typeof callback == 'function') {
			let subroute = new Route();
			subroute.Put(callback);
			subroute.Middleware = this.#middleware;
			this.#subroutes.push({ subroute: route, router: subroute });
		}
	}

	Get(callback) {
		if (typeof callback == 'function') this.#GetCallback = callback;
	}

	Post(callback) {
		if (typeof callback == 'function') this.#PostCallback = callback;
	}

	Delete(callback) {
		if (typeof callback == 'function') this.#DeleteCallback = callback;
	}

	Put(callback) {
		if (typeof callback == 'function') this.#PutCallback = callback;
	}

	Handle(request, response) {
		switch (request.method) {
			case 'GET':
				if (this.#GetCallback != undefined) {
					this.#middleware.Run(request, response, () => {
						this.#GetCallback(request, response);
					});
				}
				break;
			case 'POST':
				if (this.#PostCallback != undefined) {
					this.#middleware.Run(request, response, () => {
						this.#PostCallback(request, response);
					});
				}
				break;
			case 'DELETE':
				if (this.#DeleteCallback != undefined) {
					this.#middleware.Run(request, response, () => {
						this.#DeleteCallback(request, response);
					});
				}
				break;
			case 'PUT':
				if (this.#PutCallback != undefined) {
					this.#middleware.Run(request, response, () => {
						this.#PutCallback(request, response);
					});
				}
				break;
		}
	}
}

module.exports = Route;
