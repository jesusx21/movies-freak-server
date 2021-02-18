const VError = require('verror');

class IMDBError extends VError {
  constructor(message) {
    const details = {
      name: 'IMDB_ERROR'
    };

    super(details, message);
  }
}

module.exports = {
  IMDBError
};
