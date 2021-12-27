const { hash, parseJSON, createRandomString } = require("../helpers/utitlites");
const data = require("../lib/data");

const handler = {};
handler.tokenHandler = (requestProperties, callback) => {
  const { method, body, queryStringObject } = requestProperties;
  const acceptedMethods = ["post", "get", "put", "delete"];
  if (acceptedMethods.indexOf(method) > -1) {
    handler._token[method](requestProperties, callback);
  } else {
    callback(405, {
      message: `${method} not allowed`,
    });
  }
};

handler._token = {};
handler._token.post = (requestProperties, callback) => {
  const phone =
    typeof requestProperties.body.phone === "string" &&
    requestProperties.body.phone.trim().length === 11
      ? requestProperties.body.phone.trim()
      : false;

  const password =
    typeof requestProperties.body.password === "string" &&
    requestProperties.body.password.trim().length > 0
      ? requestProperties.body.password.trim()
      : false;

  if (phone && password) {
    data.read("users", phone, (err, userData) => {
      if (!err && userData) {
        let hashedPassword = hash(password);
        if (hashedPassword === parseJSON(userData).password) {
          let tokenId = createRandomString(20);
          let expires = Date.now() + 1000 * 60 * 60;
          let tokenObj = {
            phone,
            id: tokenId,
            expires,
          };
          data.create("tokens", tokenId, tokenObj, (err) => {
            if (!err) {
              callback(200, tokenObj);
            } else {
              callback(500, {
                message: "Could not create the new token",
              });
            }
          });
        } else {
          callback(400, {
            message: "Password is incorrect",
          });
        }
      } else {
        callback(400, {
          message: "Could not find the specified user.",
        });
      }
    });
  } else {
    callback(400, {
      message: "Missing required fields",
    });
  }
};

handler._token.get = (requestProperties, callback) => {
  console.log("tokenLenght: ", requestProperties.queryStringObject.id.length);
  const id =
    typeof requestProperties.queryStringObject.id === "string" &&
    requestProperties.queryStringObject.id.trim().length === 20
      ? requestProperties.queryStringObject.id.trim()
      : false;
  if (id) {
    data.read("tokens", id, (err, tokenData) => {
      const token = { ...parseJSON(tokenData) };
      if (!err && token) {
        callback(200, token);
      } else {
        callback(404, { message: "token not found." });
      }
    });
  }
};

handler._token.put = (requestProperties, callback) => {
  const id =
    typeof requestProperties.body.id === "string" &&
    requestProperties.body.id.trim().length === 20
      ? requestProperties.body.id.trim()
      : false;

  const extend =
    typeof requestProperties.body.extend === "boolean" &&
    requestProperties.body.extend
      ? true
      : false;

  if (id && extend) {
    data.read("tokens", id, (err, tokenData) => {
      const token = { ...parseJSON(tokenData) };
      if (token.expires > Date.now()) {
        token.expires = Date.now() + 1000 * 60 * 60;
        data.update("tokens", id, token, (err) => {
          if (!err) {
            callback(200, token);
          } else {
            callback(500, { message: "Could not update the token." });
          }
        });
      } else {
        callback(404, { message: "token already expired." });
      }
    });
  } else {
    callback(400, {
      message: "There was a problem in the request.",
    });
  }
};
handler._token.delete = (requestProperties, callback) => {
  const id =
    typeof requestProperties.queryStringObject.id === "string" &&
    requestProperties.queryStringObject.id.trim().length === 20
      ? requestProperties.queryStringObject.id.trim()
      : false;

  if (id) {
    data.read("tokens", id, (err, tokenData) => {
      if (!err && tokenData) {
        data.delete("tokens", id, (err) => {
          if (!err) {
            callback(200, { message: "token deleted successfuly" });
          } else {
            callback(500, { message: err });
          }
        });
      } else {
        callback(404, { message: "token not found." });
      }
    });
  } else {
    callback(400, {
      message: "There was a problem with the request.",
    });
  }
};

handler._token.verifyToken = (id, phone, callback) => {
  data.read("tokens", id, (err, tokenData) => {
    if (!err && tokenData) {
      const token = { ...parseJSON(tokenData) };
      if (token.phone === phone && token.expires > Date.now()) {
        callback(true);
      } else {
        callback(false);
      }
    } else {
      callback(false);
    }
  });
};

module.exports = handler;
