const pick = require('lodash.pick')

async function addMovie(data) {
  const { database } = data;

  const movieData = pick(data, ['name', 'plot', 'numberOnSaga', 'sagaId']);
  const movie = await database.movies.create(movieData);

  await database.sagas.incrementNumberOfMovies(movieData.sagaId);

  return movie;
}

module.exports = addMovie;
