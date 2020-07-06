const http = require("http");
const Route = require("./route");
const Url = require("./url");
const Middleware = require("./middleware");
const bodyparser = require("./bodyparser");
const staticf = require("./staticf");
const trim = require("./trim");
const fs = require("fs");
const path = require("path");
const renderer = require("./renderer");
class Nose {
  #notfound;
  #routes;
  #middleware;
  #options;
  constructor(options) {
    this.#options = Object.assign(this.DefaultOptions(), options);
    this.#middleware = new Middleware();
    this.#routes = new Map();
    this.#notfound = this.DefaultNotFound();
  }

  DefaultOptions() {
    return {
      static: undefined,
      port: process.env.PORT || 8080,
      engine_name: undefined,
      engine: undefined,
    };
  }

  DefaultNotFound() {
    return (req, res) => {
      res.setHeader("Content-type", "text/plain;charset=utf-8");
      res.writeHead(404, "Page not found");
      res.end("404 - Page not found");
    };
  }

  Use(callback) {
    this.#middleware.Use(callback);
  }

  SetRoute(url, route) {
    if (typeof url == "string" && route instanceof Route) {
      url = trim.slash(url);
      this.#routes.set(url, { url: url, route: route });
      for (let childrouter of route.ChildRoutes) {
        childrouter.url = trim.slash(childrouter.url);
        
        let childrouterUrl;
        
        if(url != "") childrouterUrl = url + "/" + childrouter.url;
        else childrouterUrl = childrouter.url;

        this.#routes.set(childrouterUrl, {
          url: childrouterUrl,
          route: childrouter.route,
        });
      }
    } else
      throw TypeError(
        "SetRoute(url, route) - provided route/router not of type string/Route."
      );
  }

  SetNotFound(callback) {
    if (typeof callback == "function") {
      this.#notfound = callback;
    } else {
      throw TypeError(
        "SetNotFoundPage(callback) - provided callback not of type function."
      );
    }
  }

  Listen() {
    if (this.#options["static"])
      this.SetRoute("/static", staticf.serve(this.#options["static"]));

    http
      .createServer((req, res) => {
        let route, params;

        if (this.#options["static"])
          res.render = renderer.render(
            req,
            res,
            this.#options["static"],
            this.#options["engine_name"],
            this.#options["engine"]
          );

        req.url = trim.slash(req.url);
        if (this.#routes.has(req.url)) {
          route = this.#routes.get(req.url)["route"];
        } else {
          [route, params] = Url.matchurl(req.url, this.#routes.values());
          if (params) req.params = params;
        }
        if (route) {
          bodyparser
            .parseBody(req)
            .then(() => {
              this.#middleware.Run(req, res, () => {
                route.Handle(req, res);
              });
            })
            .catch((Exception) => console.log(Exception));
        } else {
          this.#middleware.Run(req, res, () => {
            this.#notfound(req, res);
          });
        }
      })
      .listen(this.#options["port"]);
    console.log(`Listening on port ${this.#options["port"]}`);
  }
}

module.exports = Nose;
