const UseCase = require("../use-case");

class MarkMovieAsWatched extends UseCase {
  constructor(data, database) {
    super(data, database, schema);
  }

  async execute() {
    await super.execute();

    const movie = await this._database.movies.findById(this._data.movieId);
    const saga = await this._database.sagas.findById(movie.sagaId);

    const watchedAt = this._data.watchedAt || new Date();

    movie.watched = true;
    movie.watchedAt = watchedAt;

    if (movie.numberOnSaga === saga.numberOfMovies) {
      saga.watched = true;
      saga.watchedAt = watchedAt;
    }

    saga.lastMovieWatchedId = movie.id;

    await this._database.movies.update(movie);
    await this._database.sagas.update(saga);
    await this._database.sagas.incrementIndex(saga.id);

    return movie;
  }
}