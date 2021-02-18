const RootPath = require("app-root-path");
const { EntityDataInvalid, EntityError } = require("./errors");

const { validateSchema } = require(`${RootPath}/utils`);

async function buildEntity(schema, data, entityName) {
  await validateSchema(schema, data)
    .catch((error) => _onValidationError(error, data, entityName));

  const isNew = () => Boolean(data.id);

  const getId = () => data.id;

  const toJSON = () => data;

  return {
    isNew,
    getId,
    toJSON
  };
}

function _onValidationError(error, data, entityName) {
  if (error.name === 'VALIDATION_ERROR') {
    return Promise.reject(new EntityDataInvalid(error, data, entityName));
  }

  return Promise.reject(new EntityError(error, entityName));
}

module.exports = buildEntity;
