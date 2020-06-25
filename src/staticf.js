const fs = require('fs');
const path = require('path');
const Route = require('./route');

module.exports = {
	serve: (static_path) => {
		let staticf = new Route();

		staticf.Get((req, res) => {
			res.end('Static files.');
		});

		try {
			let recursive_search = (spath) => {
				let files = fs.readdirSync(spath, { withFileTypes: true });
				let ret_files = [];
				files.forEach((file) => {
					if (file.isDirectory()) {
						let dpath = path.join(spath, file.name);
						ret_files = ret_files.concat(recursive_search(dpath));
					} else if (file.isFile()) {
						let fpath = path.join(spath, file.name);
						fpath = fpath.slice(static_path.length, fpath.length);
						ret_files.push(fpath);
					}
				});
				return ret_files;
			};
			let files = recursive_search(static_path);
			files.forEach((file) => {
				let extension = path.extname(file);
				const fpath = path.join(static_path, file);
				const data = fs.readFileSync(fpath);
				switch (extension) {
					case '.css':
						staticf.ChildAll(file, (req, res) => {
							res.setHeader('Content-Type', 'text/css;charset=utf8;');
							res.end(data);
						});
						break;
					case '.js':
						staticf.ChildAll(file, (req, res) => {
							res.setHeader('Content-Type', 'application/javascript;charset=utf8;');
							res.end(data);
						});
					case '.png':
						staticf.ChildAll(file, (req, res) => {
							res.setHeader('Content-Type', 'image/png;');
							res.end(data);
						});
						break;
					case '.jpg':
					case '.jpeg':
						staticf.ChildAll(file, (req, res) => {
							res.setHeader('Content-Type', 'image/jpeg;');
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
