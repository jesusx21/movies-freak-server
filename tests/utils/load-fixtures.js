const ROOT_PATH = require('app-root-path');
const {isPlainObject, forEach, snakeCase, cloneDeep: clone} = require('lodash');

const {postgres} = require(`${ROOT_PATH}/src/infrastructure/database/drivers`)
const COLLECTIONS = require('./config/collections');

function loadFixtures(fixturesData) {
  const execute = async () => {
    const fixtures = clone({ ...fixturesData });

    for (const storeName of Object.keys(fixtures)) {
      await insertIntoDatabase(storeName, fixtures[storeName]);
    }
  };

  const insertIntoDatabase = (storeName, fixtures) => {
    const tableName = COLLECTIONS[storeName];

    return postgres(tableName)
      .insert(fixtures.map(formatFixtures));
  };

  const formatFixtures = (fixtures) => {
    const data = {};

    forEach(fixtures, (value, key) => {
      if (isPlainObject(value)) {
        value = formatFixtures(value);
      }

      data[snakeCase(key)] = value;
    });

    return data;
  };

  return execute();
}

module.exports = loadFixtures;
