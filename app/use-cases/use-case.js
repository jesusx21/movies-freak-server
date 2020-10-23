const ROOT_PATH = require('app-root-path');

const { validateSchema } = require(`${ROOT_PATH}/utils`);

class UseCase {
  constructor(data, database, schema) {
    this._data = data;
    this._database = database;
    this._schema = schema;
  }

  async execute() {
    await validateSchema(this._schema, this._data);
  }
}

module.exports = UseCase;
