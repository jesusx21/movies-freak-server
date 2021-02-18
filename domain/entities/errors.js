const VError = require('verror');

class EntityError extends VError {
  constructor(error, entityName) {
    const message = `An error occurs on ${entityName} entity`;
    const details = {
      name: 'ENITTY_ERROR',
      cause: error
    };

    super(details, message);
  }
}

class EntityDataInvalid extends VError {
  constructor(error, data, entityName) {
    const message = `Data for "${entityName}" is not valid`;
    const details = {
      name: 'ENTITY_DATA_INVALID',
      cause: error,
      info: { data, entityName }
    };

    super(details, message);
  }
}

module.exports = {
  EntityError,
  EntityDataInvalid
};
