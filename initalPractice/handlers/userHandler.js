const { hash, parseJSON } = require("../helpers/utitlites");
const data = require("../lib/data");
const tokenHandler = require("./tokenHandler");

const handler = {};
handler.userHandler = (requestProperties, callback) => {
  const { method, body, queryStringObject } = requestProperties;
  console.log(body);
  const acceptedMethods = ["post", "get", "put", "delete"];
  if (acceptedMethods.indexOf(method) > -1) {
    handler._users[method](requestProperties, callback);
  } else {
    callback(405, {
      message: `${method} not allowed`,
    });
  }
};

handler._users = {};
handler._users.post = (requestProperties, callback) => {
  const firstName =
    typeof requestProperties.body.firstName === "string" &&
    requestProperties.body.firstName.trim().length > 0
      ? requestProperties.body.firstName.trim()
      : false;

  const lastName =
    typeof requestProperties.body.lastName === "string" &&
    requestProperties.body.lastName.trim().length > 0
      ? requestProperties.body.lastName.trim()
      : false;

  const phone =
    typeof requestProperties.body.phone === "string" &&
    requestProperties.body.phone.trim().length === 11
      ? requestProperties.body.phone.trim()
      : false;

  const tosAgreement =
    typeof requestProperties.body.tosAgreement === "boolean" &&
    requestProperties.body.tosAgreement
      ? requestProperties.body.tosAgreement
      : false;

  const password =
    typeof requestProperties.body.password === "string" &&
    requestProperties.body.password.trim().length > 0
      ? requestProperties.body.password.trim()
      : false;

  if (firstName && lastName && phone && tosAgreement && password) {
    // Store the user
    const userObj = {
      firstName: firstName,
      lastName: lastName,
      phone: phone,
      tosAgreement: tosAgreement,
      password: hash(password),
    };
    console.log("hash from user: ", JSON.stringify(userObj));
    // Store the user
    data.create("users", phone, userObj, (err) => {
      if (!err) {
        callback(200, {
          message: "User was created",
        });
      } else {
        callback(500, {
          message: err,
        });
      }
    });
  } else {
    callback(400, {
      message: "Missing required fields",
    });
  }
};

handler._users.get = (requestProperties, callback) => {
  const phone =
    typeof requestProperties.queryStringObject.phone === "string" &&
    requestProperties.queryStringObject.phone.trim().length === 11
      ? requestProperties.queryStringObject.phone.trim()
      : false;
  if (phone) {
    const token =
      typeof requestProperties.headersObject.token === "string" &&
      requestProperties.headersObject.token
        ? requestProperties.headersObject.token
        : false;

    tokenHandler._token.verifyToken(token, phone, (tokenId) => {
      if (tokenId) {
        data.read("users", phone, (err, u) => {
          const user = { ...parseJSON(u) };
          if (!err && user) {
            delete user.password;
            callback(200, user);
          } else {
            callback(404, { message: "User not found." });
          }
        });
      } else {
        callback(403, { error: "User not authorized" });
      }
    });
  }
};
handler._users.put = (requestProperties, callback) => {
  const firstName =
    typeof requestProperties.body.firstName === "string" &&
    requestProperties.body.firstName.trim().length > 0
      ? requestProperties.body.firstName.trim()
      : false;

  const lastName =
    typeof requestProperties.body.lastName === "string" &&
    requestProperties.body.lastName.trim().length > 0
      ? requestProperties.body.lastName.trim()
      : false;

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

  if (phone) {
    if (firstName || lastName || password) {
      const token =
        typeof requestProperties.headersObject.token === "string" &&
        requestProperties.headersObject.token
          ? requestProperties.headersObject.token
          : false;

      tokenHandler._token.verifyToken(token, phone, (tokenId) => {
        if (tokenId) {
          data.read("users", phone, (err, userData) => {
            if (!err && userData) {
              const user = { ...parseJSON(userData) };
              if (firstName) {
                user.firstName = firstName;
              }
              if (lastName) {
                user.lastName = lastName;
              }
              if (password) {
                user.password = hash(password);
              }
              data.update("users", phone, user, (err) => {
                if (!err) {
                  callback(200, { message: "User updated" });
                } else {
                  callback(500, { message: err });
                }
              });
            } else {
              callback(404, { message: "User not found." });
            }
          });
        } else {
          callback(403, { error: "User not authorized" });
        }
      });
    } else {
      callback(400, {
        message: "There was a problem with the request.",
      });
    }
  } else {
    callback(400, {
      message: "There was a problem with the request.",
    });
  }
};

handler._users.delete = (requestProperties, callback) => {
  const phone =
    typeof requestProperties.queryStringObject.phone === "string" &&
    requestProperties.queryStringObject.phone.trim().length === 11
      ? requestProperties.queryStringObject.phone.trim()
      : false;
  if (phone) {
    const token =
      typeof requestProperties.headersObject.token === "string" &&
      requestProperties.headersObject.token
        ? requestProperties.headersObject.token
        : false;
    tokenHandler._token.verifyToken(token, phone, (tokenId) => {
      if (tokenId) {
        data.read("users", phone, (err, userData) => {
          if (!err && userData) {
            data.delete("users", phone, (err) => {
              if (!err) {
                callback(200, { message: "User deleted successfuly" });
              } else {
                callback(500, { message: err });
              }
            });
          } else {
            callback(404, { message: "User not found." });
          }
        });
      } else {
        callback(403, { error: "User not authorized" });
      }
    });
  } else {
    callback(400, {
      message: "There was a problem with the request.",
    });
  }
};

module.exports = handler;
