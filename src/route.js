class Route {
	constructor() {
		this.proceed = true;
		this.middleware = [];
		this.next = () => (this.proceed = true);
		this.subroutes = [];
	}

	SubGet(route, callback) {
		if (typeof route == 'string' && typeof callback == 'function') {
			let subroute = new Route();
			subroute.Get(callback);
			subroute.middleware = this.middleware;
			this.subroutes.push({ subroute: route, router: subroute });
		}
	}
	SubPost(route, callback) {
		if (typeof route == 'string' && typeof callback == 'function') {
			let subroute = new Route();
			subroute.Post(callback);
			subroute.middleware = this.middleware;
			this.subroutes.push({ subroute: route, router: subroute });
		}
	}
	SubDelete(route, callback) {
		if (typeof route == 'string' && typeof callback == 'function') {
			let subroute = new Route();
			subroute.Delete(callback);
			subroute.middleware = this.middleware;
			this.subroutes.push({ subroute: route, router: subroute });
		}
	}
	SubPut(route, callback) {
		if (typeof route == 'string' && typeof callback == 'function') {
			let subroute = new Route();
			subroute.Put(callback);
			subroute.middleware = this.middleware;
			this.subroutes.push({ subroute: route, router: subroute });
		}
	}

	Use(callback) {
		if (typeof callback == 'function') this.middleware.push(callback);
	}

	Get(callback) {
		if (typeof callback == 'function') this.GetCallback = callback;
	}

	Post(callback) {
		if (typeof callback == 'function') this.PostCallback = callback;
	}

	Delete(callback) {
		if (typeof callback == 'function') this.DeleteCallback = callback;
	}

	Put(callback) {
		if (typeof callback == 'function') this.PutCallback = callback;
	}

	Handle(request, response) {
		for (let i = 0; i < this.middleware.length; i++) {
			this.proceed = false;
			this.middleware[i](request, response, this.next);
			if ((this.proceed = false)) break;
		}
		if (this.proceed) {
			switch (request.method) {
				case 'GET':
					if (this.GetCallback != undefined) {
						this.GetCallback(request, response);
					}
					break;
				case 'POST':
					if (this.PostCallback != undefined) {
						this.PostCallback(request, response);
					}
					break;
				case 'DELETE':
					if (this.DeleteCallback != undefined) {
						this.DeleteCallback(request, response);
					}
					break;
				case 'PUT':
					if (this.PutCallback != undefined) {
						this.PutCallback(request, response);
					}
					break;
			}
		}
	}
}

module.exports = Route;
