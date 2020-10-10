const { UUID, STRING, BOOLEAN, INTEGER, DATE } = require('../types');

const SAGA_SCHEMA = OBJECT({
  id: UUID,
  name: STRING({ allowEmpty: false }),
  plot: STRING(),
  genre: STRING({ allowEmpty: false }),
  numberOfMovies: INTEGER(1, 15),
  currentIndex: INTEGER(0, 15),
  watched: BOOLEAN,
  lastMovieWatchedId: UUID,
  createdAt: DATE,
  updatedAt: DATE
}, [
  'id', 'name', 'genre', 'numberOfMovies', 'createdAt',  'updatedAt'
]);

module.exports = SAGA_SCHEMA
