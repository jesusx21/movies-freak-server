const VError = require('verror');

class ValidationError extends VError {
  constructor(error) {
    const message = 'Input data invalid';
    const details = {
      name: 'VALIDATION_ERROR',
      cause: error
    };

    super(details, message);
  }
}

module.exports = {
  ValidationError
};
