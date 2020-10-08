const camelizeObject = require('camelcase-keys');
const snakeObject = require('snakecase-keys');

const {DatabaseError, MovieNotFound} = require('./../errors');

const TABLE_NAME = 'movies';

function buildMovieStore(connection) {
  const create = async (data) => {
    const dataToInsert = snakeObject(data);

    const [movie] = await connection(TABLE_NAME)
      .insert(dataToInsert)
      .returning('*')
      .catch(_onUnexpectedError);

    return camelizeObject(movie);
  }

  const findNotWatched = async () => {
    const movies = await connection(TABLE_NAME)
      .where('watched', false)
      .orderBy([{ column: 'saga_id' }, { column: 'number_on_saga' } ])
      .catch(_onUnexpectedError);

    return movies.map(camelizeObject);
  };

  const findNotWatchedBySagaId = async (sagaId) => {
    const movies = await connection(TABLE_NAME)
      .where('watched', false)
      .andWhere('saga_id', sagaId)
      .orderBy('number_on_saga', 'ASC')
      .catch(_onUnexpectedError);

    return movies.map(camelizeObject);
  };

  const findWatched = async () => {
    const movies = await connection(TABLE_NAME)
      .where('watched', true)
      .orderBy([{ column: 'saga_id' }, { column: 'number_on_saga' } ])
      .catch(_onUnexpectedError);

    return movies.map(camelizeObject);
  };

  const findWatchedBySagaId = async (sagaId) => {
    const movies = await connection(TABLE_NAME)
      .where('watched', true)
      .andWhere('saga_id', sagaId)
      .orderBy('number_on_saga', 'ASC')
      .catch(_onUnexpectedError);

    return movies.map(camelizeObject);
  };

  const findBySagaId = async (sagaId) => {
    const movies = await connection(TABLE_NAME)
      .where('saga_id', sagaId)
      .orderBy('number_on_saga', 'ASC')
      .catch(_onUnexpectedError);

    return movies.map(camelizeObject);
  };

  const findNextBySagaId = async (sagaId) => {
    const movie = await connection(TABLE_NAME)
      .where('saga_id', sagaId)
      .where('watched', false)
      .orderBy('number_on_saga', 'ASC')
      .first()
      .catch(_onUnexpectedError);

    return camelizeObject(movie);
  };

  const findById = async (id) => {
    const movie = await connection(TABLE_NAME)
      .where('id', id)
      .first()
      .catch(_onUnexpectedError);

    if (!movie) return _onNotFoundError(id);

    return camelizeObject(movie);
  };

  const findByName = async (name) => {
    const movies = await connection(TABLE_NAME)
      .whereRaw(`name ILIKE '%${name}%'`)
      .orderBy('number_on_saga', 'ASC')
      .catch(_onUnexpectedError);

    return movies.map(camelizeObject);
  }

  const markAsWatched = async (id) => {
    await connection(TABLE_NAME)
      .where('id', id)
      .update('watched', true)
      .catch(_onUnexpectedError);

    return findById(id);
  };

  const _onUnexpectedError = (error) => {
    return Promise.reject(new DatabaseError(error))
  };

  const _onNotFoundError = (sagaId) => {
    return Promise.reject(new MovieNotFound(sagaId))
  };

  return {
    create,
    findNotWatched,
    findNotWatchedBySagaId,
    findWatched,
    findWatchedBySagaId,
    findNextBySagaId,
    findBySagaId,
    findById,
    findByName,
    markAsWatched
  };
}

module.exports = buildMovieStore;
