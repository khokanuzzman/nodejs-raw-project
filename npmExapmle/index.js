// import chalk from "chalk";
// import validator from "validator";

// const email = validator.isEmail("khokanuzzamankhokan@gmail.com");
// console.log(chalk.green("Starting app in dev mode..."));
// console.log(
//   email ? chalk.green("Email is valid") : chalk.red("Email is invalid")
// );

import fs from "fs";
import http from "http";

const obj = {
  name: "Khokan",
  age: "22",
  email: "khokanuzzamankhokan@gmail.com",
};

const objD = JSON.stringify(obj);
fs.writeFile("data.json", objD, (err) => {});

const server = http.createServer((req, res) => {
  if (req.url === "/") {
    res.end("This is home page");
  } else if (req.url === "/about") {
    const objData = JSON.stringify(obj);
    const data = JSON.parse(objData.toString());
    res.end(data);
  } else if (req.url === "/contact") {
    res.end("This is contact page");
  } else {
    res.writeHead(404, { "Content-type": "text/html" });
    res.end("<h1>404 page not found</h1>");
  }
});

server.listen(3000, "127.0.0.1", () => {
  console.log("Server is running on port 3000");
});
