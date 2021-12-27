// dependencies
const http = require("http");
const { handleReqRes } = require("./helpers/handlReqRes");
const routes = require("./routes");
const environments = require("./helpers/environments");
const data = require("./lib/data");
// scafolding

const app = {};

// configuration
app.config = {};

// data.create(
//   "test",
//   "newFile",
//   { name: "Md khokanuzzaman", age: 28, city: "tangail" },
//   (err) => {
//     console.log(err);
//   }
// );

// data.read("test", "newFile", (err, data) => {
//   const dataObj = JSON.parse(data);
//   console.log(err, dataObj);
// });

// data.update(
//   "test",
//   "newFile",
//   { name: "Md khokanuzzaman khokan", age: 28, city: "Tangail" },
//   (err) => {
//     console.log(err);
//   }
// );

// data.delete("test", "newFile", (err) => {
//   console.log(err);
// });

app.createServer = () => {
  const server = http.createServer(app.handleReqRes);
  server.listen(environments.port, "127.0.0.1", () => {
    console.log(`server is running ${environments.port}`);
  });
};

// handle request and response

app.handleReqRes = handleReqRes;

app.createServer();
