class Middleware {
  #middlewares;
  constructor() {
    this.#middlewares = [];
  }
  Use(callback) {
    if (typeof callback == "function") this.#middlewares.push(callback);
    else
      throw TypeError(
        "Use(callback) - provided callback not of type function."
      );
  }

  Run(request, response, finish) {
    ((request, response, done) => {
      this.#middlewares.reduceRight(
        (done, next) => () => next(request, response, done),
        done
      )(request, response);
    })(request, response, () => finish());
  }
}

module.exports = Middleware;
