const env = {};

env.production = {
  port: 5000,
  envName: "production",
  secretKey: "adkfjhsdf",
};

env.staging = {
  port: 4000,
  envName: "staging",
  secretKey: "ererfeedg",
};

const currentEnvironments =
  typeof process.env.NODE_ENV === "string" ? process.env.NODE_ENV : "staging";

const environmentsToExport =
  typeof env[currentEnvironments] === "object"
    ? env[currentEnvironments]
    : env.staging;

module.exports = environmentsToExport;
