const Middleware = require("./middleware");
class Route {
  #childroutes;
  #middleware;
  #Callbacks;
  constructor() {
    this.#childroutes = new Map();
    this.#middleware = new Middleware();
    this.#Callbacks = {};
  }

  get ChildRoutes() {
    return this.#childroutes.values();
  }

  set Middleware(middleware) {
    this.#middleware = middleware;
  }

  Use(callback) {
    this.#middleware.Use(callback);
  }

  ChildAll(url, callback) {
    if (typeof url == "string" && typeof callback == "function") {
      this.ChildGet(url, callback);
      this.ChildPost(url, callback);
      this.ChildDelete(url, callback);
      this.ChildPut(url, callback);
    } else {
      throw TypeError(
        "ChildAll(url, callback) - provided url/callback not of type string/function."
      );
    }
  }

  ChildGet(url, callback) {
    if (typeof url == "string" && typeof callback == "function") {
      let childrouter;
      if (this.#childroutes.has(url))
        childrouter = this.#childroutes.get(url)["route"];
      else childrouter = new Route();

      childrouter.Get(callback);
      childrouter.Middleware = this.#middleware;
      this.#childroutes.set(url, { url: url, route: childrouter });
    } else {
      throw TypeError(
        "ChildGet(url, callback) - provided url/callback not of type string/function."
      );
    }
  }

  ChildPost(url, callback) {
    if (typeof url == "string" && typeof callback == "function") {
      let childrouter;
      if (this.#childroutes.has(url))
        childrouter = this.#childroutes.get(url)["route"];
      else childrouter = new Route();

      childrouter.Post(callback);
      childrouter.Middleware = this.#middleware;
      this.#childroutes.set(url, { url: url, route: childrouter });
    } else {
      throw TypeError(
        "ChildPost(url, callback) - provided url/callback not of type string/function."
      );
    }
  }

  ChildDelete(url, callback) {
    if (typeof url == "string" && typeof callback == "function") {
      let childrouter;
      if (this.#childroutes.has(url))
        childrouter = this.#childroutes.get(url)["route"];
      else childrouter = new Route();

      childrouter.Delete(callback);
      childrouter.Middleware = this.#middleware;
      this.#childroutes.set(url, { url: url, route: childrouter });
    } else {
      throw TypeError(
        "ChildDelete(url, callback) - provided url/callback not of type string/function."
      );
    }
  }

  ChildPut(url, callback) {
    if (typeof url == "string" && typeof callback == "function") {
      let childrouter;
      if (this.#childroutes.has(url))
        childrouter = this.#childroutes.get(url)["route"];
      else childrouter = new Route();

      childrouter.Put(callback);
      childrouter.Middleware = this.#middleware;
      this.#childroutes.set(url, { url: url, route: childrouter });
    } else {
      throw TypeError(
        "ChildPut(url, callback) - provided url/callback not of type string/function."
      );
    }
  }

  All(callback) {
    if (typeof callback == "function") {
      this.Get(callback);
      this.Post(callback);
      this.Delete(callback);
      this.Put(callback);
    } else {
      throw TypeError(
        "All(callback) - provided callback not of type function."
      );
    }
  }

  Get(callback) {
    if (typeof callback == "function") this.#Callbacks["GET"] = callback;
    else
      throw new TypeError(
        "Get(callback) - provided callback not of type function."
      );
  }

  Post(callback) {
    if (typeof callback == "function") this.#Callbacks["POST"] = callback;
    else
      throw TypeError(
        "Post(callback) - provided callback not of type function."
      );
  }

  Delete(callback) {
    if (typeof callback == "function") this.#Callbacks["DELETE"] = callback;
    else
      throw TypeError(
        "Delete(callback) - provided callback not of type function."
      );
  }

  Put(callback) {
    if (typeof callback == "function") this.#Callbacks["PUT"] = callback;
    else
      throw TypeError(
        "Put(callback) - provided callback not of type function."
      );
  }

  Handle(request, response) {
    if (this.#Callbacks[request.method]) {
      this.#middleware.Run(request, response, () => {
        this.#Callbacks[request.method](request, response);
      });
    } else {
      throw Error("Handle(request, response) - Requested route not found.");
    }
  }
}

module.exports = Route;
