async function markMovieAsWatched(data) {
  const { movieId, database } = data;

  const movie = await database.movies.markAsWatched(movieId);
  const saga = await database.sagas.findById(movie.sagaId);

  if (movie.numberOnSaga === saga.numberOfMovies) {
    await database.sagas.markAsWatched(saga.id);
  }

  await database.sagas.addLastMovieWatched(saga.id, movie.id);
  await database.sagas.incrementIndex(saga.id);

  return movie;
}

module.exports = markMovieAsWatched;
