function getMovie({ useCases, database }) {
  return useCases.getRandomMovies({ numberOfMovies: 1, database })
    .then(movies => movies[0]);
}

module.exports = getMovie;
