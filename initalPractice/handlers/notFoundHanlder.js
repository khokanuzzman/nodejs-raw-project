const handler = {};

handler.notFoundHander = (requestProperties, callback) => {
  console.log(requestProperties);
  callback(200, {
    message: "No route found....",
  });
};

module.exports = handler;
