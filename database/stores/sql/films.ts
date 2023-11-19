import { Knex } from 'knex';

import { Film } from '../../../app/moviesFreak/entities';
import { FilmNotFound } from '../errors';
import { FilmSerializer } from './serializers';
import { QueryOptions, QueryResponse } from '../interfaces';
import { SQLDatabaseException } from './errors';
import { UUID } from '../../../typescript/customTypes';

class SQLFilmsStore {
  private connection: Knex;

  constructor(connection: Knex) {
    this.connection = connection;
  }

  async create(film: Film) {
    const dataToInsert = this.serialize(film);

    let result: {};

    try {
      [result] = await this.connection('films')
        .returning('*')
        .insert(dataToInsert);
    } catch (error) {
      throw new SQLDatabaseException(error);
    }

    return this.deserialize(result);
  }

  findById(filmId: UUID) {
    return this.findOne({ id: filmId });
  }

  async find(options: QueryOptions = {}): Promise<QueryResponse<Film>> {
    let items: {}[];

    try {
      const query = this.connection('films');

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
      items: items.map(this.deserialize.bind(this)),
      totalItems: await this.count()
    };
  }

  async count() {
    try {
      const result = await this.connection('films')
        .count()
        .first();

      if (!result) {
        return 0;
      }

      return Number(result.count);
    } catch (error) {
      throw new SQLDatabaseException(error);
    }
  }

  private async findOne(query = {}) {
    let result: {};

    try {
      result = await this.connection('films')
        .where(query)
        .first();
    } catch (error) {
      throw new SQLDatabaseException(error);
    }

    if (!result) {
      throw new FilmNotFound(query);
    }

    return this.deserialize(result);
  }

  private serialize(film: Film) {
    return FilmSerializer.toJSON(film);
  }

  private deserialize(data: {}) {
    return FilmSerializer.fromJSON(data);
  }
}

export default SQLFilmsStore;
