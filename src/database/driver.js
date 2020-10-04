const knex = require('knex');

function getDriver() {
  const env = process.env.NODE_ENV
  const config = require('../../knexfile')[env];

  return knex(config);
}

module.exports = getDriver();
