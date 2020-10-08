const VError = require('verror');

class NotImplemented extends VError {
  constructor(error) {
    super({
      name: 'NOT_IMPLEMENTED',
      info: { message: 'Function not implemented yet' },
      cause: error
    });
  }
}

module.exports = {
  NotImplemented
};
