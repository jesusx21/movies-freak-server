const { OBJECT, UUID, STRING, URL, INTEGER, DATE, FLOAT } = require('../types');

const IMDB_SCHEMA = OBJECT({
  id: UUID,
  title: STRING({ allowEmpty: false }),
  year: INTEGER({ min: 1900, max: 2100 }),
  rated: STRING({ allowEmpty: false }),
  releasedAt: DATE,
  runtime: INTEGER({ min: 1, max: 500 }),
  genre: STRING({ allowEmpty: false }),
  director: STRING({ allowEmpty: false }),
  actors: STRING({ allowEmpty: false }),
  plot: STRING({ allowEmpty: false }),
  country: STRING({ allowEmpty: false }),
  awards: STRING({ allowEmpty: false }),
  poster: URL,
  imdbRating: FLOAT({ min: 0, max: 10 }),
  rottenTomatoesRating: STRING({ allowEmpty: false }),
  imdbVotes: INTEGER({ min: 1 }),
  platformId: STRING({ allowEmpty: false }),
  production: STRING({ allowEmpty: false }),
  website: URL,
  createdAt: DATE,
  updatedAt: DATE
}, [
  'id', 'title', 'year', 'rated', 'releasedAt', 'runtime', 'genre', 'plot','country', 'awards',
  'poster', 'imdbRating', 'rottenTomatoesRating', 'imdbVotes', 'platformId', 'createdAt',
  'updatedAt'
]);

module.exports = IMDB_SCHEMA;
