const { process } = require('ipaddr.js');
const knex = require('knex');

function getDriver() {
  const env = process.NODE_ENV
  const config = require('../../knexfile')[env];

  return knex(config);
}

module.exports = getDriver();
