const { GetMoviesFromIMDB } = require('../../../app/use-cases');

async function getMoviesFromIMDB(req, res) {
  const useCase = new GetMoviesFromIMDB(req.query);

  return useCase.execute()
    .then((movies) => res.payload(movies).statusCode(200))
    .catch((error) => res.payload({ error }).statusCode(500));
}

module.exports = getMoviesFromIMDB;
