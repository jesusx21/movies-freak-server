const { OBJECT, UUID, STRING, BOOLEAN, INTEGER, DATE } = require('../types');

const MOVIE_SCHEMA = OBJECT({
  id: UUID,
  name: STRING({ allowEmpty: false }),
  plot: STRING(),
  sagaId: UUID,
  watched: BOOLEAN,
  imdbId: STRING({ allowEmpty: false }),
  numberOnSaga: INTEGER({ min: 1, max: 15 }),
  watchedAt: DATE,
  createdAt: DATE,
  updatedAt: DATE
}, [
  'id', 'name', 'plot', 'sagaId', 'numberOnSaga', 'createdAt',  'updatedAt'
]);

module.exports = MOVIE_SCHEMA
