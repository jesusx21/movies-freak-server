const { GetMovies } = require('../../../app/use-cases');

async function getMovies(req, res) {
  const useCase = new GetMovies(req.query, req.database);

  return useCase.execute()
    .then((movies) => res.payload(movies).statusCode(200))
    .catch((error) => res.payload(error).statusCode(500));
}

module.exports = getMovies;
