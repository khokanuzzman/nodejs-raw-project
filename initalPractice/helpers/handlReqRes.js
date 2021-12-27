// dependecies:
const { StringDecoder } = require("string_decoder");
const Url = require("url");
const routes = require("../routes");
const { notFoundHander } = require("../handlers/notFoundHanlder");
const { sampleHandler } = require("../handlers/sampleHandlers");
const { parseJSON } = require("../helpers/utitlites");

// scaffolding
const hanlder = {};

hanlder.handleReqRes = (req, res) => {
  // get the url and parse it
  const parsedUrl = Url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, "");
  const search = parsedUrl.search;
  const method = req.method.toLowerCase();
  const headers = req.headers;
  let realData = "";
  const decode = new StringDecoder("utf-8");

  const requestProperties = {
    parsedUrl: parsedUrl,
    path: path,
    trimmedPath: trimmedPath,
    search: search,
    method: method,
    queryStringObject: parsedUrl.query,
    headersObject: headers,
  };
  const chosenhandler = routes[trimmedPath]
    ? routes[trimmedPath]
    : notFoundHander;

  req.on("data", (buffer) => {
    realData += decode.write(buffer);
  });

  req.on("end", () => {
    realData += decode.end();

    requestProperties.body = parseJSON(realData);

    chosenhandler(requestProperties, (statusCode, playLoad) => {
      console.log(`Status code: ${statusCode}`);
      playLoad =
        typeof playLoad === "object" ? JSON.stringify(playLoad) : playLoad;
      statusCode = typeof statusCode === "number" ? statusCode : 500;

      res.setHeader("Content-type", "application/json");
      res.writeHead(statusCode);
      res.end(playLoad);
    });
  });
};

module.exports = hanlder;
