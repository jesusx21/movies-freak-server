async function addSaga(data) {
  const { name, synopsis, genre, database } = data;

  const saga = await database.sagas.create({
    name,
    synopsis,
    genre
  });

  return saga;
}

module.exports = addSaga;
