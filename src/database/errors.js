const VError = require('verror');

class DatabaseError extends VError {
  constructor(error) {
    super({
      name: 'DATABASE_ERROR',
      info: { message: 'An error occurs on database' },
      cause: error
    });
  }
}

class SagaNotFound extends VError {
  constructor(sagaId) {
    super({
      name: 'SAGA_NOT_FOUND',
      info: { message: `Saga with id "${sagaId}" was not found` }
    });
  }
}

class MovieNotFound extends VError {
  constructor(movieId) {
    super({
      name: 'MOVIE_NOT_FOUND',
      info: { message: `movie with id "${movieId}" was not found` }
    });
  }
}

module.exports = {
  DatabaseError,
  MovieNotFound,
  SagaNotFound
};
