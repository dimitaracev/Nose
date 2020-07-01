const fs = require("fs");
const path = require("path");
module.exports = {
  render: (req, res, static, engine_name, engine) => {
    return (filepath, data) => {
      let fpath = path.join(static, filepath);
      let extension = path.extname(fpath);
      let page = fs.readFileSync(fpath).toString();

      res.setHeader("Content-type", "text/html;charset=utf8;");

      if (extension == ".html") {
        res.end(page);
        return;
      }

      if (engine_name) {
        switch (engine_name) {
          case "ejs":
          case "mustache":
            page = engine.render(page, data);
            break;
          case "handlebars":
            let template = engine.compile(page);
            page = template(data);
            break;
        }
      }
      res.end(page);
    };
  },
};
