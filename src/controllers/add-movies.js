async function addMovies({ useCases, questions, database }) {
  const data = await questions.getAddMovieOption();

  const saga = await useCases.addSaga({ ...data, database });

  if (!data.movies) {
    data.movies = [{ ...data, numberOnSaga: 1 }];
  }

  const promises = data.movies.map((movieData) => {
    return useCases.addMovie({ ...movieData, sagaId: saga.id, database });
  });

  saga.movies = await Promise.all(promises);

  return saga;
}

module.exports = addMovies;
