async function getMoviesWatched({ useCases, database }) {
  return useCases.getMoviesWatched({ database });
}

module.exports = getMoviesWatched;
