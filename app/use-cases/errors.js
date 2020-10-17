const VError = require('verror');

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
  SagaNotCreated
};
