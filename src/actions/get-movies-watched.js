const isEmpty = require('lodash.isempty');

async function getMoviesWatched(params) {
  const { controllers } = params;

  const movies = await controllers.getMoviesWatched(params);

  if (isEmpty(movies)) {
    console.info('There are not movies watched yet');
    return;
  }

  const separator = '_______________________________________________________________________\n';
  const moviesAsString = movies.map((movie) => {
    return `${separator}Title: ${movie.name}\nWatched At: ${movie.updatedAt}`
  });

  console.info(`\nMovies Watched:\n${moviesAsString.join('\n')}\n${separator}\n`);
}

module.exports = getMoviesWatched;
