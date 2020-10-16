async function getMoviesWatched(data) {
  const { database } = data;

  const movies = await database.movies.findWatched();

  return movies;
}

module.exports = getMoviesWatched;
