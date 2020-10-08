function markMovieAsWatched({ movieId, database, useCases }) {
  return useCases.markMovieAsWatched({ database, movieId })
}

module.exports = markMovieAsWatched;
