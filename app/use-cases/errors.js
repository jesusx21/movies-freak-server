const VError = require('verror');

class ErrorGettingMovies extends VError {
  constructor(error, info) {
    const message = 'An error occurs when getting movies';
    const details = {
      info,
      name: 'ERROR_GETTING_MOVIES',
      cause: error
    };

    super(details, message);
  }
}

class SagaNotCreated extends VError {
  constructor(error, info) {
    const message = 'An error occurs on creating saga';
    const details = {
      info,
      name: 'COULD_NOT_CREATE_SAGA',
      cause: error
    };

    super(details, message);
  }
}

module.exports = {
  ErrorGettingMovies,
  SagaNotCreated
};
