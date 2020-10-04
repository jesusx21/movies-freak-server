async function addMovie(data) {
  const { name, synopsis, numberOnSaga, sagaId, database } = data;

  const movie = await database.movies.create({
    name,
    synopsis,
    sagaId,
    numberOnSaga
  });

  await database.sagas.incrementNumberOfMovies(sagaId);

  return movie;
}

module.exports = addMovie;
