const ROOT_PATH = require('app-root-path');

const { postgres } = require(`${ROOT_PATH}/infrastructure/database/drivers`);
const buildDatabase = require(`${ROOT_PATH}/interfaces/database`);

module.exports = (driver = postgres) => buildDatabase(driver);
