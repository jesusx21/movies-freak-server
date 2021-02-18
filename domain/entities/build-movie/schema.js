const Joi = require('joi');

const schema = Joi.object({
  id: Joi.string()
    .guid({ version: ['uuidv4'] })
    .optional(),
  name: Joi.string(),
  plot: Joi.string(),
  imdbId: Joi.string()
    .guid({ version: ['uuidv4'] })
    .optional()
    .allow(null),
  sagaId: Joi.string()
    .guid({ version: ['uuidv4'] })
    .optional(),
  watched: Joi.boolean()
    .optional(),
  numberOnSaga: Joi.number()
    .integer()
    .positive()
    .optional(),
  watchedAt: Joi.date()
    .optional()
    .allow(null),
  createdAt: Joi.date()
    .optional(),
  updatedAt: Joi.date()
    .optional()
});

module.exports = schema;