const Store = require('./store');

class SagasStore extends Store {
  constructor(connection, buildEntity) {
    super(connection, buildEntity);

    this._tableName = 'sagas';
    this._storeName = 'Saga'
  }

  async findUnwatched() {
    return this.find({ filter: { watched: false } });
  }

  async incrementIndex (id) {
    await this._connection(this._tableName)
      .where('id', id)
      .increment('current_index', 1)
      .catch((error) => this._onUnexpectedError(error, { id }));

    return this.findById(id);
  };
}

module.exports = SagasStore;
