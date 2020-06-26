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

			recursive_search(static_path).forEach((file) => {
				let extension = path.extname(file);
				const fpath = path.join(static_path, file);
				const data = fs.readFileSync(fpath);
				staticf.ChildAll(file, (req, res) => {
					switch (extension) {
						case '.css':
							res.setHeader('Content-Type', 'text/css;charset=utf8;');
							break;
						case '.js':
							res.setHeader(
								'Content-Type',
								'application/javascript;charset=utf8;'
							);
						case '.png':
							res.setHeader('Content-Type', 'image/png;');
							break;
						case '.jpg':
						case '.jpeg':
							res.setHeader('Content-Type', 'image/jpeg;');
							break;
					}
					res.end(data);
				});
			});
		} catch (Exception) {
			console.log(Exception);
		}
		return staticf;
	},
};
