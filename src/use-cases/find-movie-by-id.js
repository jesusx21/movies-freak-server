async function findMovieById({ id, database }) {
  const _onError = async (error) => {
    if (error.name === 'MOVIE_NOT_FOUND') {
      const movies = await database.movies.findBySagaId(id);

      if (movies.length === 0) return Promise.reject(error);
      if (movies.length > 1) return Promise.reject(error);
      if (movies.length === 1) return movies[0];
    }
  }

  return database.movies.findById(id)
    .catch(_onError);
}

module.exports = findMovieById;
