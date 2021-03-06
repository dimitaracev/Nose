const qs = require("querystring");
module.exports = {
  parseBody(request) {
    let content = request.headers["content-type"];
    let bodyData = [];
    return new Promise((resolve, reject) => {
      request.on("data", (chunk) => {
        bodyData.push(chunk);
      });
      request.on("end", () => {
        let data = Buffer.concat(bodyData).toString();
        if (data.length > 0) {
          switch (content) {
            case "application/json":
              request.body = JSON.parse(data);
              break;
            case "application/x-www-form-urlencoded":
              request.body = qs.parse(data);
              break;
            default:
              reject();
              throw Error("parseBody(request) - Content-type not supported.");
          }
        }
        resolve();
      });
    });
  },
};
