async function getMovies({ useCases, database, ...data }) {
  const { numberOfMovies } = data;

  return useCases.getRandomMovies({ numberOfMovies, database });
}

module.exports = getMovies;
