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

  const findNotWatched = () => {
    const sagas = await connection(TABLE_NAME)
      .where('watched', false)
      .catch(_onUnexpectedError);

    return sagas.map(camelizeObject);
  };

  const findWatched = () => {
    const sagas = await connection(TABLE_NAME)
      .where('watched', true)
      .catch(_onUnexpectedError);

    return sagas.map(camelizeObject);
  };

  const findById = (id) => {
    const saga = await connection(TABLE_NAME)
      .where('id', id)
      .first()
      .catch(_onUnexpectedError);

    if (!saga) return _onNotFoundError(id);

    return camelizeObject(saga);
  };

  const markAsWatched = (id) => {
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
    return Promise.reject(new SagaNotFound(sagaId))
  };

  return {
    create,
    findNotWatched,
    findWatched,
    findById,
    markAsWatched
  };
}

module.exports = buildSagaStore;
