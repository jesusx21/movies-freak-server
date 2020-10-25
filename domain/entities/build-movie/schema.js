const Joi = require('joi');

const schema = Joi.object({
  id: Joi.string()
    .guid({ version: ['uuidv4'] }),
  name: Joi.string(),
  plot: Joi.string(),
  imdbId: Joi.string()
    .guid({ version: ['uuidv4'] }),
  sagaId: Joi.string()
    .guid({ version: ['uuidv4'] }),
  watched: Joi.boolean(),
  numberOnSaga: Joi.number()
    .integer()
    .positive(),
  watchedAt: Joi.date(),
  createdAt: Joi.date(),
  updatedAt: Joi.date()
});

module.exports = schema;