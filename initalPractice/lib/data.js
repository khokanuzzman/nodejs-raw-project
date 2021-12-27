const fs = require("fs");
const path = require("path");

const lib = {};

lib.baseDir = path.join(__dirname, "./../.data/");

lib.create = (dir, fileName, data, callback) => {
  fs.open(
    `${lib.baseDir + dir}/${fileName}.json`,
    "wx",
    (err, fileDescripter) => {
      if (!err && fileDescripter) {
        const stringData = JSON.stringify(data);

        fs.writeFile(fileDescripter, stringData, (err) => {
          console.log(fileDescripter);
          if (!err) {
            fs.close(fileDescripter, (err) => {
              if (!err) {
                callback(false);
              } else {
                callback("error file closing...");
              }
            });
          } else {
            callback("error file writing...");
          }
        });
      } else {
        callback("error file opening..");
      }
    }
  );
};

lib.read = (dir, fileName, callback) => {
  fs.readFile(`${lib.baseDir + dir}/${fileName}.json`, (err, data) => {
    callback(err, data);
  });
};

lib.update = (dir, fileName, data, callback) => {
  fs.open(
    `${lib.baseDir + dir}/${fileName}.json`,
    "r+",
    (err, fileDescripter) => {
      if (!err && fileDescripter) {
        const stringData = JSON.stringify(data);
        fs.ftruncate(fileDescripter, (err) => {
          if (!err) {
            fs.writeFile(fileDescripter, stringData, (err) => {
              if (!err) {
                fs.close(fileDescripter, (err) => {
                  if (!err) {
                    callback(false);
                  } else {
                    callback("error file closing...");
                  }
                });
              } else {
                callback("error file writing...");
              }
            });
          }
        });
      } else {
        callback("error file opening...");
      }
    }
  );
};

lib.delete = (dir, fileName, callback) => {
  fs.unlink(`${lib.baseDir + dir}/${fileName}.json`, (err) => {
    if (!err) {
      callback(false);
    } else {
      callback("error deleting file...");
    }
  });
};

module.exports = lib;
