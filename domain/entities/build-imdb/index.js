const buildEntity = require('../build-entity');
const schema = require('./schema');

async function buildIMDBEntity(imdbData) {
  const imdb = { ...imdbData }
  const entity = await buildEntity(schema, imdb);

  return entity;
}

module.exports = buildIMDBEntity;
