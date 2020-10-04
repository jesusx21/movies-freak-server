const VError = require('verror');

class MoviesToWatchNotFound extends VError {
  constructor(error) {
    super({
      name: 'MOVIES_TO_WATCH_NOT_FOUND',
      info: { message: 'There is no more movies to watch' },
      cause: error
    });
  }
}

class NumberOfMoviesMustBePossitive extends VError {
  constructor(error) {
    super({
      name: 'NUMBER_OF_MOVIES_MUST_BE_POSITIVE',
      info: { message: 'The number of movies must a positive integer' },
      cause: error
    });
  }
}

module.exports = {
  MoviesToWatchNotFound,
  NumberOfMoviesMustBePossitive
};
