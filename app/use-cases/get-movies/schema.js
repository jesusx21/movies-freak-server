const Joi = require('joi');

const schema = Joi.object({
  sagaId: Joi.string()
    .guid({ version: ['uuidv4'] })
    .optional(),

  name: Joi.string()
    .optional(),

  watched: Joi.boolean()
    .optional(),

  limit: Joi.number()
    .integer()
    .min(1)
    .optional(),

  skip: Joi.number()
    .integer()
    .min(1)
    .optional()
});

module.exports = schema;
