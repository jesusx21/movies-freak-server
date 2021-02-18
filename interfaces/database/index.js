const buildStores = require('./stores');

function buildDatabase(connection, entitiesBuilder) {
  return buildStores(connection, entitiesBuilder);
}

module.exports = buildDatabase;
