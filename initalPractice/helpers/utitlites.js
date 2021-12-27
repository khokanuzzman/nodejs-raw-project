const crypto = require("crypto");
const environments = require("../helpers/environments");
const utilities = {};

utilities.parseJSON = (jsonString) => {
  let output = {};
  try {
    output = JSON.parse(jsonString);
  } catch {
    output = {};
  }
  return output;
};
console.log(environments.secretKey);
utilities.hash = (hashString) => {
  if (typeof hashString === "string") {
    const hash = crypto
      .createHmac("sha256", environments.secretKey)
      .update(hashString)
      .digest("hex");
    console.log("hash: ", hash);
    return hash;
  } else {
    return false;
  }
};

utilities.createRandomString = (stringLength) => {
  let length = stringLength;
  length =
    typeof stringLength === "number" && stringLength > 0 ? stringLength : false;
  let output = "";
  if (length) {
    const possibleCharacters = "abcdefghijklmnopqrstuvwxyz123456789";
    for (let i = 1; i <= length; i += 1) {
      let randomCharacter = possibleCharacters.charAt(
        Math.floor(Math.random() * possibleCharacters.length)
      );
      output += randomCharacter;
    }
    return output;
  } else {
    return false;
  }
};

module.exports = utilities;
