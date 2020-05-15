module.exports = {
	matchurl: (url, routes) => {
		if (url[url.length - 1] == '/') url = url.substr(0, url.length - 1);
		let router = [undefined, undefined];
		let urlArray = url.split('/');
		for (let route of routes) {
			let routeUrlArray = route.url.split('/');
			if (urlArray.length != routeUrlArray.length) continue;
			let length = urlArray.length || routeUrlArray.length;
			let paramLength = routeUrlArray.filter((item) => item.includes(':'))
				.length;
			let params = {};
			let count = 0;
			for (let i = 0; i < length; i++) {
				if (urlArray[i] == routeUrlArray[i]) count++;
				else params[routeUrlArray[i].substr(1)] = urlArray[i];
			}
			if (length == count + paramLength) {
				router = [route.route, params];
				break;
			}
		}
		return router;
	},
};
