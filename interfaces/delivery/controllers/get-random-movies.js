const RootPath = require("app-root-path");

const { GetRandomMovies } = require(`${RootPath}/app/use-cases`);

const DEFAULT_LIMIT = 1;

async function getRandomMovies(req, res) {
  const { limit = DEFAULT_LIMIT } = req.query;

  const useCase = new GetRandomMovies({ limit }, req.database);

  return useCase.execute()
    .then((movies) => res.payload(movies).statusCode(200))
    .catch((error) => res.payload({ error }).statusCode(500));
}

module.exports = getRandomMovies;
