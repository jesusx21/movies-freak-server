const isEmpty = require('lodash.isempty');

const { MoviesToWatchNotFound, NumberOfMoviesMustBePossitive } = require('./errors');

async function getRandomMovies(data) {
  const { numberOfMovies = 1, database } = data;

  if (numberOfMovies < 0) return onNegativeNumberOfMovies();

  const sagas = await database.sagas.findUnwatched();

  if (isEmpty(sagas)) return onEmptySagas();
  if (sagas.length === numberOfMovies) {
    const promises = sagas.map((saga) => database.movies.findNextBySagaId(saga.id));
    return Promise.all(promises);
  }

  const numberOfIndexes = sagas.length < numberOfMovies ? sagas.length : numberOfMovies;
  const randomIndexes = getRandomIndexes(numberOfIndexes, sagas.length - 1);

  const movies = await randomIndexes.reduce(async (promise, index) => {
    if (index === -1) promise;

    const result = await promise;
    const saga = sagas[index];
    const movie = await database.movies.findNextBySagaId(saga.id);

    return [ ...result, movie];
  }, Promise.resolve([]));

  return movies;
}

function onEmptySagas() {
  return Promise.reject(new MoviesToWatchNotFound());
}

function onNegativeNumberOfMovies() {
  return Promise.reject(new NumberOfMoviesMustBePossitive());
}

function getRandomIndexes(numberOfIndexes, limit) {
  const indexes = [];

  const getIndexes = () => {
    if (numberOfIndexes === 0) return indexes;

    const index =  Math.floor(Math.random() * (limit - 0) + 0);
    indexes.push(index);
    numberOfIndexes -= 1;

    return getIndexes()
  }

  return getIndexes()
}

module.exports = getRandomMovies;
