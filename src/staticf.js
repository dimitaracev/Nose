const fs = require("fs");
const path = require("path");
const Route = require("./route");

const Exclusions = [".html", ".ejs", ".mustache", ".handlebars"];

function recursive_search(curpath, static_path) {
  try {
    let files = fs.readdirSync(curpath, { withFileTypes: true });
    let ret_files = [];
    files.forEach((file) => {
      if (file.isDirectory()) {
        let dpath = path.join(curpath, file.name);
        ret_files = ret_files.concat(recursive_search(dpath, static_path));
      } else if (file.isFile()) {
        let extension = path.extname(file);
        if (!Exclusions.includes(extension)) {
          let fpath = path.join(curpath, file.name);
          fpath = fpath.slice(static_path.length, fpath.length);
          ret_files.push(fpath);
        }
      }
    });
    return ret_files;
  } catch (Exception) {
    console.log(Exception);
  }
}

module.exports = {
  serve: (static_path) => {
    let staticf = new Route();

    staticf.Get((req, res) => {
      res.end("Static files.");
    });

    try {
      recursive_search(static_path, static_path).forEach((file) => {
        let extension = path.extname(file);
        const fpath = path.join(static_path, file);
        const data = fs.readFileSync(fpath);
        staticf.ChildAll(file, (req, res) => {
          switch (extension) {
            case ".css":
              res.setHeader("Content-Type", "text/css;charset=utf8;");
              break;
            case ".js":
              res.setHeader(
                "Content-Type",
                "application/javascript;charset=utf8;"
              );
            case ".png":
              res.setHeader("Content-Type", "image/png;");
              break;
            case ".jpg":
            case ".jpeg":
              res.setHeader("Content-Type", "image/jpeg;");
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
