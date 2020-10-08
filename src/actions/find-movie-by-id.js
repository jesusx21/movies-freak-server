function findMovieById(params) {
  const { controllers, questions } = params;

  const execute = () => {
    return controllers.findMovieById(params)
      .then(_onSuccess)
      .catch(_onError);
  }

  const _onSuccess = async (movie) => {
    const status = movie.watched ? 'Watched' : 'Not Watched';
    console.log(`\tId: ${movie.id}\n\tTitle: ${movie.name}\n\tPlot: ${movie.synopsis}\n\t${status}`);

    if (movie.watched) return;

    const markAsWatched = await questions.markMovieAsWatched();

    if (markAsWatched) {
      await controllers.markMovieAsWatched({ ...params, movieId: movie.id })
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

module.exports = findMovieById;
