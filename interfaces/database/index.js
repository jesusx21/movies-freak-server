const buildStores = require('./stores');

function buildDatabase(connection) {
  return buildStores(connection);
}

module.exports = buildDatabase;
