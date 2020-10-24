const RootPath = require('app-root-path');

const { AddSaga } = require(`${RootPath}/app/use-cases`);

function addSaga(req, res) {
  const useCase = new AddSaga(req.payload, req.database);

  return useCase.execute()
    .then((saga) => res.payload(saga).statusCode(201))
    .catch((error) => res.payload({ error }).statusCode(500));
}

module.exports = addSaga;
