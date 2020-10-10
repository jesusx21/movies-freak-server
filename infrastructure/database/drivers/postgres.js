const ROOT_PATH = require('app-root-path');
const knex = require('knex');

function getPostgresDriver() {
  const env = process.env.NODE_ENV
  const config = require(`${ROOT_PATH}/knexfile`)[env];

  return knex(config);
}

module.exports = getPostgresDriver();
