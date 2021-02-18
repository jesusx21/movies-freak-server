const { OBJECT, UUID, STRING, BOOLEAN, INTEGER, DATE } = require('../types');

const SAGA_SCHEMA = OBJECT({
  id: UUID,
  name: STRING({ allowEmpty: false }),
  plot: STRING(),
  numberOfMovies: INTEGER({ min: 1, max: 15 }),
  currentIndex: INTEGER({ min: 0, max: 15 }),
  watched: BOOLEAN,
  lastMovieWatchedId: UUID,
  watchedAt: DATE,
  createdAt: DATE,
  updatedAt: DATE
}, [
  'id', 'name', 'numberOfMovies', 'createdAt',  'updatedAt'
]);

module.exports = SAGA_SCHEMA
