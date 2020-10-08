function getMovie(params) {
  const { controllers, questions } = params;

  const execute = () => {
    return controllers.getMovie(params)
      .then(_onSuccess)
      .catch(_onError);
  }

  const _onSuccess = async (movie) => {
    console.log(`\tId: ${movie.id}\n\tTitle: ${movie.name}\n\tPlot: ${movie.synopsis}\n`);

    const markAsWatched = await questions.markMovieAsWatched();

    if (markAsWatched) {
      await controllers.markMovieAsWatched({ ...params, movieId: movie.id  })
        .catch(_onError);
    }
  };

  const _onError = (error) => {
    if (error.name === 'MOVIE_NOT_FOUND') {
      console.error(`Movie was not found`);
    } else {
      console.error('\nAn unexpected error occurs');
      console.error(`\nError Name: ${error.name}\nError Message: ${error.message}`)
    }
  }

  return execute();
}

module.exports = getMovie;
