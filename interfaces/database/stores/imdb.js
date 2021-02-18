const { StoreFunctionNotImplemented } = require("../errors");
const Store = require("./store");

class IMDBStore extends Store {
  constructor(connection, buildEntity) {
    super(connection, buildEntity);

    this._tableName = 'imdb_data';
    this._storeName = 'IMDB'
  }

  update() {
    return Promise.reject(new StoreFunctionNotImplemented('update', this._storeName));
  }
}

module.exports = IMDBStore;
