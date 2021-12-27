const handler = {};

handler.sampleHandler = (requestProperties, callback) => {
  console.log(requestProperties);
  callback(200, {
    message: "this is sample route you browsing..",
  });
};

module.exports = handler;
