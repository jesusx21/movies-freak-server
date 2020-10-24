const ROOT_PATH = require('app-root-path');
const dotenv = require('dotenv');

function buildConfig() {
  const env = process.env.NODE_ENV;
  const path = `${ROOT_PATH}/infrastructure/.env/${env}.env`
  const { parsed: envObject } =  dotenv.config({ path });

  return {
    database: {
      driver: envObject.DB_DRIVER
    },
    imdb: {
      host: envObject.IMDB_HOST,
      apiKey: envObject.IMDB_API_KEY
    },
    server: {
      host: envObject.SERVER_HOST,
      port: Number(envObject.SERVER_PORT)
    }
  };
}

module.exports = buildConfig();
