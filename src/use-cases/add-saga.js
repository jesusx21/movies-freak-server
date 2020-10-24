const pick = require('lodash.pick')

async function addSaga(data) {
  const { database } = data;

  const sagaData = pick(data, ['name', 'plot', 'genre', 'numberOfMovies'])
  const saga = await database.sagas.create(sagaData);

  return saga;
}

module.exports = addSaga;
