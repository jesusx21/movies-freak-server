const isEmpty = require('lodash.isempty');

function getMovies(params) {
  const { questions, controllers } = params;

  const execute = async () => {
    const numberOfMovies = await questions.getNumberOfMoviesToShow();

    return controllers.getMovies({ ...params, numberOfMovies })
      .then(_onSuccess)
      .catch(_onError);
  }

  const _onSuccess = async (movies) => {
    if (isEmpty(movies)) return;

    const movieId = await questions.showMovies(movies);

    if (!movieId) return;

    const markAsWatched = await questions.markMovieAsWatched();

    if (markAsWatched) {
      await controllers.markMovieAsWatched({ ...params, movieId })
        .catch(_onError);
    }

    const leftMovies = movies.filter((item) => item.id !== movieId);
    return _onSuccess(leftMovies);
  }

  const _onError = (error) => {
    if (error.name === 'MOVIE_NOT_FOUND') {
      console.error(`Movie was not found`);
    } else if (error.name === 'MOVIES_TO_WATCH_NOT_FOUND') {
      console.error('\nThere is no movies to watch, add more or mark all as unwatched\n');
    } else {
      console.error('\nAn unexpected error occurs');
      console.error(`\nError Name: ${error.name}\nError Message: ${error.message}`)
    }
  }

  return execute();
}

module.exports = getMovies;
