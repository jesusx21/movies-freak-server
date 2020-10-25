const { expect } = require('chai');

const fixturesGenerator = require('./fixtures-generator');
const getDatabase = require('./get-database');
const loadFixtures = require('./load-fixtures');
const resetDatabase = require('./reset-database');

function generateFixtures(type, recipe, quantity) {
  return fixturesGenerator.generate({ type, recipe, quantity });
}

function onUnexpectedPath() {
  return Promise.reject(new Error('unexpeted path'));
}

function validateError(errorName, errorMessage = null) {
  return (error) => {
    expect(error.name).to.be.equal(errorName);

    if (errorMessage) {
      expect(error.message).to.be.equal(errorMessage);
    }
  }
}

module.exports = {
  getDatabase,
  generateFixtures,
  loadFixtures,
  resetDatabase,
  onUnexpectedPath,
  validateError
};
