module.exports = class {
	constructor() {
		this.proceed = true;
		this.middleware = [];
		this.next = () => (this.proceed = true);
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

	Route(request, response) {
		for (let i = 0; i < this.middleware.length; i++) {
			this.proceed = false;
			this.middleware[i](request, response, this.next);
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
};
