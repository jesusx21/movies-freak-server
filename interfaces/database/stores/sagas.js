const Store = require('./store');

class SagasStore extends Store {
  constructor(connection) {
    super(connection);

    this._tableName = 'sagas';
    this._storeName = 'Saga'
  }
}

module.exports = SagasStore;
