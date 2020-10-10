const { UUID, STRING, BOOLEAN, INTEGER, DATE } = require('../types');

const MOVIE_SCHEMA = OBJECT({
  id: UUID,
  name: STRING({ allowEmpty: false }),
  plot: STRING(),
  sagaId: UUID,
  watched: BOOLEAN,
  numberOnSaga: INTEGER(1, 15),
  createdAt: DATE,
  updatedAt: DATE
}, [
  'id', 'name', 'sagaId', 'numberOnSaga', 'createdAt',  'updatedAt'
]);

module.exports = MOVIE_SCHEMA
