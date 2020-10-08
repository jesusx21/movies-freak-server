async function findMovieByName({ name, database }) {
  return database.movies.findByName(name)
}

module.exports = findMovieByName;
