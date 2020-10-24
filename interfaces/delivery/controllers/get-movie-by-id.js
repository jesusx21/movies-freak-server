const RootPath = require("app-root-path");

const { GetMovieById } = require(`${RootPath}/app/use-cases`);

async function getMovieById(req, res) {
  const { movieId } = req.params;

  const useCase = new GetMovieById(movieId, req.database);

  return useCase.execute()
    .then((movies) => res.payload(movies).statusCode(200))
    .catch((error) => res.payload({ error }).statusCode(500));
}

module.exports = getMovieById;
