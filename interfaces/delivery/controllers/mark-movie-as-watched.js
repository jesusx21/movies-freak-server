const RootPath = require("app-root-path");

const { MarkMovieAsWatched } = require(`${RootPath}/app/use-cases`);

async function getRandomMovies(req, res) {
  const { watchedAt } = req.payload || {};
  const { movieId } = req.params;

  const useCase = new MarkMovieAsWatched({ movieId, watchedAt }, req.database);

  return useCase.execute()
    .then((movies) => res.payload(movies).statusCode(200))
    .catch((error) => res.payload({ error }).statusCode(500));
}

module.exports = getRandomMovies;
