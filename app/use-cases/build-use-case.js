const RootPath = require('app-root-path');

const { validateSchema } = require(`${RootPath}/utils`);

function buildUseCase(args) {
  const { schema, data } = args;

  const execute = async () => {
    if (schema) await validateSchema(schema, data);
  };

  return { execute };
}

module.exports = buildUseCase;
