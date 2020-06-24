const fs = require('fs');
const path = require('path');
const Route = require('./route');

module.exports = {
	serve: (static_path) => {
		let staticf = new Route();
		try {
			const files = fs.readdirSync(static_path, {
				withFileTypes: true,
			});
			files.forEach((file) => {
				let extension = path.extname(file.name);
				let fpath = path.join(static_path, file.name);
				const data = fs.readFileSync(fpath, 'utf-8');
				switch (extension) {
					case '.css':
						staticf.ChildAll(file.name, (req, res) => {
							res.setHeader('Content-Type', 'text/css;');
							res.end(data);
						});
						break;
					case '.js':
						staticf.ChildAll(file.name, (req, res) => {
							res.setHeader('Content-Type', 'application/javascript;');
							res.end(data);
						});
						break;
				}
			});
		} catch (Exception) {
			console.log(Exception);
		}
		return staticf;
	},
};
