const Store = require('./store');

class SagasStore extends Store {
  constructor(connection) {
    super(connection);

    this._tableName = 'sagas';
    this._storeName = 'Saga'
  }

  async findUnwatched() {
    return this.find({ filter: { watched: false } });
  }
}

module.exports = SagasStore;
