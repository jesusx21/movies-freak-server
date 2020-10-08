async function findMovieByname({ useCases, questions, database }) {
  const name = await questions.getMovieName();

  return useCases.findMovieByName({ name, database });
}

module.exports = findMovieByname;
