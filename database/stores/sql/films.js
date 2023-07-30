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

  async find() {
    let result;

    try {
      result = await this._connection('films');
    } catch (error) {
      throw new SQLDatabaseException(error);
    }

    return result.map(this._deserialize.bind(this));
  }

  findById(filmId) {
    return this._findOne('id', filmId);
  }

  async find(options = {}) {
    let items;

    try {
      const query = this._connection('films');

      if (options.skip) {
        query.offset(options.skip);
      }

      if (options.limit) {
        query.limit(options.limit);
      }

      items = await query.orderBy('created_at');
    } catch (error) {
      throw new SQLDatabaseException(error);
    }

    return {
      items: items.map(this._deserialize.bind(this)),
      totalItems: await this.count()
    };
  }

  async count() {
    try {
      const { count } = await this._connection('films')
        .count()
        .first();

      return Number(count);
    } catch (error) {
      throw new SQLDatabaseException(error);
    }
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
