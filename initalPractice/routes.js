const { sampleHandler } = require("./handlers/sampleHandlers");
const { userHandler } = require("./handlers/userHandler");
const { tokenHandler } = require("./handlers/tokenHandler");

const routes = {
  sample: sampleHandler,
  user: userHandler,
  token: tokenHandler,
};

module.exports = routes;
