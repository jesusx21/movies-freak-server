const VError = require('verror');

class DatabaseError extends VError {
  constructor(error) {
    const message = 'An error occurs on database';
    const details = {
      name: 'DATABASE_ERROR',
      message: 'An error occurs on database',
      cause: error
    };

    super(details, message);
  }
}

class EntityNotFound extends VError {
  constructor(entityId, entityName) {
    const message = `${entityName} with id "${entityId}" was not found`;
    const details = {
      name: 'ENTITY_NOT_FOUND',
      info: { entityId, entityName }
    };

    super(details, message);
  }
}

class InvalidId extends VError {
  constructor(id) {
    const message = `Id "${id}" is not a uuid`;
    const details = {
      name: 'INVALID_ID',
      info: { id }
    };

    super(details, message);
  }
}

class InvalidInputData extends VError {
  constructor(error, data) {
    const message = 'One or more fields are invalid';
    const details = {
      name: 'INVALID_INPUT_DATA',
      info: { data },
      cause: error
    };

    super(details, message);
  }
}

module.exports = {
  DatabaseError,
  EntityNotFound,
  InvalidId,
  InvalidInputData
};
