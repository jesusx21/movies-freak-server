const { ValidationError } = require('./errors');

async function validateSchema(schema, data) {
  await schema.validate(data)
    .catch((error) => Promise.reject(new ValidationError(error)));
}

module.exports = validateSchema;
