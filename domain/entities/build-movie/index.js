const buildEntity = require('../build-entity');
const schema = require('./schema');

async function buildMovieEntity(movieData) {
  const movie = { ...movieData }
  const entity = await buildEntity(schema, movie, 'Movie');

  return entity;
}

module.exports = buildMovieEntity;
