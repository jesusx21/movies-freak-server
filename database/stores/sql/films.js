import { FilmNotFound } from '../errors';
import { SQLDatabaseException } from './errors';
import { FilmSerializer } from './serializers';

export default class SQLFilmsStore {
  constructor(connection) {
    this._connection = connection;
  }

  async create(film) {
    const dataToInsert = this._serialize(film);

    let result;

    try {
      [result] = await this._connection('films')
        .returning('*')
        .insert(dataToInsert);
    } catch (error) {
      throw new SQLDatabaseException(error);
    }

    return this._deserialize(result);
  }

  findById(filmId) {
    return this._findOne('id', filmId);
  }

  async _findOne(...args) {
    let result;

    try {
      result = await this._connection('films')
        .where(...args)
        .first();
    } catch (error) {
      throw new SQLDatabaseException(error);
    }

    if (!result) {
      throw new FilmNotFound();
    }

    return this._deserialize(result);
  }

  _serialize(film) {
    return FilmSerializer.toJSON(film);
  }

  _deserialize(data) {
    return FilmSerializer.fromJSON(data);
  }
}
