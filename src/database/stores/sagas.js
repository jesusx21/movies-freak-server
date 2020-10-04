const camelizeObject = require('camelcase-keys');
const snakeObject = require('snakecase-keys');

const {DatabaseError, SagaNotFound} = require('./../errors');

const TABLE_NAME = 'sagas';

function buildSagaStore(connection) {
  const create = async (data) => {
    const dataToInsert = snakeObject(data);

    const [saga] = await connection(TABLE_NAME)
      .insert(dataToInsert)
      .returning('*')
      .catch(_onUnexpectedError);

    return camelizeObject(saga);
  }

  const findUnwatched = async () => {
    const sagas = await connection(TABLE_NAME)
      .where('watched', false)
      .catch(_onUnexpectedError);

    return sagas.map(camelizeObject);
  };

  const findWatched = async () => {
    const sagas = await connection(TABLE_NAME)
      .where('watched', true)
      .catch(_onUnexpectedError);

    return sagas.map(camelizeObject);
  };

  const findById = async (id) => {
    const saga = await connection(TABLE_NAME)
      .where('id', id)
      .first()
      .catch(_onUnexpectedError);

    if (!saga) return _onNotFoundError(id);

    return camelizeObject(saga);
  };

  const markAsWatched = async (id) => {
    await connection(TABLE_NAME)
      .where('id', id)
      .update('watched', true)
      .catch(_onUnexpectedError);

    return findById(id);
  };

  const incrementNumberOfMovies = async (id) => {
    await connection(TABLE_NAME)
      .where('id', id)
      .increment('number_of_movies', 1)
      .catch(_onUnexpectedError);

    return findById(id);
  };

  const incrementIndex = async (id) => {
    await connection(TABLE_NAME)
      .where('id', id)
      .increment('current_index', 1)
      .catch(_onUnexpectedError);

    return findById(id);
  };

  const addLastMovieWatched = async (id, movieId) => {
    await connection(TABLE_NAME)
      .where('id', id)
      .update('last_movie_watched_id', movieId)
      .catch(_onUnexpectedError);

    return findById(id);
  };

  const _onUnexpectedError = (error) => {
    return Promise.reject(new DatabaseError(error))
  };

  const _onNotFoundError = (sagaId) => {
    return Promise.reject(new SagaNotFound(sagaId))
  };

  return {
    create,
    findUnwatched,
    findWatched,
    findById,
    markAsWatched,
    addLastMovieWatched,
    incrementIndex,
    incrementNumberOfMovies
  };
}

module.exports = buildSagaStore;
