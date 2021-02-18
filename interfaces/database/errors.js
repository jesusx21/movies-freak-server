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

class InputIsNotAnEntity extends VError {
  constructor(data) {
    const message = 'Input must be an entity';
    const details = {
      name: 'INPUT_IS_NOT_AN_ENTITY',
      info: { data }
    };

    super(details, message);
  }
}

class EntityNotFound extends VError {
  constructor(query, entityName) {
    const message = `${entityName} with query "${JSON.stringify(query)}" was not found`;
    const details = {
      name: 'ENTITY_NOT_FOUND',
      info: { query, entityName }
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

class StoreFunctionNotImplemented extends VError {
  constructor(functionName, storeName) {
    const message = `The function "${functionName}" called has not been implemented on ${storeName}Store`;
    const details = {
      name: 'STORE_FUNCTION_NOT_IMPLEMENTED',
      info: { functionName, storeName }
    };

    super(details, message);
  }
}

module.exports = {
  DatabaseError,
  EntityNotFound,
  InputIsNotAnEntity,
  InvalidId,
  InvalidInputData,
  StoreFunctionNotImplemented
};
