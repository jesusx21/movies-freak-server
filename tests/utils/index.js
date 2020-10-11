const fixturesGenerator = require('./fixtures-generator');
const getDatabase = require('./get-database');
const loadFixtures = require('./load-fixtures');
const resetDatabase = require('./reset-database');

const generateFixtures = (type, recipe, quantity) => {
  return fixturesGenerator.generate({ type, recipe, quantity });
};

module.exports = {
  getDatabase,
  generateFixtures,
  loadFixtures,
  resetDatabase
};
