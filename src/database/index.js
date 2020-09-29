const driver = require('./driver');
const buildMoviesStore = require('./stores/movies');
const buildSagasStore = require('./stores/sagas');

const database = {
  movies: buildMoviesStore(driver),
  sagas: buildSagasStore(driver)
};

module.exports = database;
