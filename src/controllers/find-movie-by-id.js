async function findMovieById({ questions, useCases, database }) {
  const movieId = await questions.getMovieId();

  return useCases.findMovieById({ id: movieId, database });
}

module.exports = findMovieById;
